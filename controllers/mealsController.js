const Meal = require('../models/mealModel');  // ייבוא המודל

// פונקציה להוספת ארוחה
const addMeal = (mealType, date, descriptionImage) => {
    return new Promise((resolve, reject) => {
        // יצירת אובייקט ארוחה
        const meal = new Meal({
            mealType,
            date,
            descriptionImage
        });

        // שמירה בדאטה-בייס
        meal.save()
            .then(savedMeal => resolve(savedMeal))
            .catch(err => reject(err));
    });
};

module.exports = { addMeal };
