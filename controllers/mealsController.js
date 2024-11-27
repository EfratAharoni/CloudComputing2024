const Meal = require('../models/mealModel'); // ייבוא מודל הארוחה

module.exports = {
    // פונקציה להצגת כל הארוחות
    getAllMeals: async (req, res) => {
        try {
            const meals = await Meal.findAll();
            res.status(200).json({
                status: 'success',
                data: meals,
            });
        } catch (error) {
            console.error('Error fetching meals:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch meals',
            });
        }
    },

    // פונקציה ליצירת ארוחה חדשה
    createMeal: async (req, res) => {
        const { mealType, dateTime, gram, description, calories, holiday } = req.body;

        try {
            // יצירת ארוחה חדשה
            const newMeal = await Meal.create({
                mealType,
                dateTime,
                gram,
                description,
                calories,
                holiday,
            });

            res.status(201).json({
                status: 'success',
                data: newMeal,
            });
        } catch (error) {
            console.error('Error creating meal:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Failed to create meal',
            });
        }
    },
};
