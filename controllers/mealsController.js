const Meal = require('../models/mealModel');
const { getHolidayFromHebcal } = require('../models/hebcalModel');
const ImageModel = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');

module.exports = {
    // פונקציה להוספת ארוחה
    createMeal: async (req, res, mealType, date, descriptionImage) => {
        try {
            const username = req.session?.username || 'guest';
            console.log(`Creating meal for user: ${username}`);
            console.log('Session username:', req.session.username);

            // המרת תאריך ובדיקה
            const parsedDate = new Date(date);
            if (isNaN(parsedDate)) {
                console.error('Invalid date format received:', date);
                return res.status(400).json({ message: 'Invalid date format' });
            }
            console.log('Parsed date:', parsedDate);

            // בדיקת חג
            const holiday = await getHolidayFromHebcal(parsedDate);
            console.log('Holiday result:', holiday);

            // ניתוח תמונה
            const description = await ImageModel.getDescriptionFromImage(descriptionImage);
            console.log('Image description:', description);

            // בדיקת גלוקוז
            const glucoseLevel = await getGlucoseFromUSDA(description);
            console.log('Glucose level:', glucoseLevel);

            // שמירת ארוחה
            console.log('Attempting to save meal with the following data:');
            console.log({
                username,
                mealType,
                date: parsedDate,
                description,
                glucoseLevel: glucoseLevel.glucoseLevel,
                holiday,
            });

            const meal = {
                username,
                mealType,
                date: parsedDate.toISOString().split('T')[0], // פורמט YYYY-MM-DD בלבד
                description: description || null,
                glucoseLevel: glucoseLevel.glucoseLevel, // ערך ברירת מחדל לגלוקוז
                holiday: holiday || 'Regular Day', // ודא שיש ערך תמיד
            };

            const newMeal = await Meal.addMeal(meal);
            console.log('Meal saved successfully:', meal);
            res.status(201).json({ message: 'Meal added successfully!' });
        } catch (error) {
            console.error('Error creating meal:', error.message);
            console.error('Error details:', error);

            if (error.message.includes('Failed to fetch')) {
                return res.status(500).json({ message: 'External service error', error: error.message });
            }

            res.status(500).json({ message: 'Error adding meal', error: error.message });
        }
    },

    // פונקציה להחזרת רשימת ארוחות לפי שם משתמש
    getMeals: async (req, res) => {
        console.log("try to get the meals");
        try {
            const username = req.session?.username || 'guest';
            console.log(`Fetching meals for user: ${username}`);

            const meals = await Meal.getMealsByUsername(username);
            if (meals.length === 0) {
                console.log(`No meals found for user: ${username}`);
                return res.status(404).json({ message: 'No meals found for this user' });
            }

            console.log(`Meals fetched successfully for user: ${username}`, meals);
            res.status(200).json(meals);
        } catch (error) {
            console.error('Error fetching meals:', error.message);
            console.error('Error details:', error);

            res.status(500).json({ message: 'Error fetching meals', error: error.message });
        }
    },
};
