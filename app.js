const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const whatsapp = new Client({
    authStrategy: new LocalAuth()
});

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));

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
    console.log(msg.body);
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

whatsapp.initialize();


// Jalankan express di port 8000
app.listen(8000, function() {
    console.log('Server berjalan di port *:8000');
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
app.post('/send-message', (req, res) => {
    let data = req.body;
    // res.send('Number : ' + data.phone);
    whatsapp.sendMessage(sanitizePhoneNumber(data.phone), data.message).then((result) => {
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

    if (!data.image || !data.mimetype || !data.phone) {
        res.status(200).json({
            result: true,
            message: "Gambar/mimetype/phone perlu diisi"
        });
    }

    var media = new MessageMedia(data.mimetype, data.image, data.filename);

    whatsapp.sendMessage(sanitizePhoneNumber(data.phone), media, {caption: data.caption}).then((result) => {
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

function sanitizePhoneNumber(phone) {
    //First remove all spaces:
    phone = phone.replace(/\s/g, '');

    if(phone.startsWith("+")){
        // Kalo awalan nomor ada + berarti hilangkan +nya aja
        phone = phone.substr(1);
    } else if(phone.startsWith("0")){
        // Kalo awalan 0 ganti dengan 62
        phone = "62" + phone.substr(1);
    }

    // Format ke nomor wa dan return
    return phone.includes('@c.us') ? phone : `${phone}@c.us`;
}