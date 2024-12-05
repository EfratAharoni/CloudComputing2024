const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;
const session = require('express-session');

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

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
const imageRoutes = require('./routes/imageRoutes');
const mealRoutes = require('./routes/mealsRoutes');
const hebcalRoutes = require('./routes/hebcalRoutes');
const usdaRoutes = require('./routes/usdaRoutes');

app.use('/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/hebcal', hebcalRoutes);
app.use('/api/usda', usdaRoutes);

const pageRoutes = require('./routes/pageRoutes');
app.use('/', pageRoutes);

app.post('/submit-meal', upload.single('descriptionImage'), async (req, res) => {
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
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

