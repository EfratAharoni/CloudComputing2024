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

            const newMeal = await Meal.create({
                username,
                mealType,
                date: parsedDate.toISOString().split('T')[0], // פורמט YYYY-MM-DD בלבד
                description: description || null,
                glucoseLevel: glucoseData?.glucoseLevel || null, // ערך ברירת מחדל לגלוקוז
                holiday: holiday || 'Regular Day', // ודא שיש ערך תמיד
            });

            console.log('Meal saved successfully:', savedMeal);
            res.status(201).json({ message: 'Meal added successfully!', meal: savedMeal });
        } catch (error) {
            console.error('Error creating meal:', error.message);
            console.error('Error details:', error);

            if (error.message.includes('Failed to fetch')) {
                return res.status(500).json({ message: 'External service error', error: error.message });
            }

            res.status(500).json({ message: 'Error adding meal', error: error.message });
        }
    },
};
