const { User } = require('../models/userModel');

exports.createUser = async (req, res) => {
   try {
       const { username, password } = req.body;
       
       if (!username || !password) {
           return res.status(400).json({ message: 'Username and password are required' });
       }

       const user = await User.create({ 
           username, 
           password 
       });

       res.status(201).json({ success: true });
       
   } catch (error) {
       console.error('Registration error:', error);
       if (error.name === 'SequelizeUniqueConstraintError') {
           return res.status(400).json({ message: 'Username already exists' });
       }
       res.status(500).json({ message: 'Registration failed. Please try again.' });
   }
};