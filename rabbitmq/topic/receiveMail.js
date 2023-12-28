const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";

const receiveEmail = async () => {
    try {
        //1. create connect
        const conn = await amqplib.connect(amqp_url_docker);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create exchange
        const nameExchange = "send_email";
        await channel.assertExchange(nameExchange, "topic", {
            durable: false,
        });
        //4. create queue
        const { queue } = await channel.assertQueue("", {
            exclusive: true,
        });
        //5. binding
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0);
        }
        // * có nghĩa là phù hợp với bất kỳ từ nào
        // # khớp với một hoặc nhiều từ bất kỳ

        console.log(`waiting queue ${queue} ::: topi::: ${args}`);

        args.forEach(async (key) => {
            await channel.bindQueue(queue, nameExchange, key);
        });

        await channel.consume(queue, (msg) => {
            console.log(
                `Routing key ${
                    msg.fields.routingKey
                }::: nsg:::${msg.content.toString()}`
            );
        });
    } catch (e) {
        console.log("e", e);
    }
};

receiveEmail();
