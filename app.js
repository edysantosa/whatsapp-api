const qrcode = require('qrcode-terminal');
const express = require('express');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});
 
const app = express();


client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

// client.initialize();


app.listen(8000, function() {
    console.log('App express berjalan di port *:8000');
});

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Hallo worrld"
    });
});