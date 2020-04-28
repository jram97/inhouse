const express = require("express");
const router = express.Router();
const Servicio = require("../model/Servicio");
const { auth } = require("../lib/util");

router.get('/ws/servicios-public/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const servicios = await Servicio.findOne({ _id: id }).populate("secciones").populate({
            path: 'secciones',
            populate: {
                path: 'opciones',
                model: 'Opcion'
            }
        });
        res.json({
            servicios: servicios,
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})


router.get('/ws/servicios-public', async (req, res) => {
    try {
        const count = await Servicio.find({}).count();
        const servicios = await Servicio.find({}).populate("secciones").populate({
            path: 'secciones',
            populate: {
                path: 'opciones',
                model: 'Opcion'
            }
        });
        res.json({
            servicios: servicios,
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

router.get('/ws/servicios-admin', async (req, res) => {
    try {
        const count = await Servicio.find({}).count();
        const servicios = await Servicio.find({}).populate("secciones");
        res.json({
            servicios: servicios,
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

router.get('/ws/servicios', async (req, res) => {
    try {
        const count = await Servicio.find({ status: true }).count();
        const servicios = await Servicio.find({ status: true }).populate("secciones");
        res.json({
            servicios: servicios,
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

router.get('/ws/servicios/:id', async (req, res) => {
    try {

        const id = req.params.id;
        const servicio = await Servicio.findOne({ _id: id }).populate("secciones");
        res.json({
            servicio: servicio,
            status: true,
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.post('/ws/servicios', [auth], async (req, res) => {
    try {
        const { nombre, status, secciones } = req.body;
        const nuevoServicio = new Servicio({
            nombre, status, secciones: secciones
        });
        await nuevoServicio.save();
        res.json({
            servicio: nuevoServicio,
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.put('/ws/servicios', [auth], async (req, res) => {
    try {
        const { id, nombre, status, secciones } = req.body;

        await Servicio.findByIdAndUpdate(id, {
            nombre, status, secciones: secciones
        });

        const servicioActualizado = await Servicio.findById({ _id: id }).populate("secciones")

        res.json({
            servicio: servicioActualizado,
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

router.delete('/ws/servicios/:id', [auth], async (req, res) => {
    try {
        const id = req.params.id;
        await Servicio.findByIdAndRemove({ _id: id });
        res.json({
            mensaje: "Servicio eliminada con exito",
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