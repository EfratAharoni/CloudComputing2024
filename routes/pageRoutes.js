const express = require('express');
const router = express.Router();


router.get('/index', (req, res) => {
    res.render('pages/index'); // עמוד הבית
});

router.get('/db', (req, res) => {
    res.render('dal/db'); // עמוד הבית
});

router.get('/', (req, res) => {
    res.render('pages/index'); // אותו עמוד הבית
});

router.get('/header', (req, res) => {
    console.log('hello');

    res.render('partial/header'); // header
});

router.get('/about', (req, res) => {
    res.render('pages/about'); // עמוד "About Us"
});

router.get('/meals', (req, res) => {
    const username = req.session.username || "";  // יכול להיות גם null או כל ערך אחר.
    const meals = req.session.filterMeals || [];
    console.log(meals);

    res.render('pages/meals', { 
        meals: meals, 
        username: username 
    });
});


router.get('/blog', (req, res) => {
    console.log('Blog page requested');
    res.render('pages/blog'); // עמוד "Blog"
});

router.get('/contact', (req, res) => {
    res.render('pages/contact'); // עמוד "Contact Us"
});

router.post('/logIn_out', (req, res) => {
    const { action } = req.body; // קבלת הערך של הכפתור

    if (action === 'Log in') {
        console.log("bfvdcs - Log In");
        res.render('pages/logIn'); // עמוד "Log In"
    } else if (action === 'Log out') {
        console.log("Logging out...");
        // קריאה לפונקציית logout
        req.session.destroy(err => {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(500).send("Error logging out");
            }
            res.redirect('/'); // חזרה לעמוד הבית לאחר התנתקות
        });
    } else {
        console.error("Unknown action:", action);
        res.status(400).send("Invalid action");
    }
});


router.get('/signUp', (req, res) => {
    res.render('pages/signUp'); // עמוד "Sign Up"
});


router.get('/logIn', (req, res) => {
    res.render('pages/logIn'); // עמוד "log In"
});

router.get('/fetchMeals', (req, res) => {
    res.render('pages/meals'); // עמוד הבית
});

module.exports = router;
