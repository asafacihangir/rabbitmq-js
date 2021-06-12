const amqp = require("amqplib")
const uuid  =require("uuid");



connect_rabbitmq();

const routeKey = process.argv[2] || "queue.*";

async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "orders_data_exchange";
        channel.assertExchange(exchangeName, 'topic', {
            durable: false
        });

        setInterval(() => {
            const order = {
                id: uuid.v4(),
                routeKey: "KC_" + routeKey,
                createdDate: new Date().getTime()
            }
            channel.publish(exchangeName, routeKey, Buffer.from(JSON.stringify(order)));
            console.log("Gönderilen Mesaj", order);
        }, 1000);


    } catch (error) {
        console.log(error);
    }

}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'topic_logs';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(key) {
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});