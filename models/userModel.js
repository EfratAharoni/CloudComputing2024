const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('HealthyLifeDB', 'EfratAharoni_SQLLogin_2', 'wlstybw2ax', {
   host: 'HealthyLifeDB.mssql.somee.com',
   dialect: 'mssql',
   dialectOptions: {
       options: {
           encrypt: true,
           trustServerCertificate: true,
           packetSize: 4096
       }
   },
   pool: {
       max: 5,
       min: 0,
       idle: 10000
   },
   logging: false
});

const User = sequelize.define('User', {
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

module.exports = { sequelize, User };