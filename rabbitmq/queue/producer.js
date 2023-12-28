const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";
const sendQueue = async ({ msg }) => {
    try {
        //1. create connect
        const conn = await amqplib.connect(amqp_url_docker);
        //2. create channel
        const channel = await conn.createChannel();
        //3. create name queue
        const nameQueue = "q2";
        //4. create queue
        await channel.assertQueue(nameQueue, {
            durable: true,
        });
        //5. send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg), {
            // expiration: "10000", // TTL time to live,
            persistent: true, // được lưu vào ổ đĩa hoặc cache
        });
        //6. close conn and channel
    } catch (e) {
        console.log("e", e);
    }
};
// ttl :  thời gian hết hạn của một message ( Time to live )
// durable : true => Nghĩa là khi start lại thì queue không mất data+
const msg = process.argv.slice(2).join("") || "Hello";
//
// process.argv = [
//     // bin.node,
//     // path
//     // ''
// ]
sendQueue({
    msg,
});
