const Meal = require('../models/mealModel');
const { getHolidayFromHebcal } = require('../models/hebcalModel');
const ImageModel = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');

module.exports = {

    filterMealsByDate: async (req, res) => {
        const { startDate, endDate } = req.body;  // קבלת התאריכים מה-body
        const meals = req.session.meals;  // קבלת כל הארוחות
    
        // המרת התאריכים לתאריכים ב-JavaScript (אם הם לא null)
        const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;  // עד סוף היום של ה-endDate
        if (meals.length === 0) {
            return res.redirect('/meals');  // או החזרת הודעה שמתארת שהיו בעיות בהבאת הארוחות
        }
    
        // סינון הארוחות לפי טווח התאריכים
        const filteredMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date).setHours(0, 0, 0, 0);  // המרת תאריך הארוחה לתאריך בלבד
            const isAfterFromDate = from ? mealDate >= from : true;
            const isBeforeToDate = to ? mealDate <= to : true;
            return isAfterFromDate && isBeforeToDate;
        });

    
        // עדכון ה-session עם הארוחות המפולטרות
        req.session.filterMeals = filteredMeals;
        res.redirect('/meals');
    },
    
    
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
            if (!req.session.meals) {
                req.session.meals = []; // אם לא קיימת רשימה, צור חדשה
            }
            req.session.meals.push(meal); // הוסף את הארוחה החדשה לרשימה
            req.session.filterMeals.push(meal); 
            res.redirect('/meals');


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
                req.session.meals = []; 
                req.session.filterMeals=[];
                console.log(`No meals found for user: ${username}`);
                return res.status(404).json({ message: 'No meals found for this user' });
            }

            console.log(`Meals fetched successfully for user: ${username}`, meals);
            req.session.meals = meals; 
            req.session.filterMeals=meals;      
            console.log("meals are in");
        } catch (error) {
            console.error('Error fetching meals:', error.message);
            console.error('Error details:', error);

            res.status(500).json({ message: 'Error fetching meals', error: error.message });
        }
    },
};
