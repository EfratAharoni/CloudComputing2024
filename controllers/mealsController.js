const { Meal } = require('../models/mealModel');
const { getHolidayFromHebcal } = require('../models/hebcalModel');
const ImageModel = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');

module.exports = {
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
            const savedMeal = await Meal.create({
                username,
                mealType,
                date: parsedDate,
                description,
                glucoseLevel,
                holiday,
            });

            console.log('Meal saved successfully:', savedMeal);
            res.status(201).json({ message: 'Meal added successfully!', meal: savedMeal });
        } catch (error) {
            console.error('Error creating meal:', error.message);
            
            if (error.message.includes('Failed to fetch')) {
                return res.status(500).json({ message: 'External service error', error: error.message });
            }
            
            res.status(500).json({ message: 'Error adding meal', error: error.message });
        }
    },
};
