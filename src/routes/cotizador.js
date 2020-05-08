const express = require("express");
const router = express.Router();
const Cotizador = require("../model/Cotizador");
const { auth } = require("../lib/util");
var utils = require("../lib/util");

router.get('/ws/cotizador-admin', auth, async (req, res) => {
    try {
        const count = await Cotizador.find({}).count();
        const cotizador = await Cotizador.find({}).populate("opciones").populate("secciones");
        res.json({
            cotizador: cotizador,
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


router.get('/ws/cotizador', async (req, res) => {
    try {
        const count = await Cotizador.find({ status: true }).count();
        const cotizador = await Cotizador.find({ status: true }).populate("opciones").populate("secciones");
        res.json({
            cotizador: cotizador,
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

router.post('/ws/cotizador', async (req, res) => {
        const { opciones, secciones, empresa, email } = req.body;
        const nuevaCotizacion = new Cotizador({
            opciones: opciones, secciones: secciones, solicita: {
                empresa: empresa,
                email: email
            }
        });
        /*utils.createPdf(email);
        utils.sendCotizacion(email)*/

        const envio = await nuevaCotizacion.save();
        res.json({
            cotizacion: envio,
            status: true
        });
})


module.exports = router;