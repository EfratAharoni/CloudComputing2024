const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./userModel');
const axios = require('axios'); // לשימוש ב-APIs

// הגדרת מודל הארוחה
const Meal = sequelize.define('Meal', {
  mealType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING, // תיאור שיוחזר מ-Imagga
  },
  gram: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER, // נתון שיוחזר מ-USDA
  },
  holiday: {
    type: DataTypes.STRING, // נתון שיוחזר מ-Hebcal
  },
});

// פונקציה לחישוב תיאור התמונה מ-Imagga
Meal.getDescriptionFromImage = async (imagePath) => {
  try {
    const response = await axios.post('https://api.imagga.com/v2/tags', null, {
      headers: {
        Authorization: 'Basic YOUR_IMAGGA_API_KEY',
      },
      params: {
        image: imagePath,
      },
    });
    return response.data.result.tags[0].tag.en; // מחזיר את התיאור הראשון
  } catch (error) {
    console.error('Error fetching description from Imagga:', error);
    throw new Error('Failed to fetch description');
  }
};

// פונקציה לחישוב קלוריות מ-USDA
Meal.getCaloriesFromUSDA = async (description) => {
  try {
    const response = await axios.get(`https://api.usda.gov/fdc/v1/foods/search`, {
      params: {
        query: description,
        dataType: ['Foundation', 'SR Legacy'],
        api_key: 'YOUR_USDA_API_KEY',
      },
    });

    const calories = response.data.foods[0].foodNutrients.find(
      (nutrient) => nutrient.nutrientName === 'Energy'
    ).value;

    return calories;
  } catch (error) {
    console.error('Error fetching calories from USDA:', error);
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
    return holidays.length > 0 ? holidays[0].desc : 'Not a holiday';
  } catch (error) {
    console.error('Error fetching holiday from Hebcal:', error);
    throw new Error('Failed to fetch holiday');
  }
};

module.exports = Meal;
