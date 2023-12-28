const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";

const sendEmail = async () => {
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

        const args = process.argv.slice(2);
        const msg = args[1] || "Fixed!";
        const topic = args[0];

        console.log("msg", msg);
        console.log("topic", topic);
        //4. publish email
        await channel.publish(nameExchange, topic, Buffer.from(msg));

        console.log(`Send Okie ${msg}`);

        setTimeout(() => {
            conn.close();
            process.exit();
        }, 2000);
    } catch (e) {
        console.log("e", e);
    }
};

sendEmail();
