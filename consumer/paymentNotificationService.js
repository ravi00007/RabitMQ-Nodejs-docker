const ampq = require("amqplib");


async function receivePayment(){

  const connection = await ampq.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "notification_exchange";
  const queue = "payment_queue";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, "payment.*");

  console.log("Waiting for messages in %s", queue);
  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        console.log(`[Payment Notification] Msg was consumed with routing key as ${msg.fields.routingKey} and the content as ${msg.content.toString()}`);
        channel.ack(msg);
      }
    },
    { noAck: false }
  );

}
receivePayment();
