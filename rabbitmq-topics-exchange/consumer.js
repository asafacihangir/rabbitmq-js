const amqp = require("amqplib")


connect_rabbitmq();


const routeKey = process.argv[2] || "#";

async function connect_rabbitmq() {

    try {

        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "orders_data_exchange";
        channel.assertExchange(exchangeName, 'topic', {
            durable: false
        });


        const queueName = "";
        await channel.assertQueue(queueName);
        await channel.bindQueue(queueName, exchangeName, routeKey);

        channel.consume(queueName, message => {
            console.log(" [x] %s:'%s'", message.fields.routingKey, message.content.toString());
            channel.ack(message);
        });

    } catch (error) {
        console.log(error);
    }

}