const amqp = require("amqplib")
const uuid  =require("uuid");



connect_rabbitmq();


async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "order_created_events";
        channel.assertExchange(exchangeName, 'headers', {
            durable: false
        });

        const routeKey = "";
        setInterval(() => {
            const order = {
                id: uuid.v4(),
                createdDate: new Date().getTime()
            }
            channel.publish(exchangeName, routeKey, Buffer.from(JSON.stringify(order)), {
                headers:{
                    format: "pdf"
                }});
            console.log("Gönderilen Mesaj", order);
        }, 1000);


    } catch (error) {
        console.log(error);
    }

}
