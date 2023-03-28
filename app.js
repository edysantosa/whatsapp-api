const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

// const { Client, LocalAuth } = require('whatsapp-web.js');
// const whatsapp = new Client({
//     authStrategy: new LocalAuth()
// });

// whatsapp.on('qr', (qr) => {
//     qrcode.generate(qr, {small: true});
// });

// whatsapp.on('ready', () => {
//     console.log('Client is ready!');
// });

// whatsapp.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     } else if (msg.body == 'status') {
//         whatsapp.getState().then((result) => { 
//             console.log("Whatsapp Client State =", result);
//         });
//     }
// });

// whatsapp.initialize();



app.listen(8000, function() {
    console.log('App express berjalan di port *:8000');
});

app.get('/', (req, res) => {
    res.status(200).json({
        result: true,
        message: "Hallo world"
    });
});

app.post('/status', (req, res) => {
    res.status(200).json({
        result: true,
        message: "Hallo worrldxxx"
    });
});
