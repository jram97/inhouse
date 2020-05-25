const mongoose = require('mongoose');
const { Schema } = mongoose;

const CotizadorSchema = new Schema({

    opciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opcion',
        require: false
    }],
    secciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seccion',
        require: false
    }],
    solicita: {
        empresa: {
            type: String,
            require: false
        },
        email: {
            type: String,
            require: false
        }
    },
    oferta: {
        type: String,
        require: false
    },
    tiempo_realizacion: {
        type: String,
        require: false
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Cotizador', CotizadorSchema);
