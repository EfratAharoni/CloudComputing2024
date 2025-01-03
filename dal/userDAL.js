const User = require('../models/userModel'); // ייבוא המודל

const checkIfUserExists = async (username) => {
    try {
        const user = await User.findOne({ where: { username } });
        return !!user; // מחזיר true אם המשתמש נמצא
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
};

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ where: { username } });
        console.log('User fetched:', user); // לוג לתיעוד התוצאה שהתקבלה
        return user;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw error;
    }
};

const createUser = async (username, password) => {
    try {
        const newUser = await User.create({ username, password });
        console.log('User created successfully:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

module.exports = {
    checkIfUserExists,
    getUserByUsername,
    createUser,
};
