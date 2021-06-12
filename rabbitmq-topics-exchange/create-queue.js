const amqp = require("amqplib")


connect_rabbitmq();

async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "orders_data_exchange";

        channel.assertExchange(exchangeName, 'topic', {
            durable: false
        });


        const queuesWithRoutingKey = [
            {
                "queueName": "marketingQueue",
                "routingKey": "queue.marketing"
            },
            {
                "queueName": "financeQueue",
                "routingKey": "queue.finance"
            },
            {
                "queueName": "adminQueue",
                "routingKey": "queue.admin"
            },
            {
                "queueName": "allQueue",
                "routingKey": "queue.*"
            }
        ]

        for (let item of queuesWithRoutingKey) {
            await channel.assertQueue(item.queueName);
            await channel.bindQueue(item.queueName, exchangeName, item.routingKey);
        }

    } catch (error) {
        console.log(error);
    }

}