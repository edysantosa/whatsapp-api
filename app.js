const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client, LocalAuth } = require('whatsapp-web.js');
const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());

var currentQrCode='';

whatsapp.on('qr', (qr) => {
    console.log('Server belum login. Scan qrcode dibawah untuk login');
    qrcode.generate(qr, {small: true});
    currentQrCode = qr;
});

whatsapp.on('ready', () => {
    console.log('Server siap!');
});

whatsapp.on('disconnected', () => {
    whatsapp.initialize();
});

whatsapp.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

// whatsapp.initialize();


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

// Kirim pesan whatsapp
app.post('/send', (req, res) => {
    let data = req.body;
    res.send('Data Received: ' + data.yyy);
    console.log(data.yyy);
});