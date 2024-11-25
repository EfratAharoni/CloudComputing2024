const express = require('express');
const app = express();
const port = 5000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { sequelize } = require('./models/userModel');
const userController = require('./controllers/userController');
const imageRoutes = require('./routes/imageRoutes');
const mealsController = require('./controllers/mealsController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/images', imageRoutes);
app.post('/api/users', userController.createUser);
app.post('/api/meals', upload.single('description'), (req, res, next) => {
 console.log('Request received:', req.body, req.file);
 next();
}, mealsController.createMeal);

// Database connection
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// View engine setup
app.set("view engine", "ejs");
app.use(express.static('public'));

// Page routes
app.get('/', (req, res) => { res.render('pages/index'); });
app.get('/about', (req, res) => { res.render('pages/about'); });
app.get('/blog', (req, res) => { res.render('pages/blog'); });
app.get('/contact', (req, res) => { res.render('pages/contact'); });
app.get('/index', (req, res) => { res.render('pages/index'); });
app.get('/recipes', (req, res) => { res.render('pages/recipes'); });
app.get('/logIn', (req, res) => { res.render('pages/logIn'); });
app.get('/signUp', (req, res) => { res.render('pages/signUp'); });
app.get('/dashboard', (req, res) => { res.render('pages/dashboard'); });

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`);
});