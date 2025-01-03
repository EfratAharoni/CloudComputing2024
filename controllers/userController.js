const { getUserByUsername, createUser } = require('../dal/userDal');
const { getMeals } = require('../controllers/mealsController'); // ייבוא הפונקציה getMeals

module.exports = {
    // פונקציה להתחברות
    login: async (req, res) => {
        const { username, password } = req.body;    
        try {

            console.log('Login attempt for user:', username);
            const user = await getUserByUsername(username);

            if (!user) {
                console.log('User not found');
                return res.render('pages/login', { 
                    errorMessage: 'User not found',
                    username: username 
                });
            }
    
            if (user.password !== password) {
                console.log('Password mismatch for user:', username);
                return res.render('pages/login', { 
                    errorMessage: 'Invalid password',
                    username: username // נשמור את שם המשתמש כך שהמשתמש לא יצטרך להקליד אותו מחדש
                });
            }
    
            if (!req.session) {
                return res.status(500).json({ message: 'Session not initialized' });
            }
    
            req.session.username = user.username;
            await getMeals(req, res); 
            res.redirect('/index');
                    
        } catch (error) {
            console.error('Login error:', error);
            return res.render('pages/login', { 
                errorMessage: 'Internal server error',
                username: username 
            });
        }
    },
    
    signup: async (req, res) => {
        const { username, password, confirmPassword } = req.body;
        if (password === "" || password !== confirmPassword) {
            console.log('Incorrect input!');
            return res.render('pages/signup', { errorMessage: 'Passwords do not match or are empty' });
        }
        try {

            console.log('Signup attempt:', username);
            const userExists = await getUserByUsername(username);
            if (userExists) {
                console.log('User name already exists:', username);
                return res.render('pages/signup', { errorMessage: 'User name already exists' });
            }
    
            const newUser = await createUser(username, password);
            if (!req.session) {
                return res.status(500).json({ message: 'Session not initialized' });
            }
    
            req.session.username = username;
            await getMeals(req, res); // קריאה לפונקציה getMeals לשמירת הארוחות ב-session    
            res.redirect('/index');
            
        } catch (error) {
            console.error('Signup error:', error);
            res.render('pages/signup', { errorMessage: 'Internal server error' });
        }
    },
    
};
    