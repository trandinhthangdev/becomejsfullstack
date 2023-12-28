const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";

const postVideo = async ({ msg }) => {
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
        //4. publish video
        await channel.publish(nameExchange, "", Buffer.from(msg));

        console.log(`Send Okie ${msg}`);

        setTimeout(() => {
            conn.close();
            process.exit();
        }, 2000);
    } catch (e) {
        console.log("e", e);
    }
};

const msg = process.argv.slice(2).join("") || "Hello exchange";
postVideo({
    msg,
});
