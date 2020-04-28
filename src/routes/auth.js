const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const key = require("../keys")
const Usuario = require("../model/Usuario");

router.get("/", async (req, res) => {
    const usuario = "rootsInc";
    const exist = await Usuario.findOne({ user: usuario })
    if (!exist) {
        const nuevaData = new Usuario({
            user: usuario
        });
        nuevaData.pass = await nuevaData.encryptPassword("admin");
        await nuevaData.save();
        res.json({
            mensaje: 'Data inicial cargada',
            status: true
        });
    } else {
        res.json({
            mensaje: 'No se pudo cargar la data inicial, ya ha sido cargada',
            status: false
        });
    }
});

router.post('/ws/auth', async (req, res) => {
    try {
        const { user, pass } = req.body;
        console.log(req.body)
        if (user && pass) {
            const userDB = await Usuario.findOne({ user: user });
            if (!userDB) {
                res.json({
                    mensaje: 'Usuario no existe en la base de datos',
                    status: false
                });
            } else {
                const match = await userDB.matchPassword(pass);
                if (match) {
                    const payload = {
                        check: true
                    };
                    const token = jwt.sign(payload, key.llave, {
                        expiresIn: 15440
                    });
                    res.json({
                        user: userDB.user,
                        mensaje: 'Autenticacion existosa',
                        status: true,
                        token: token
                    });
                } else {
                    res.json({
                        mensaje: "Usuario o contraseña incorrectos",
                        status: false
                    })
                }
            }
        } else {
            res.json({
                mensaje: "Campos vacios",
                status: false
            })
        }
    } catch (err) {
        res.json({
            mensaje: "Algo salio mal",
            status: false
        })
    }
})

module.exports = router;
