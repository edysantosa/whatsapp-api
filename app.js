const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

const { Client, LocalAuth } = require('whatsapp-web.js');
const whatsapp = new Client({
    authStrategy: new LocalAuth()
});


var currentQrCode;

whatsapp.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    currentQrCode = qr;
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

whatsapp.initialize();


// Jalankan express di port 8000
app.listen(8000, function() {
    console.log('App express berjalan di port *:8000');
});

// Testing get
app.get('/', (req, res) => {
    res.status(200).json({
        result: true,
        message: "Hallo world"
    });
});

// Dapatkan status koneksi whatsapp-js
app.get('/status', (req, res) => {
    whatsapp.getState().then((result) => {
        let returnStatus = true;
        if (result !== 'CONNECTED') {
            returnStatus = false;
        }
        res.status(200).json({
            result: returnStatus,
            message: result
        });
    }).catch(function(error) {
        res.status(200).json({
            result: false,
            message: 'DISCONNECTED'
        });
    });
});

// Dapatkan qrcode untuk otentifikasi
app.get('/qr', (req, res) => {
    res.status(200).json({
        result: true,
        message: currentQrCode
    });
});