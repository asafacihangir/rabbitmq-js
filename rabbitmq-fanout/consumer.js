const amqp = require("amqplib")

const queueName = process.argv[2] || "foo.shipping";


connect_rabbitmq();

async function connect_rabbitmq() {

    try {

        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);

        const exchangeName = "foo.exchange";
        const routeKey = "";
        channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });
        await channel.bindQueue(queueName, exchangeName, routeKey);


        channel.consume(queueName, message => {
            console.log("Message", message.content.toString());
            channel.ack(message);
        });

    } catch (error) {
        console.log(error);
    }

}