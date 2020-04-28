const mongoose = require('mongoose');
const { Schema } = mongoose;

const SeccionSchema = new Schema({
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    step: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    opciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opcion',
        require: false
    }]
});

module.exports = mongoose.model('Seccion', SeccionSchema);
