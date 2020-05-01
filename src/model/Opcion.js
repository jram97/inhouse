const mongoose = require('mongoose');
const { Schema } = mongoose;

const OpcionSchema = new Schema({
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    descripcion: {
        type: String,
        required: false,
        trim: true
    },
    icono: {
        type: String,
        required: false
    },
    tiempo: {
        type: Number,
        required: false
    },
    precio: {
        type: Number,
        required: false
    },
    step: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Opcion', OpcionSchema);
