const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const path = require('path');
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
<<<<<<< HEAD
app.use(express.static('public'));  // מאפשר גישה לקבצים סטטיים מתוך תיקיית 'public'
=======
app.use(express.static('public')); // לתמונות, קבצים סטטיים
>>>>>>> cf5fb258b6b9a6adb00b38c084f360f8a757c0ae

// הגדרת מנוע התצוגה
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // אם יש לך תיקיית views

// לוגים עבור כל בקשה שמגיעה לשרת
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// הגדרת multer לטיפול בקובץ התמונה
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // היכן שהקובץ יישמר
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // יצירת שם קובץ ייחודי
    }
});
const upload = multer({ storage: storage });

// ייבוא של הנתיבים (Routes)
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const mealRoutes = require('./routes/mealsRoutes');
const hebcalRoutes = require('./routes/hebcalRoutes');
const usdaRoutes = require('./routes/usdaRoutes');

// חיבור הנתיבים לשרת
app.use('/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/hebcal', hebcalRoutes);
app.use('/api/usda', usdaRoutes);

// Routes של עמודים
const pageRoutes = require('./routes/pageRoutes');
app.use('/', pageRoutes);

// נתיב ה־POST שמטפל בהוספת ארוחה (כולל קובץ)
app.post('/submit-meal', upload.single('descriptionImage'), async (req, res) => {
    try {
        // שליפת הנתונים מהבקשה
        const mealType = req.body.mealType;
        const date = req.body.date;
        const descriptionImage = req.file ? req.file.path : null;  // אם יש קובץ, נשמור את הנתיב שלה
        
        // כאן נשלח את הנתונים לקונטרולר שיטפל ביצירת הארוחה
        const mealController = require('./controllers/mealsController');
        
        // אנחנו מפנים את הבקשה לקונטרולר, שמטפל בהוספת הארוחה
        await mealController.createMeal(req, res, mealType, date, descriptionImage);
        console.log('i am in app file');

    } catch (error) {
        res.status(500).json({ message: 'Error processing the meal', error: error.message });
    }
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

<<<<<<< HEAD
const session = require('express-session');

app.use(session({
    secret: '1234', // מחרוזת סודית לחתימה על הסשן
    resave: false,           // לא לשמור מחדש את הסשן אם אין שינוי
    saveUninitialized: true, // לשמור סשנים ריקים
    cookie: { secure: false } // אם אתה עובד עם HTTPS, שנה ל-true
}));

app.get('/set', (req, res) => {
    req.session.myGlobalVariable = { key: 'value' };
    res.send('Variable has been set');
});

app.get('/get', (req, res) => {
    res.send(req.session.myGlobalVariable || 'No variable found');
});
=======

  
>>>>>>> cf5fb258b6b9a6adb00b38c084f360f8a757c0ae
