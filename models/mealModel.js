const sql = require('mssql');

// הגדרות החיבור למסד הנתונים שלך
const config = {
    user: 'EfratAharoni_SQLLogin_2',
    password: 'wlstybw2ax',
    server: 'HealthyLifeDB.mssql.somee.com',
    database: 'HealthyLifeDB',
    options: {
        encrypt: false, // יש מקרים שבהם צריך להגדיר false עבור חיבור ל-somee.com
    },
};


// פונקציה להוספת השורה
async function addMeal(meal) {
    try {
        // התחברות למסד הנתונים
        let pool = await sql.connect(config);
        console.log('Connected to the database.');

        console.log(meal)
        // שאילתה להוספת השורה
        const result = await pool.request()
            .input('username', sql.VarChar, meal.username)
            .input('mealType', sql.VarChar, meal.mealType)
            .input('date', sql.Date, meal.date)
            .input('description', sql.VarChar, meal.description)
            .input('glucoseLevel', sql.Int, meal.glucoseLevel)
            .input('BloodSugarLevel', sql.Int, meal.BloodSugarLevel)
            .input('holiday', sql.VarChar, meal.holiday)
            .query(`
                INSERT INTO MEALS (username, mealType, date, BloodSugarLevel, description, glucoseLevel, holiday)
                VALUES (@username, @mealType, @date, @BloodSugarLevel, @description, @glucoseLevel, @holiday)
            `);

        console.log('Meal added successfully:', result);
    } catch (err) {
        console.error('Error adding meal:', err);
    } finally {
        // נתק את החיבור
        sql.close();
    }
}


async function getMealsByUsername(username) {
    try {
        // התחברות למסד הנתונים
        let pool = await sql.connect(config);
        console.log('Connected to the database.');

        // שאילתה להחזרת הארוחות של המשתמש
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`
                SELECT * 
                FROM MEALS
                WHERE username = @username
                ORDER BY date ASC; 
            `);

        console.log('Meals fetched successfully:', result.recordset);
        return result.recordset; // החזרת התוצאות
    } catch (err) {
        console.error('Error fetching meals:', err);
        throw err; // להעביר את השגיאה למעלה במידה וצריך
    } finally {
        // נתק את החיבור
        sql.close();
    }
}

// ייצוא הפונקציות כמודול
module.exports = { addMeal, getMealsByUsername };

