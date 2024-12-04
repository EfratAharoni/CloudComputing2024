const { Meal } = require('../models/mealModel');
const { getHolidayFromHebcal } = require('../models/hebcalModel');
const { getDescriptionFromImage } = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');

module.exports = {
    createMeal: async (req, res, mealType, date, descriptionImage) => {
        try {
            
            const username = req.session.username;  // קבלת שם המשתמש
            console.log('Meal initialized:');

            // יצירת אובייקט Meal
            const meal = new Meal(username, mealType, date, descriptionImage);

            // קריאה למודלים ולקביעת הערכים המתאימים
            await meal.initializeMeal();

            // הדפסת הערכים של הארוחה
            console.log('Meal initialized:');
            console.log('Username:', meal.username);
            console.log('Meal Type:', meal.mealType);
            console.log('Date:', meal.date);
            console.log('Description:', meal.description);
            console.log('Glucose Level:', meal.glucoseLevel);
            console.log('Holiday:', meal.holiday);

            // מחזירים תשובה עם הנתונים
            res.status(201).json({ message: 'Meal added successfully!', meal: meal });
        } catch (error) {
            // טיפול בשגיאות
            res.status(500).json({ message: 'Error adding meal', error: error.message });
        }
    },
};
