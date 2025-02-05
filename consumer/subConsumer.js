const ampq = require("amqplib");

async function recvMail() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("subscribed_user_mail_queue", { durable: false });
    channel.consume("subscribed_user_mail_queue", (msg) => {
      if (msg !== null) {
        console.log("Message received for subs user", JSON.parse(msg.content));
        channel.ack(msg);
      }
    });
  } catch (e) {}
}

recvMail();
