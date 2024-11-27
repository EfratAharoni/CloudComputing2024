const { Sequelize } = require('sequelize');

// Replace with your Somee.com credentials
const sequelize = new Sequelize('HealthyLifeDB', 'EfratAharoni_SQLLogin_2', 'wlstybw2ax', {
    host: 'HealthyLifeDB.mssql.somee.com',
    dialect: 'mssql',
    logging: false, // Disable SQL query logging
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
