const ampq = require("amqplib");

async function smsNotifaction() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchnageType = "fanout";

    await channel.assertExchange(exchange, exchnageType, { durable: true });
    
    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Wating for Messages in Queue: ", queue.queue);
    

    await channel.bindQueue(queue.queue, exchange, "");

    await channel.consume(queue.queue, (message) => {
      if(message !== null){
        const product = JSON.parse(message.content.toString());
        console.log(
          `Sending SMS Notifiaction for the product >>: ${message.content.toString()}`
        );
        channel.ack(message);
      }
      
    });
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

smsNotifaction();
