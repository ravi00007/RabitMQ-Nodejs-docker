const ampq = require("amqplib"); 
async function sendMail(routingKey, message) { 
  try {
    const connection = await ampq.connect("amqp://localhost"); // Establish a connection to the RabbitMQ server running on localhost
    const channel = await connection.createChannel(); // Create a channel on the established connection
    const exchange = "notification_exchange"; // Define the name of the exchange
    const exchangeType = "topic"; // Define the type of the exchange as 'topic'

    await channel.assertExchange(exchange, exchangeType, { durable: true }); // Assert the exchange with the specified name and type, and set it as durable

  

    await channel.publish( // Publish a message to the exchange with the specified routing key
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)) // Convert the message to a Buffer
    );
    console.log("[x] Sent '%s':'%s'", routingKey, JSON.stringify(message)); // Log the sent message with its routing key
    console.log( // Log additional information about the sent message
      `Msg was sent! with routing key as ${routingKey} and the content as ${JSON.stringify(
        message
      )}`
    );

    setTimeout(() => { // Close the connection after a 1-second delay
      connection.close();
    }, 1000);
  } catch (err) { // Catch any errors that occur during the process
    console.log("ERROR: ", err); // Log the error
  }
}

sendMail("order.placed",{orderId: "12345", message: "Order placed successfully"}); // Call the sendMail function with the specified routing key and message
sendMail("payment.processed",{paymentId: "67890", message: "Payment processed successfully"}); // Call the sendMail function with a different routing key and message