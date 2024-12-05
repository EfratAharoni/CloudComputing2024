const { DataTypes } = require('sequelize');
const sequelize = require('../dal/db'); // Database connection

const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    mealType: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    glucoseLevel: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    holiday: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
});

module.exports = {Meal};
