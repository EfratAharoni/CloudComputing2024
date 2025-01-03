const { getUserByUsername, createUser } = require('../dal/userDAL');
const { getMeals } = require('../controllers/mealsController'); // ייבוא הפונקציה getMeals

module.exports = {
    // פונקציה להתחברות
    login: async (req, res) => {
        const { username, password } = req.body;
        console.log(username);
    
        try {
            console.log('Login attempt for user:', username);
    
            const user = await getUserByUsername(username);
            if (!user) {
                console.log('User not found');
                // שליחת הודעת שגיאה לעמוד עם הערכים שהמשתמש הזין
                return res.render('pages/login', { 
                    errorMessage: 'Invalid username or password',
                    username: username // נשמור את שם המשתמש כך שהמשתמש לא יצטרך להקליד אותו מחדש
                });
            }
    
            if (user.password !== password) {
                console.log('Password mismatch for user:', username);
                return res.render('pages/login', { 
                    errorMessage: 'Invalid username or password',
                    username: username // נשמור את שם המשתמש כך שהמשתמש לא יצטרך להקליד אותו מחדש
                });
            }
    
            // וודא ש-session מוגדר
            if (!req.session) {
                console.error('Session is not defined');
                return res.status(500).json({ message: 'Session not initialized' });
            }
    
            // שמירת שם המשתמש ב-session
            req.session.username = user.username;
            await getMeals(req, res); // קריאה לפונקציה getMeals לשמירת הארוחות ב-session
    
            res.redirect('/index');
            console.log('Login successful for user:', username);
                    
        } catch (error) {
            console.error('Login error:', error);
            return res.render('pages/login', { 
                errorMessage: 'Internal server error',
                username: username // נשמור את שם המשתמש כך שהמשתמש לא יצטרך להקליד אותו מחדש
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
    
            // בדיקה אם המשתמש כבר קיים
            const userExists = await getUserByUsername(username);
            if (userExists) {
                console.log('User name already exists:', username);
                return res.render('pages/signup', { errorMessage: 'User name already exists' });
            }
    
            // יצירת משתמש חדש
            const newUser = await createUser(username, password);
            if (newUser) {
                console.log('User created successfully:', newUser.username);
            }
    
            // וודא ש-session מוגדר
            if (!req.session) {
                console.error('Session is not defined');
                return res.status(500).json({ message: 'Session not initialized' });
            }
    
            // שמירת שם המשתמש ב-session
            req.session.username = username;
            await getMeals(req, res); // קריאה לפונקציה getMeals לשמירת הארוחות ב-session
            console.log("very good!");
    
            res.redirect('/index');
            
        } catch (error) {
            console.error('Signup error:', error);
            res.render('pages/signup', { errorMessage: 'Internal server error' });
        }
    },
    
};
    