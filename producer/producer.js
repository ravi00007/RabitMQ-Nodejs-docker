const ampq = require("amqplib");
async function announceNewProduct(product) {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchnageType = "fanout";

    await channel.assertExchange(exchange, exchnageType, { durable: true });

    const message = JSON.stringify(product);
    channel.publish(exchange, "", Buffer.from(message), { persistent: true });
    console.log(`[Product Service] Sent message: ${message}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

announceNewProduct({id:2002,name:"PS5",price:499.99});
announceNewProduct({id:2003,name:"JBL",price:99.99});
