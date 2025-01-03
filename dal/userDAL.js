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
        return user;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw error;
    }
};

const createUser = async (username, password) => {
    try {
        const newUser = await User.create({ username, password });
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
