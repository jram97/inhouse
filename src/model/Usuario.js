const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
    nombre_completo: {
        type: String,
        required: false,
        trim: true
    },
    user: {
        type: String,
        required: false,
        unique: true
    },
    rol: {
        type: String,
        required: false
    },
    pass: {
        type: String,
        required: false,
    }
});

UsuarioSchema.methods.encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
};

UsuarioSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.pass);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
