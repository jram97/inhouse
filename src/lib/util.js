const fs = require("fs");
const key = require("../keys");
const jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");
const path = require('path');
const PDFDocument = require('pdfkit');


const util = {};

util.auth = (req, res, next) => {

    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, key.llave, (err, decoded) => {
            if (err) {
                return res.json({
                    mensaje: 'El token ingresado, es invalido',
                    status: false
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'El token a expirado.',
            status: false
        });
    }
};

util.createPdf = (email) => {

    const doc = new PDFDocument;

    doc.pipe(fs.createWriteStream(path.join(__dirname, `../public/pdf/${email}.pdf`)));

    /*doc.font('fonts/PalatinoBold.ttf')
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100);*/

    doc.image(path.join(__dirname, `../public/imagenes/rootsInhouseSV-4727.png`), {
        fit: [250, 300],
        align: 'center',
        valign: 'center'
    });

    doc.addPage()
        .fontSize(25)
        .text('Here is some vector graphics...', 100, 100);

    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

    doc.scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    doc.addPage()
        .fillColor("blue")
        .text('Here is a link!', 100, 100)
        .underline(100, 100, 160, 27, { color: "#0000FF" })
        .link(100, 100, 160, 27, 'http://google.com/');

    doc.end();

}

util.sendCotizacion = (email) => {
    try {
        let transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "jbarillasramirez@gmail.com",
                pass: "xxxxx"
            }
        });

        const URL = "https://www.google.com/"

        let mailOptions = {
            from: "Roots INC SV <no-reply@solucionesroots.com>",
            replyTo: "no-reply@solucionesroots.com",
            to: email,
            subject: "¡Cotización de parte de Soluciones Roots SV✔!",
            html: `<p style="font-size: 16px;color: #808080"">¡Querido ${email}!<p> <br>
                    <p style="font-size: 15px;color: #808080; line-height: 1.5;">Te saludamos de parte de Inhouse<br>
                    Te enviamos este correo debido a la cotización que tú o tu organización acaba de realizar en ${URL}</p><br><br><br><br>
                    <p style="font-size: 12px;color: #808080">Att: Equipo de Soluciones Roots</p>`,
            attachments: [{
                filename: `${email}.pdf`,
                path: path.join(__dirname, `../public/pdf/${email}.pdf`),
                contentType: 'application/pdf'
            }],
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log(
                "Message %s sent: %s",
                info.messageId,
                info.response
            );
        });
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = util;
