const { checkIfUserExists, getUserByUsername, createUser, updateUserPassword, deleteUser } = require('../dal/userDAL');
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
        const { username, password } = req.body;

        try {
            console.log('Signup attempt:', username);

            const userExists = await checkIfUserExists(username);
            if (userExists) {
                console.log('User already exists:', username);
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = await createUser(username, password);
            console.log('User created successfully:', username);
             // שמירת שם המשתמש ב-session
             req.session.username = user.username;
             await getMeals(req, res); // קריאה לפונקציה getMeals לשמירת הארוחות ב-session
 
             res.redirect('/index');
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
/*
    // פונקציה לעדכון סיסמה
    updatePassword: async (req, res) => {
        const { username, newPassword } = req.body;

        try {
            console.log('Password update attempt for user:', username);

            const result = await updateUserPassword(username, newPassword);
            if (result[0] === 0) {
                console.log('User not found:', username);
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('Password updated successfully for user:', username);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Password update error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // פונקציה למחיקת משתמש
    deleteUserAccount: async (req, res) => {
        const { username } = req.body;

        try {
            console.log('Delete attempt for user:', username);

            const result = await deleteUser(username);
            if (result === 0) {
                console.log('User not found:', username);
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('User deleted successfully:', username);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },*/
};
