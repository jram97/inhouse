const express = require("express");
const router = express.Router();
const User = require("../model/Usuario");
const { auth } = require("../lib/util");

router.get('/ws/usuarios/:tipo', auth, async (req, res) => {
    try {
        const usersCount = await User.find({ rol: req.params.tipo }).count();
        const users = await User.find({ rol: req.params.tipo });
        res.json({
            users: users,
            status: true,
            cantidad: usersCount
        });
    } catch (err) {
        res.json({
            mensaje: err,
            status: false
        });
    }
})

module.exports = router;