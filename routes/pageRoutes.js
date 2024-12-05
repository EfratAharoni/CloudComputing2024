const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index'); // עמוד הבית
});

router.get('/db', (req, res) => {
    res.render('dal/db'); // עמוד הבית
});

router.get('/index', (req, res) => {
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
    res.render('pages/meals'); // עמוד "Meals"
});

router.get('/blog', (req, res) => {
    console.log('Blog page requested');
    res.render('pages/blog'); // עמוד "Blog"
});

router.get('/contact', (req, res) => {
    res.render('pages/contact'); // עמוד "Contact Us"
});

router.get('/logIn', (req, res) => {
    res.render('pages/logIn'); // עמוד "Log In"
});

router.get('/signUp', (req, res) => {
    res.render('pages/signUp'); // עמוד "Sign Up"
});


router.get('/fetchMeals', (req, res) => {
    res.render('pages/meals'); // עמוד הבית
});

module.exports = router;
