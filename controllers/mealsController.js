const Meal = require('../models/mealModel');
const { getHolidayFromHebcal } = require('../models/hebcalModel');
const ImageModel = require('../models/imageModel');
const { getGlucoseFromUSDA } = require('../models/usdaModel');
const { predictGlucose } = require('../models/predictionModel'); 

module.exports = {

    filterMealsByDate: async (req, res) => {
        const { startDate, endDate } = req.body;  
        const meals = req.session.meals;  
    
        const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;  
        if (meals.length === 0) {
            return res.redirect('/meals');  
        }
    
        const filteredMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date).setHours(0, 0, 0, 0); 
            const isAfterFromDate = from ? mealDate >= from : true;
            const isBeforeToDate = to ? mealDate <= to : true;
            return isAfterFromDate && isBeforeToDate;
        });

        req.session.filterMeals = filteredMeals;
        res.redirect('/meals');
    },


    createMeal: async (req, res, mealType, date, BloodSugarLevel, descriptionImage) => {
        try {

            const username = req.session?.username || 'guest';

            const parsedDate = new Date(date);
            if (isNaN(parsedDate)) {
                console.error('Invalid date format received:', date);
                return res.status(400).json({ message: 'Invalid date format' });
            }
            const holiday = await getHolidayFromHebcal(parsedDate);
            const description = await ImageModel.getDescriptionFromImage(descriptionImage);
            const glucoseLevel = await getGlucoseFromUSDA(description);

            const meal = {
                username,
                mealType,
                date: parsedDate.toISOString().split('T')[0],
                description: description || null,
                glucoseLevel: glucoseLevel.glucoseLevel, 
                BloodSugarLevel,
                holiday: holiday || 'Regular Day', 
            };

            const newMeal = await Meal.addMeal(meal);
            console.log('Meal saved successfully:', meal);
            if (!req.session.meals) {
                req.session.meals = []; 
            }
            req.session.meals.push(meal); 
            req.session.filterMeals.push(meal); 
            res.redirect('/a');
            console.log("bye bye")

        } catch (error) {
            console.error('Error creating meal:', error.message);
            console.error('Error details:', error);

            if (error.message.includes('Failed to fetch')) {
                return res.status(500).json({ message: 'External service error', error: error.message });
            }

            res.status(500).json({ message: 'Error adding meal', error: error.message });
        }
    },
    

    getMeals: async (req, res) => {
        try {

            const username = req.session?.username || 'guest';
            const meals = await Meal.getMealsByUsername(username);

            if (meals.length === 0) {
                req.session.meals = []; 
                req.session.filterMeals=[];
                console.log(`No meals found for user: ${username}`);
                return;
            }

            req.session.meals = meals; 
            req.session.filterMeals= meals;   

        } catch (error) {
            console.error('Error fetching meals:', error.message);
            console.error('Error details:', error);

            res.status(500).json({ message: 'Error fetching meals', error: error.message });
        }
    },

    predictGlucose: async (req, res) => {
        try {
            const meals = req.session?.meals || [];
            if (meals.length === 0) {
                return res.status(404).json({ message: 'No meal data available for prediction.' });
            }
    
            meals.forEach(meal => {
                if (!meal.BloodSugarLevel) {
                    meal.BloodSugarLevel = 0; 
                }
            });
    
            const predictions = await predictGlucose(meals);
            res.json({ message: 'Prediction successful', predictions });
        } catch (error) {
            console.error('Prediction error:', error.message);
            res.status(500).json({ message: 'Prediction failed', error: error.message });
        }
    }
    
};


