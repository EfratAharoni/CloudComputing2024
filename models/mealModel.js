const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const axios = require('axios'); // לשימוש ב-APIs

const Meal = sequelize.define('Meal', {
    username: {
        type: DataTypes.STRING, // שם משתמש
        allowNull: false,
    },
    mealType: {
        type: DataTypes.STRING, // סוג הארוחה (בוקר, צהריים, ערב)
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE, // תאריך הארוחה
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, // תיאור הארוחה
        allowNull: true,
    },
    glucoseLevel: {
        type: DataTypes.FLOAT, // רמת הגלוקוז באוכל
        allowNull: true,
    },
    holiday: {
        type: DataTypes.STRING, // "Holiday" או "Regular Day"
        allowNull: false,
    },
});

// פונקציה לחישוב תיאור התמונה מ-Imagga
Meal.getDescriptionFromImage = async (imagePath) => {
    try {
        const response = await axios.post('https://api.imagga.com/v2/tags', null, {
            headers: {
                Authorization: `Basic ${Buffer.from('acc_705510e873a5cad:YOUR_IMAGGA_API_SECRET').toString('base64')}`,
            },
            params: {
                image: imagePath,
            },
        });
        const tags = response.data.result.tags || [];
        return tags.length > 0 ? tags[0].tag.en : 'No description found';
    } catch (error) {
        console.error('Error fetching description from Imagga:', error.message);
        throw new Error('Failed to fetch description');
    }
};

// פונקציה לחישוב קלוריות מ-USDA
Meal.getCaloriesFromUSDA = async (description) => {
    try {
        const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search`, {
            params: {
                query: description,
                dataType: ['Foundation', 'SR Legacy'],
                api_key: 'dmEABHQgm4n37dIWD7qzKZus7FlseVu449tQAtdU',
            },
        });

        const food = response.data.foods?.[0];
        if (!food) throw new Error('No food found for the given description');

        const caloriesNutrient = food.foodNutrients.find(
            (nutrient) => nutrient.nutrientName === 'Energy'
        );

        return caloriesNutrient ? caloriesNutrient.value : 0;
    } catch (error) {
        console.error('Error fetching calories from USDA:', error.message);
        throw new Error('Failed to fetch calories');
    }
};

// פונקציה לבדוק אם תאריך הוא חג באמצעות Hebcal
Meal.getHolidayFromHebcal = async (date) => {
    try {
        const response = await axios.get(`https://www.hebcal.com/converter`, {
            params: {
                cfg: 'json',
                gy: date.getFullYear(),
                gm: date.getMonth() + 1,
                gd: date.getDate(),
                g2h: 1,
            },
        });

        const holidays = response.data.holidays || [];
        return holidays.length > 0 ? "Holiday" : "Regular Day";
    } catch (error) {
        console.error('Error fetching holiday from Hebcal:', error.message);
        throw new Error('Failed to fetch holiday');
    }
};

module.exports = Meal;
