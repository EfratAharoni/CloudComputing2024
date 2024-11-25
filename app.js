const express = require('express');
const app = express();
const port = 5000;

const { sequelize } = require('./models/userModel');
const userController = require('./controllers/userController');
const imageRoutes = require('./routes/imageRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// הוספת נתיב עבור ניתוח תמונות
app.use('/api/images', imageRoutes);

app.post('/users', userController.createUser);


sequelize.authenticate()
   .then(() => console.log('Connection has been established successfully.'))
   .catch(err => console.error('Unable to connect to the database:', err));

app.set("view engine", "ejs");
app.use(express.static('public'));

// נתיבים קיימים
app.get('/', (req, res) => {
 res.render('pages/index');
});

app.get('/about', (req, res) => {
 res.render('pages/about');
});

app.get('/blog', (req, res) => {
 res.render('pages/blog');
});

app.get('/contact', (req, res) => {
 res.render('pages/contact');
});

app.get('/index', (req, res) => {
 res.render('pages/index');
});

app.get('/recipes', (req, res) => {
 res.render('pages/recipes');
});

app.get('/logIn', (req, res) => {
 res.render('pages/logIn');
});

app.get('/signUp', (req, res) => {
 res.render('pages/signUp');
});

// הוספת נתיב לדף הדשבורד
// הוספת נתיב לדף הדשבורד
app.get('/dashboard', (req, res) => {
   res.render('pages/dashboard');
  });
  
app.listen(port, () => {
 console.log(`Example app listening on port ${port}`);
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // שמירת קבצים בתיקייה 'uploads'
const mealsController = require('./controllers/mealsController');

app.post('/api/meals', upload.single('description'), (req, res, next) => {
  console.log('Request received:', req.body, req.file); // לוג כדי לבדוק את הבקשה
  next(); // העבר את הבקשה ל-Controller
}, mealsController.createMeal);
