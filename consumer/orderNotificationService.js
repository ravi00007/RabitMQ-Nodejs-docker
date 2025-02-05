const ampq = require("amqplib");

/**
 * Asynchronously receives messages from a RabbitMQ queue.
 *
 * @async
 * @function receiveMessage
 * @throws Will throw an error if unable to connect to RabbitMQ or create a channel.
 *
 * @description
 * Connects to a RabbitMQ server, creates a channel, asserts an exchange and a queue, binds the queue to the exchange with a routing key pattern, and consumes messages from the queue.
 *
 * @example
 * receiveMessage();
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
async function receiveMessage() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const queue = "order_queue";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, "order.*");
    console.log("Waiting for messages in %s", queue);
    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(`[Order Notification] Msg was consumed with routing key as ${msg.fields.routingKey} and the content as ${msg.content.toString()}`);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

receiveMessage();
