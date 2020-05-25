const express = require("express");
const router = express.Router();
const Proyecto = require("../model/Proyectos");
const { auth } = require("../lib/util");

router.get('/ws/proyecto-admin', auth, async (req, res) => {
    try {
        const count = await Proyecto.find({}).count();
        const proyecto = await Proyecto.find({});
        res.json({
            proyectos: proyecto,
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


router.get('/ws/proyecto', async (req, res) => {
    try {
        const count = await Proyecto.find({ }).count();
        const proyecto = await Proyecto.find({ });
        res.json({
            proyectos: proyecto,
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

router.post('/ws/proyecto', async (req, res) => {
        const { nombre_proyecto, comentarios, nombre_completo, email, nombre_empresa,
            tipo_empresa,  } = req.body;
        const nuevoProyecto = new Proyecto({
            nombre_proyecto, comentarios, nombre_completo, email, nombre_empresa, tipo_empresa
        })
        /*utils.createPdf(email);
        utils.sendCotizacion(email)*/

        const envio = await nuevoProyecto.save();
        res.json({
            cotizacion: envio,
            status: true
        });
})


module.exports = router;