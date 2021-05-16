const amqp = require("amqplib")


const message = {
    description: "Bu bir test mesajıdır..."
}

connect_rabbitmq();

async function connect_rabbitmq() {

    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();

        const exchangeName = "foo.exchange";
        const routeKey = "";

        channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        await channel.assertQueue("foo.billing");
        await channel.assertQueue("foo.shipping");

        await channel.bindQueue("foo.billing", exchangeName, routeKey);
        await channel.bindQueue("foo.shipping", exchangeName, routeKey);


        setInterval(() => {
            message.description = new Date().getTime();
            channel.publish(exchangeName, routeKey, Buffer.from(message.description.toString()));
            console.log("Gönderilen Mesaj", message);
        }, 1000);


    } catch (error) {
        console.log(error);
    }

}