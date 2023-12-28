const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";

const receiveNoti = async () => {
    try {
        //1. create connect
        const conn = await amqplib.connect(amqp_url_docker);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create exchange
        const nameExchange = "video";
        await channel.assertExchange(nameExchange, "fanout", {
            durable: false,
        });
        //4. create queue
        const {
            queue, // name queue
        } = await channel.assertQueue("", {
            exclusive: true,
        });
        console.log("queue", queue);
        //5. binding
        await channel.bindQueue(queue, nameExchange, "");

        await channel.consume(
            queue,
            (msg) => {
                console.log("msg ::: ", msg.content.toString());
            },
            {
                noAck: true,
            }
        );
    } catch (e) {
        console.log("e", e);
    }
};

receiveNoti();
