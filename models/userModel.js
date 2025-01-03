const { DataTypes } = require('sequelize');
const sequelize = require('../dal/db'); // חיבור למסד הנתונים

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // הפוך את username למפתח הראשי
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users', 
    timestamps: false, 
});

module.exports = User;
