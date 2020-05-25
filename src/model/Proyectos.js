const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProyectoSchema = new Schema({

    nombre_proyecto: {
        type: String
    },
    comentarios: {
        type: String
    },
    nombre_completo: {
        type: String
    },
    email: {
        type: String
    },
    nombre_empresa: {
        type: String
    },
    tipo_empresa: {
        type: String
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

module.exports = mongoose.model('Proyecto', ProyectoSchema);
