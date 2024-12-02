const express = require('express');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// הגדרת מנוע התצוגה
app.set('view engine', 'ejs');

// לוגים עבור כל בקשה שמגיעה לשרת
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// ייבוא של הנתיבים (Routes)
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const mealRoutes = require('./routes/mealsRoutes');
const hebcalRoutes = require('./routes/hebcalRoutes');
const usdaRoutes = require('./routes/usdaRoutes'); // USDA Routes

// חיבור הנתיבים לשרת
app.use('/users', userRoutes); // נתיבים למשתמשים (Login, Signup וכו')
app.use('/api/images', imageRoutes); // נתיבים לניתוח תמונות
app.use('/api/meals', mealRoutes); // נתיבים לארוחות
app.use('/api/hebcal', hebcalRoutes); // נתיבים ל-Hebcal
app.use('/api/usda', usdaRoutes); // נתיבים ל-USDA

// Routes של עמודים
app.get('/', (req, res) => {
    res.render('pages/index'); // עמוד הבית
});

app.get('/index', (req, res) => {
    res.render('pages/index'); // אותו עמוד הבית
});

app.get('/about', (req, res) => {
    res.render('pages/about'); // עמוד "About Us"
});

app.get('/recipes', (req, res) => {
    res.render('pages/recipes'); // עמוד "Recipes"
});

app.get('/blog', (req, res) => {
    res.render('pages/blog'); // עמוד "Blog"
});

app.get('/contact', (req, res) => {
    res.render('pages/contact'); // עמוד "Contact Us"
});

app.get('/logIn', (req, res) => {
    res.render('pages/logIn'); // עמוד "Log In"
});

app.get('/signUp', (req, res) => {
    res.render('pages/signUp'); // עמוד "Sign Up"
});

// הוספת נתיב ל-Dashboard
app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard'); // עמוד "Dashboard"
});

// טיפול בשגיאות (404)
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// טיפול בשגיאות שרת (500)
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal server error');
});

// הרצת השרת
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
