const { Sequelize, DataTypes } = require('sequelize');

// ה-connection string החדש שלך
const sequelize = new Sequelize('HealthyLifeDB', 'EfratAharoni_SQLLogin_2', 'wlstybw2ax', {
    host: 'HealthyLifeDB.mssql.somee.com',
    dialect: 'mssql',
    dialectOptions: {
        options: { encrypt: true }
    },
    logging: false,  // אם אתה לא רוצה להציג את הלוגים של Sequelize
});

// הגדרת המודל user
const user = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// ייצוא ה-sequelize והמוצר יחד
module.exports = { sequelize, user };
