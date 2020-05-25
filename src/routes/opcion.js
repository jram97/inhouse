const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Opcion = require("../model/Opcion");
const { auth } = require("../lib/util");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dxmoev2hb',
    api_key: '644335251315747',
    api_secret: 't4jxKvIosZ00j9sqzn3x3yG7CzA'
});


router.get("/ws/opciones-admin", async (req, res) => {
    try {
        const count = await Opcion.find({}).count();
        const opcion = await Opcion.find({})
            .sort({ nombre: 1 });
        res.json({
            opciones: opcion,
            status: true,
            cantidad: count
        });
    } catch (err) {
        res.json({
            mensaje: "Algo salio mal",
            status: false
        });
    }
});

router.get("/ws/opciones", async (req, res) => {
    try {
        const count = await Opcion.find({ status: true }).count();
        const opcion = await Opcion.find({ status: true })
            .sort({ nombre: 1 });
        res.json({
            opciones: opcion,
            status: true,
            cantidad: count
        });
    } catch (err) {
        res.json({
            mensaje: "Algo salio mal",
            status: false
        });
    }
});

router.get("/ws/opciones/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const opcion = await Opcion.findOne({ _id: id });
        res.json({
            opcion: opcion,
        });
    } catch (err) {
        res.json({
            mensaje: "Algo salio mal",
            status: false
        });
    }
});

router.post("/ws/opciones", [auth], async (req, res) => {

    const { nombre, precio, step, descripcion, tiempo } = req.body;
    const icon = req.files.icono;


    cloudinary.uploader.upload_stream({
        folder: "inhouse"
    },(err,result) =>{
        if (err) return res.status(500).json({
            mensaje: "Error interno en servidor al subir imagen: ",
            status: false
        })
        const nuevaOpcion = new Opcion({
            nombre,
            step,
            descripcion,
            tiempo,
            icono: result.url,
            precio
        });
        nuevaOpcion.save((err,nOpcion)=>{
            if(err) return res.status(500).json({mensaje:"Error interno en servidor al guardar opcion: " + err,status:false})
            res.json({
                opcion: nOpcion,
                status: true
            });
        });
    }).end(icon.data)


});

router.put("/ws/opciones", [auth], async (req, res) => {
    if (req.files) {
        try {
            const { id, step, nombre, precio, tiempo, descripcion } = req.body;
            const icon = req.files.icono;
            cloudinary.uploader.upload_stream({folder: "inhouse"},(err,result) =>{
                if (err) return res.status(500).json({
                    mensaje: "Error interno en servidor al subir imagen: ",
                    status: false
                })
                let tOpcion = {
                    nombre,
                    step,
                    tiempo,
                    descripcion,
                    icono: result.url,
                    precio
                }
                Opcion.findByIdAndUpdate(id, tOpcion, (err, uOpcion) => {
                    if (error) return res.status(500).json({
                        mensaje: "Error interno en servidor al editar opcion: " + err,
                        status: false
                    })
                    if(!uOpcion)return res.status(500).json({
                        mensaje: "Opcion no encontrada id no existe",
                        status: false
                    })
                    res.json({
                        opcion: uOpcion,
                        status: true
                    });
                })
            }).end(icon.data)

        } catch (err) {
            res.json({
                mensaje: err,
                status: false
            });
        }

    } else {
        try {
            const { id, step, nombre, precio, descripcion, tiempo } = req.body;
            const opcionActualizada = await Opcion.findByIdAndUpdate(id, {
                nombre,
                step,
                descripcion,
                precio,
                tiempo
            })
            res.json({
                opcion: opcionActualizada,
                status: true
            });
        } catch (err) {
            res.json({
                mensaje: err,
                status: false
            });
        }

    }
});

router.delete("/ws/opciones/:id", [auth], async (req, res) => {
    try {
        const id = req.params.id;

        const opcion = await Opcion.findOne({ _id: id });

        borraImagen(opcion.icono)

        await Opcion.findByIdAndRemove({ _id: id });
        res.json({
            mensaje: "Opcion eliminada con exito",
            status: true
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
});

function borraImagen(nombreImagen) {
    try {
        let pathImagen = path.resolve(
            __dirname,
            `../public/${nombreImagen}`
        );
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    } catch (err) {
        console.error("Image was not deleted");
    }
}


module.exports = router;