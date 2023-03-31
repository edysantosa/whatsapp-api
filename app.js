const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
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

whatsapp.on('change_state', (reason) => {
  // console.log('Client was logged out.', reason)
});

whatsapp.on('message', async msg => {
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

// Kirim pesan whatsapp
app.post('/send', (req, res) => {
    let data = req.body;
    // res.send('Number : ' + data.number);
    whatsapp.sendMessage(sanitizeNumber(data.number), data.message).then((result) => {
        res.status(200).json({
            result: true,
            message: "Pesan terkirim"
        });
    }).catch(function(error) {
        res.status(500).json({
            result: false,
            message: error.message
        });
    });;
});

// Kirim pesan gambar
app.post('/send-image', (req, res) => {
    let data = req.body;

    var media = new MessageMedia("image/jpg", "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", "myimage.jpg");

    whatsapp.sendMessage("6281999066412@c.us", media, {caption: "my image"}).then((result) => {
        res.status(200).json({
            result: true,
            message: "Pesan terkirim"
        });
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({
            result: false,
            message: error.message
        });
    });;
});

function sanitizeNumber(number) {
    //First remove all spaces:
    number = number.replace(/\s/g, '');

    if(number.startsWith("+")){
        // Kalo awalan nomor ada + berarti hilangkan +nya aja
        number = number.substr(1);
    } else if(number.startsWith("0")){
        // Kalo awalan 0 ganti dengan 62
        number = "62" + number.substr(1);
    }

    // Format ke nomor wa dan return
    return number.includes('@c.us') ? number : `${number}@c.us`;
}