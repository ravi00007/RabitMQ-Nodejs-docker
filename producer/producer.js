const ampq = require("amqplib");

/**
 * Sends an email message using RabbitMQ.
 *
 * @async
 * @function sendMail
 * @param {Object} params - The parameters for sending the email.
 * @throws Will throw an error if the connection to RabbitMQ    fails.
 *
 * @example
 * sendMail({
 *   to: "rahul@gmail.com",
 *   from: "ravi@gmail.com",
 *   subject: "Hello TP Mail",
 *   body: "Hello TP Mail"
 * });
 *
 * @description
 * This function connects to a RabbitMQ server, creates a channel, and sends an email message to a specified exchange with a routing key.
 *
 * @returns {Promise<void>} - A promise that resolves when the email message is sent.
 *
 * @line const connection = await ampq.connect("amqp://localhost"); - Connects to the RabbitMQ server.
 * @line const channel = await connection.createChannel(); - Creates a channel on the RabbitMQ server.
 * @line const exchange = "mail_exchange"; - The name of the exchange to send the message to.
 * @line const routingKey = "send_mail"; - The routing key for the message.
 * @line const message = { to: "rahul@gmail.com", from: "ravi@gmail.com", subject: "Hello TP Mail", body: "Hello TP Mail" }; - The email message to be sent.
 * @line await channel.assertExchange(exchange, 'direct', { durable: false }); - Asserts that the exchange exists.
 * @line await channel.assertQueue("mail_queue", { durable: false }); - Asserts that the queue exists.
 * @line await channel.bindQueue("mail_queue", exchange, routingKey); - Binds the queue to the exchange with the routing key.
 */
async function sendMail(params) {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange"; //exchange name
    const routingKeyForNormalUser = "send_mail_to_normal_user"; // Routing key for normal users
    const routingKeyForSubscribedUsers = "send_mail_to_subscribed_users"; // Routing key for subscribed users

    const message = {
      to: "realtime@gmail.com",
      from: "ravi@gmail.com",
      subject: "Hello TP Mail",
      body: "Hello TP Mail",
    };
    await channel.assertExchange(exchange, "direct", { durable: false });

    await channel.assertQueue("subscribed_user_mail_queue", { durable: false });
    await channel.assertQueue("normal_user_mail_queue", { durable: false });

    await channel.bindQueue("subscribed_user_mail_queue", exchange, routingKeyForSubscribedUsers);
    await channel.bindQueue("normal_user_mail_queue", exchange, routingKeyForNormalUser);
    
    await channel.publish(
      exchange,
      routingKeyForSubscribedUsers,
      Buffer.from(JSON.stringify(message))
    );
    console.log("Message sent successfully", message);

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (err) {
    console.log(err);
  }
}

sendMail();
