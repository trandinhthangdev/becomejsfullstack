const amqplib = require("amqplib");
// .env
const amqp_url_cloud =
    "amqps://hktbtkjt:mg3GPNYi6j-kff3BsRfZMUKx302P09t0@armadillo.rmq.cloudamqp.com/hktbtkjt";
const amqp_url_docker = "amqp://localhost:5672";

const receiveQueue = async () => {
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
        //5. receive to queue
        await channel.consume(
            nameQueue,
            (msg) => {
                console.log("msg", msg.content.toString());
            },
            {
                noAck: true,
            }
        );
        //6. close conn and channel
    } catch (e) {
        console.log("e", e);
    }
};

// ack : cơ chế xác nhận một message
// nếu noAck = true => client đã nhận được tin nhắn và đã xử lý, do vậy phải xoá tin nhắn này khỏi hàng đợi
// nếu noAck = false => gặp lỗi khi nhận tin nhắn và hệ thống sẽ đẩy sang cho consumer khác xử lý

receiveQueue();
