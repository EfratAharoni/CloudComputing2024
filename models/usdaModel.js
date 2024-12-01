const axios = require('axios');

// מפתח API של USDA
const API_KEY = 'xPsmUDrTk1RFNqB5DEkgXkBVsU2TLSyI5tnebPbe';

class UsdaModel {
    /**
     * פונקציה שמבצעת חיפוש של פריט מזון לפי תיאור ומחזירה נתונים תזונתיים
     * @param {string} description - תיאור המזון (למשל "apple").
     * @returns {Promise<object>} - אובייקט עם שם המזון וקלוריות ל-100 גרם.
     */
    static async getCalories(description) {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${description}&api_key=${API_KEY}`;

        try {
            // שליחת בקשה ל-API
            const response = await axios.get(url);

            // בדיקת קיום תוצאות
            const foods = response.data.foods;
            if (foods && foods.length > 0) {
                const food = foods[0]; // הפריט הראשון בתוצאות
                const nutrients = food.foodNutrients;

                // חיפוש הערך של קלוריות (Energy)
                const caloriesPer100g = nutrients.find(
                    nutrient => nutrient.nutrientName === 'Energy'
                )?.value;

                return {
                    foodName: food.description,
                    caloriesPer100g: caloriesPer100g || null, // החזרת null אם אין נתונים
                };
            }

            return null; // אם לא נמצאו תוצאות
        } catch (error) {
            console.error('Error fetching data from USDA API:', error.message);
            throw new Error('Failed to fetch data from USDA API');
        }
    }
}

module.exports = UsdaModel;
