const ampq = require("amqplib");

async function pushNotifaction() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "new_product_launch";
    const exchnageType = "fanout";

    await channel.assertExchange(exchange, exchnageType, { durable: true });

    const queue = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue.queue, exchange, "");
    console.log("Waiting for Messages in Queue: ", queue.queue);

    await channel.consume(queue.queue, (message) => {
      if (message != null) {
        const product = JSON.parse(message.content.toString());
        console.log(
          `Sending Push Notification for the product >>: ${message.content.toString()}`
        );
        channel.ack(message);
      }
    });
  } catch (e) {}
}
pushNotifaction();
