const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key', // שים סוד חזק כאן
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // שים secure:true בפרודקשן עם HTTPS
}));

app.get('/session-info', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    
    res.status(200).json({ username: req.session.username });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealsRoutes');
const pageRoutes = require('./routes/pageRoutes');

app.use('/user', userRoutes);
app.use('/meals', mealRoutes);
app.use('/', pageRoutes);



/*app.post('/submit-meal', upload.single('descriptionImage'), async (req, res) => {
    try {
        const mealType = req.body.mealType;
        const date = req.body.date;
        const descriptionImage = req.file ? req.file.path : null;

        const mealController = require('./controllers/mealsController');
        await mealController.createMeal(req, res, mealType, date, descriptionImage);
        console.log('Meal processed successfully!');
    } catch (error) {
        res.status(500).json({ message: 'Error processing the meal', error: error.message });
    }
});*/

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal server error');
});

//app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
//});

const http = require('http');
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
    console.log(456)
    console.log(message)
    console.log(userId)
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
      console.log(123)
      console.log(userId)

      if (userId && value) {
        // Add message and set hasNewMessage to true
        if (!messagesDictionary[userId]) {
          messagesDictionary[userId] = { messages: [], hasNewMessage: false };
        }
        console.log(value)
        messagesDictionary[userId].messages.push(value);
        messagesDictionary[userId].hasNewMessage = true;
        console.log(messagesDictionary)

        // Notify connected WebSocket client
        const ws = wsConnections[userId];
        console.log(userId)
        console.log( wsConnections['hod'])
        console.log( wsConnections["hod"])
        console.log( wsConnections['"hod"'])
         
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
/**
 * 
 * 
 * 
 * 
 * <div id="messages"></div>

<script>
    fetch('/session-info') // שליחת בקשה לשרת לקבלת שם המשתמש
        .then(response => {
            if (!response.ok) {
                throw new Error('Not logged in');
            }
            return response.json(); // הפיכת התגובה לאובייקט JSON
        })
        .then(data => {const username = data.username;})
            // שם משתמש התקבל בהצלחה


    const ws = new WebSocket('ws://' + window.location.host);

    ws.addEventListener('open', () => {
        ws.send(username);
    });

    ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const messagesList = document.getElementById('messages');
        
        messagesList.innerHTML = ''; // Clear previous notification

        if (data.hasNewMessage && data.messages && data.messages.length > 0) {
            data.messages.forEach(message => {
                const jsMsg=JSON.parse(message)
                const p = document.createElement('p');
                p.innerHTML=`
                <h5 class="fw-bolder">Message:</h5>
                <p>${jsMsg.message}</p>;`
               
                messagesList.appendChild(p);
            });
        }
    });
  
</script>

 */