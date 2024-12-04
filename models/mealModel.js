const { DataTypes } = require('sequelize');
const sequelize = require('../dal/db'); // חיבור לבסיס הנתונים

const Meal = sequelize.define('Meal', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mealType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    glucoseLevel: {
        type: DataTypes.FLOAT,
    },
    holiday: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = { Meal };
