const amqp = require("amqplib")


connect_rabbitmq();

async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "orders_data_exchange";
        const routeKey = "customer.order";

        channel.assertExchange(exchangeName, 'direct', {
            durable: false
        });

        const queueName1= "customer.invoice";
        const queueName2= "customer.shipping";

        await channel.assertQueue(queueName1);
        await channel.assertQueue(queueName2);

        await channel.bindQueue(queueName1, exchangeName, routeKey);
        await channel.bindQueue(queueName2, exchangeName, routeKey);



    } catch (error) {
        console.log(error);
    }

}