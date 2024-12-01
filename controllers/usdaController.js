const usdaModel = require('../models/usdaModel'); // חיבור ל-model הנכון

class UsdaController {
    static async calculateCalories(req, res) {
        const { description, gram } = req.body;

        // בדיקת פרמטרים חסרים
        if (!description || !gram) {
            return res.status(400).json({ message: 'Missing description or gram in request body' });
        }

        try {
            // קריאה ל-model כדי לקבל מידע מה-USDA API
            const foodData = await usdaModel.getCalories(description);

            if (foodData) {
                if (foodData.caloriesPer100g) {
                    // חישוב סך הקלוריות על פי כמות הגרם
                    const totalCalories = (foodData.caloriesPer100g / 100) * gram;

                    // החזרת תשובה ללקוח
                    return res.status(200).json({
                        foodName: foodData.foodName,
                        caloriesPer100g: foodData.caloriesPer100g,
                        totalCalories: totalCalories.toFixed(2),
                    });
                } else {
                    return res.status(404).json({
                        message: 'Calories data not available for this food item.',
                    });
                }
            } else {
                return res.status(404).json({
                    message: 'Food item not found in USDA database.',
                });
            }
        } catch (error) {
            console.error('Error fetching data from USDA API:', error.message);
            return res.status(500).json({ message: 'Error connecting to USDA API' });
        }
    }
}

module.exports = UsdaController;
