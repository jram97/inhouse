const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Opcion = require("../model/Opcion");
const { auth } = require("../lib/util");

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

    try {
        const { nombre, precio, step, descripcion } = req.body;
        const icon = req.files.icono;

        let nombreCortado = icon.name.split(".");
        let extension = nombreCortado[nombreCortado.length - 1];
        let img = `/imagenes/${nombre}-${new Date().getMilliseconds()}.${extension}`;

        icon.mv(path.join(__dirname, "../public/" + img), (err) => {
            if (err) {
                console.log(err);
            }
        });
        const nuevaOpcion = new Opcion({
            nombre,
            step,
            descripcion,
            icono: img,
            precio
        });
        await nuevaOpcion.save();
        res.json({
            opcion: nuevaOpcion,
            status: true
        });

    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
});

router.put("/ws/opciones", [auth], async (req, res) => {
    if (req.files) {
        try {
            const { id, step, nombre, precio, descripcion } = req.body;
            const icon = req.files.icono;
            let nombreCortado = icon.name.split(".");
            let extension = nombreCortado[nombreCortado.length - 1];

            if (extension == "jpg" || extension == "png" || extension == "PNG" || extension == "JPG" || extension == "JPGE" || extension == "jpeg") {
                const getImagen = await Opcion.findOne({ _id: id });
                borraImagen(getImagen.icono);
                let img = `/imagenes/rootsInhouseSV-${new Date().getMilliseconds()}${new Date().getSeconds()}.${extension}`;
                icon.mv(path.join(__dirname, "../public/" + img), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                const opcionActualizada = await Opcion.findByIdAndUpdate(id, {
                    nombre,
                    step,
                    descripcion,
                    icono: img,
                    precio
                })
                res.json({
                    opcion: opcionActualizada,
                    status: true
                });
            } else {
                res.json({
                    mensaje: "Formato de imagen no soportado",
                    status: false
                });
            }

        } catch (err) {
            res.json({
                mensaje: err,
                status: false
            });
        }

    } else {
        try {
            const { id, step, nombre, precio, descripcion } = req.body;
            const opcionActualizada = await Opcion.findByIdAndUpdate(id, {
                nombre,
                step,
                descripcion,
                precio
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