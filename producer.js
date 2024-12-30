// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//     brokers: ["ctorr34u3np52g1ptfcg.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092"],
//     ssl: {},
//     sasl: {
//       mechanism: "scram-sha-256",
//       username: "Efrat123",
//       password: "YBsVOKCsX06enW71gKevxKrn9ajV6t"
//     }
//   });
// const producer = kafka.producer();

// const runProducer = async (userName,content) => {
//   await producer.connect();
//   console.log('Producer connected to Kafka');

//   // Sending a test message to the "user-messages" topic
//   await producer.send({
//     topic:  "Massage",
//     messages: [{key:JSON.stringify(userName), value:  JSON.stringify(content)}],
//   });

//   console.log('Message sent to Kafka');
//   console.log(content)
//   await producer.disconnect();
// };

// runProducer('hod','Hii again')
// module.exports={runProducer}