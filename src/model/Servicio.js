const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServicioSchema = new Schema({
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    secciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seccion',
        require: false
    }],
});

module.exports = mongoose.model('Servicio', ServicioSchema);
