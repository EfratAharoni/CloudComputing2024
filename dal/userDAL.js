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
        console.log('Fetching user:', username); // לוג לתיעוד שם המשתמש שנשלח
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

// עדכון סיסמה של משתמש
const updateUserPassword = async (username, newPassword) => {
    try {
        const result = await User.update(
            { password: newPassword },
            { where: { username } }
        );
        console.log('Password updated successfully for user:', username);
        return result; // מחזיר את מספר הרשומות שעודכנו
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
};

const deleteUser = async (username) => {
    try {
        const result = await User.destroy({ where: { username } });
        console.log('User deleted successfully:', username);
        return result; // מחזיר את מספר הרשומות שנמחקו
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = {
    checkIfUserExists,
    getUserByUsername,
    createUser,
    updateUserPassword,
    deleteUser,
};
