const ampq = require("amqplib");

async function recvMail() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("mail_queue", { durable: false });
    channel.consume("mail_queue", (msg) => {
      if (msg !== null) {
        console.log("Message received", JSON.parse(msg.content));
        channel.ack(msg);
      }
    });
  } catch (e) {}
}

recvMail();
