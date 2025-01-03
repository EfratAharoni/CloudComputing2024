const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;
const session = require('express-session');
const http = require('http');

//create session for commincation between server and client
app.use(session({
    secret: 'healtyLife', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.get('/session-info', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    res.status(200).json({ username: req.session.username });
});

//convert json to object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//for public folder
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//print to the console every request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
//save the upload file in the upload directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//routes
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealsRoutes');
const pageRoutes = require('./routes/pageRoutes');

app.use('/user', userRoutes);
app.use('/meal', mealRoutes);
app.use('/', pageRoutes);

//request that does not find path
app.use((req, res) => {
    res.status(404).send('Page not found');
});
//catch errors
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal server error');
});

//kafka

const WebSocket = require('ws');
const { Kafka } = require('kafkajs');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Global dictionary for storing messages by user ID and message status
//const messagesDictionary = require('./controllers/messagesController');
const messagesDictionary = {};
// WebSocket connections by user ID
const wsConnections = {};
// WebSocket server setup
wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    const userId = message.toString().replace(/"/g, ''); // הסרת מרכאות
    // Associate WebSocket connection with the user ID
    wsConnections[userId] = ws;
    // Initialize dictionary entry for this user if not present
    if (!messagesDictionary[userId]) {
      messagesDictionary[userId] = { messages: [], hasNewMessage: false };
    }
    // Send existing messages and "new message" status for this user
    ws.send(JSON.stringify({
      messages: messagesDictionary[userId].messages,
      hasNewMessage: messagesDictionary[userId].hasNewMessage
    }));
  });
});

// Kafka consumer setup
const kafka = new Kafka({
    brokers: ["ctorr34u3np52g1ptfcg.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092"],
    ssl: {},
  sasl: { mechanism: "scram-sha-256", username: "Efrat123", password: "YBsVOKCsX06enW71gKevxKrn9ajV6t" }
});

const consumer = kafka.consumer({ groupId: 'global-consumer-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'Massage', fromBeginning: false });

  // Process each message from Kafka
  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key?.toString();
      const userId =key.toString().replace(/"/g, '');
      const value = message.value?.toString();

      if (userId && value) {
        // Add message and set hasNewMessage to true
        if (!messagesDictionary[userId]) {
          messagesDictionary[userId] = { messages: [], hasNewMessage: false };
        }
        messagesDictionary[userId].messages.push(value);
        messagesDictionary[userId].hasNewMessage = true;

        // Notify connected WebSocket client
        const ws = wsConnections[userId];
         
        if (ws) {
          ws.send(JSON.stringify({
            messages: [value],
            hasNewMessage: true
          }));
        }
      }
    },
  });
};


run().catch(console.error);

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
