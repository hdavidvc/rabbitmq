const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

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

connectQueue()
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
            console.log(error)
        }
    }
}

async function connectReady() {
    channel = await connection.createChannel()

    await channel.assertQueue("Whatsapp")

    channel.consume("Whatsapp", data => {
        console.log("MENSAJE RECIBIDO : ", `${Buffer.from(data.content)}`);
        channel.ack(data);


    })
}
app.listen(PORT, () => console.log("Corriendo en el puerto " + PORT));