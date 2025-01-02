const { getUserByUsername, createUser, updateUserPassword, deleteUser } = require('../dal/userDAL');
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
                res.send('Invalid username or password');
                console.log('User not found');
                const data = await response.json();
                document.getElementById('error-message').textContent = data.message || 'Login failed';
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            if (user.password !== password) {
                console.log('Password mismatch for user:', username);
                return res.status(401).json({ message: 'Invalid username or password' });
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
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    
    
    // פונקציה ליצירת משתמש חדש
    signup: async (req, res) => {

        const { username, password, confirmPassword } = req.body;
        if(password==="" || password!==confirmPassword){
                console.log('inncorrect input!');
                return res.status(400).json({ message: 'inncorrect input' });
        }
        try {
            console.log('Signup attempt:', username);
    
            // בדיקה אם המשתמש כבר קיים
            const userExists = await getUserByUsername(username);
            if (userExists) {
                console.log('User name already exists:', username);
                return res.status(400).json({ message: 'User name already exists' });
            }
    
            // יצירת משתמש חדש
            const newUser = await createUser(username, password);
            if(newUser){
                console.log('User created successfully:', newUser.username);
            }
    
            // וודא ש-session מוגדר
            if (!req.session) {
                console.error('Session is not defined');
                return ;//res.status(500).json({ message: 'Session not initialized' });
            }
          
            // שמירת שם המשתמש ב-session
            req.session.username = username;
            await getMeals(req, res); // קריאה לפונקציה getMeals לשמירת הארוחות ב-session
            console.log("very good!");

            res.redirect('/index');
    
            
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
    