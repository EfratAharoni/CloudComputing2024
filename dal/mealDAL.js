const Meal = require('../models/mealModel');

module.exports = {
    // יצירת ארוחה חדשה
    createMeal: async (mealData) => {
        try {
            const newMeal = await Meal.create(mealData);
            return newMeal;
        } catch (error) {
            console.error('Error creating meal:', error);
            throw error;
        }
    },

    // מציאת כל הארוחות
    getAllMeals: async () => {
        try {
            const meals = await Meal.findAll();
            return meals;
        } catch (error) {
            console.error('Error fetching meals:', error);
            throw error;
        }
    },

    // מציאת ארוחה לפי ID
    getMealById: async (id) => {
        try {
            const meal = await Meal.findByPk(id);
            return meal;
        } catch (error) {
            console.error('Error fetching meal by ID:', error);
            throw error;
        }
    },

    // עדכון ארוחה
    updateMeal: async (id, updatedData) => {
        try {
            const result = await Meal.update(updatedData, {
                where: { id },
            });
            return result;
        } catch (error) {
            console.error('Error updating meal:', error);
            throw error;
        }
    },

    // מחיקת ארוחה
    deleteMeal: async (id) => {
        try {
            await Meal.destroy({
                where: { id },
            });
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    },
};
