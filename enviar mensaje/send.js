const express = require("express");
const app = express();
const PORT = process.env.PORT || 4003;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

const Settings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'hdavidvc',
    password: 'hdavidvc',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}


connectQueue();
async function connectQueue() {
    try {
        connection = await amqp.connect(Settings);
        connectReady();

    } catch (error) {
        try {
            Settings.port = 5673
            connection = await amqp.connect(Settings);
            connectReady();

        } catch (error) {
            console.log("Error al conectar", error)
        }
    }
}

async function connectReady() {
    console.log('Conectado');
    channel = await connection.createChannel()

    await channel.assertQueue("Whatsapp")
}
const sendData = async(data) => {
    if (!connection) {
        connectQueue();
    }
    await channel.sendToQueue("Whatsapp", Buffer.from(JSON.stringify(data)));

    // await channel.close();
    // await connection.close();
}

app.get("/send", (req, res) => {
    const data = {
        title: "SALUDO",
        mensaje: "Hola como estas?"
    }


    sendData(data);

    console.log("Envié un mensaje")
    res.send("Message Sent");

})


app.listen(PORT, () => console.log("Corriendo en el puerto " + PORT));