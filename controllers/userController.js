// controllers/userController.js
const User = require('../models/user');

// פונקציה להוספת משתמש חדש
exports.createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, password, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
