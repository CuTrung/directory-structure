const mqtt = require('mqtt')
const config = require('../../../config/config');

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

// connect options
const OPTIONS = {
    keepalive: 60,
    clientId,
    connectTimeout: 4000,
    username: config.MQTT.USERNAME,
    password: config.MQTT.PASSWORD,
    reconnectPeriod: 1000,
    port: 8883,
    host: config.MQTT.HOST,
}

// default is mqtt, unencrypted tcp connection
// let connectUrl = `mqtt://${host}:${port}`;
let connectUrl = `mqtts://${config.MQTT.HOST}`;

const client = mqtt.connect(connectUrl, OPTIONS)

client.on('connect', () => {
    console.log(` Connected`)
})

client.on('reconnect', (error) => {
    console.log(`Reconnecting(:`, error)
})

client.on('error', (error) => {
    console.log(`Cannot connect(:`, error)
})

client.on('message', (toppic, msg) => {
    // console.log(`msg:1`, new Date(), '=>>', msg.toString())

})

const push = (context) => {
    if (client) {
        // console.log(`Connected ${client.connected}`)
        const { topic, qos, payload } = context;
        console.log(`Push ${topic}`)
        client.publish(topic, payload, { qos, retain: false }, error => {
            if (error) {
                console.log('Publish error: ', error);
            }
        });
    }
    else {
        console.log('Khong push')
    }
}

module.exports = {
    client,
    push
}
