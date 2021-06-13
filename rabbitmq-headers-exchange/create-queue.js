const amqp = require("amqplib")


connect_rabbitmq();

async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "order_created_events";

        channel.assertExchange(exchangeName, 'headers', {
            durable: false
        });


        const queuesWithRoutingKey = [
            {
                queueName: "Q1",
                arguments: {
                    "format" : "pdf",
                    "type": "report",
                    "x-match" : "all",
                }
            },
            {
                queueName: "Q2",
                arguments: {
                    "format" : "pdf",
                    "type": "log",
                    "x-match" : "any",
                }
            },
            {
                queueName: "Q3",
                arguments: {
                    "format" : "zip",
                    "type": "report",
                    "x-match" : "all",
                }
            },

        ]

        const routingKey = "";
        for (let item of queuesWithRoutingKey) {
            await channel.assertQueue(item.queueName);
            await channel.bindQueue(item.queueName, exchangeName, "", item.arguments);
        }

    } catch (error) {
        console.log(error);
    }

}