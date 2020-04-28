const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const config = require('./keys');
const cors = require('cors')

// Intializations.
const app = express();
require('./database');
app.use(fileUpload());

// Settings
app.set('port', process.env.PORT || 9999);
app.set('llave', config.llave);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cors())

// Routes
app.use(require('./routes/auth'));
app.use(require('./routes/seccion'));
app.use(require('./routes/opcion'));
app.use(require('./routes/servicio'));
app.use(require('./routes/cotizador'));

// Public
app.use(express.static(path.join(__dirname, './public')));

// Starting
app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
});