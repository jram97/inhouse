const express = require("express");
const router = express.Router();
const Seccion = require("../model/Seccion");
const { auth } = require("../lib/util");

router.get('/ws/secciones-admin', async (req, res) => {
    try {
        const count = await Seccion.find({}).count();
        const seccion = await Seccion.find({}).sort({ step: 1 }).populate("opciones");
        res.json({
            secciones: seccion,
            status: true,
            cantidad: count
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.get('/ws/secciones', async (req, res) => {
    try {
        const count = await Seccion.find({ status: true }).count();
        const seccion = await Seccion.find({ status: true }).sort({ step: 1 }).populate("opciones");
        res.json({
            secciones: seccion,
            status: true,
            cantidad: count
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.get('/ws/secciones/:id', async (req, res) => {
    try {

        const id = req.params.id;

        const seccion = await Seccion.findOne({ _id: id }).populate("opciones");
        res.json({
            seccion: seccion,
            status: true,
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.post('/ws/secciones', [auth], async (req, res) => {
    try {
        const { nombre, step, opciones } = req.body;
        const nuevaSeccion = new Seccion({
            nombre, step, opciones: opciones
        });
        await nuevaSeccion.save();
        res.json({
            seccion: nuevaSeccion,
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.put('/ws/secciones', [auth], async (req, res) => {
    try {
        const { id, nombre, step, opciones, status } = req.body;

        await Seccion.findByIdAndUpdate(id, {
            nombre, step, status, opciones: opciones
        });

        const seccionActualizada = await Seccion.findById({ _id: id }).populate("opciones")

        res.json({
            seccion: seccionActualizada,
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.delete('/ws/secciones/:id', [auth], async (req, res) => {
    try {
        const id = req.params.id;
        await Seccion.findByIdAndRemove({ _id: id });
        res.json({
            mensaje: "Seccion eliminada con exito",
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

module.exports = router;