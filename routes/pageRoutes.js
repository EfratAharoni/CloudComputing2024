const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    res.render('pages/index', { currentPage: 'index' }); // עמוד הבית
});

router.get('/db', (req, res) => {
    res.render('dal/db'); // עמוד הבית
});

router.get('/', (req, res) => {
    res.render('pages/index', { currentPage: 'index' }); // אותו עמוד הבית
});

router.get('/header', (req, res) => {
    console.log('hello');

    res.render('partial/header'); // header
});

router.get('/about', (req, res) => {
    res.render('pages/about', { currentPage: 'about' }); // עמוד "About Us"
});

router.get('/meals', (req, res) => {
    const username = req.session.username || "";  // יכול להיות גם null או כל ערך אחר.
    const meals = req.session.filterMeals || [];
    res.render('pages/meals', { 
        meals: meals, 
        username: username, 
        currentPage: 'meals',
        startDate: "",
        endDate: "" 
    });
});

router.get('/trackMeals', (req, res) => {
    const username = req.session.username || "";  // יכול להיות גם null או כל ערך אחר.
    const meals = req.session.filterMeals || [];
    res.render('pages/meals', { 
        meals: meals, 
        username: username, 
        currentPage: 'meals',
        startDate: "",
        endDate: ""  
    });
});

router.get('/blog', (req, res) => {
    res.render('pages/blog', { currentPage: 'blog' }); 
});

router.get('/contact', (req, res) => {
    res.render('pages/contact', { currentPage: 'contact' }); 
});

router.post('/logIn_out', (req, res) => {
    const { action } = req.body; 

    if (action === 'Log in') {
        res.render('pages/logIn',{errorMessage: "",username:""}); 
    } else if (action === 'Log out') {
        console.log("Logging out...");
        req.session.destroy(err => {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(500).send("Error logging out");
            }
            res.redirect('/'); 
        });
    } else {
        console.error("Unknown action:", action);
        res.status(400).send("Invalid action");
    }
});


router.get('/signUp', (req, res) => {
    res.render('pages/signUp',{errorMessage: "",username:""}); 
});


router.get('/logIn', (req, res) => {
    res.render('pages/logIn',{errorMessage: "",username: ""}); 
});

module.exports = router;
