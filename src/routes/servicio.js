const express = require("express");
const router = express.Router();
const Servicio = require("../model/Servicio");
const { auth } = require("../lib/util");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dxmoev2hb',
    api_key: '644335251315747',
    api_secret: 't4jxKvIosZ00j9sqzn3x3yG7CzA'
});


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
    const { nombre, status, secciones } = req.body;
    const image = req.files.imagen;

    cloudinary.uploader.upload_stream({
        folder: "inhouse"
    }, (err, result) => {
        if (err) return res.status(500).json({
            mensaje: "Error interno en servidor al subir imagen: ",
            status: false
        })
        const nuevoServicio = new Servicio({
            nombre, status, secciones: secciones, imagen: result.url
        });
        nuevoServicio.save((err, nService) => {
            if (err) return res.status(500).json({ mensaje: "Error interno en servidor al guardar opcion: " + err, status: false })
            res.json({
                servicio: nService,
                status: true
            });
        });
    }).end(image.data)
})

router.put('/ws/servicios', [auth], async (req, res) => {
    if (req.files) {
        const { id, nombre, status, secciones } = req.body;
        const image = req.files.imagen;
        cloudinary.uploader.upload_stream({ folder: "inhouse" }, (err, result) => {
            if (err) return res.status(500).json({
                mensaje: "Error interno en servidor al subir imagen: ",
                status: false
            })

            Servicio.findByIdAndUpdate(id, {
                nombre, status, secciones: secciones, imagen: result.url
            }, (err, uService) => {
                if (error) return res.status(500).json({
                    mensaje: "Error interno en servidor al editar el servicio: " + err,
                    status: false
                })
                if (!uService) return res.status(500).json({
                    mensaje: "Servicio no encontrado o id no existe",
                    status: false
                })
                res.json({
                    service: uService,
                    status: true
                });
            })
        }).end(image.data)
    } else {
        const { id, nombre, status, secciones } = req.body;
        const serviceUpdate = await Servicio.findByIdAndUpdate(id, {
            nombre, status, secciones: secciones, imagen: result.url
        });

        res.json({
            service: serviceUpdate,
            status: true
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