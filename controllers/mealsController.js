const Meal = require('../models/meal');
const axios = require('axios');
const multer = require('multer');

// הגדרת Multer לשמירת קבצים
const upload = multer({ dest: 'uploads/' });

exports.createMeal = async (req, res) => {
  try {
    const { mealType, dateTime, gram } = req.body;
    const descriptionImage = req.file; // תמונת התיאור

    // 1. העלאת תמונה ל-Imagga
    const imaggaResponse = await axios.post('https://api.imagga.com/v2/tags', null, {
      headers: {
        Authorization: 'Basic YOUR_IMAGGA_API_KEY',
      },
      params: {
        image: descriptionImage.path,
      },
    });

    const description = imaggaResponse.data.result.tags[0].tag.en; // קבלת התיאור

    // 2. חישוב קלוריות באמצעות API של USDA
    const usdaResponse = await axios.get(`https://api.usda.gov/fdc/v1/foods/search`, {
      params: {
        query: description,
        dataType: ['Foundation', 'SR Legacy'],
        api_key: 'YOUR_USDA_API_KEY',
      },
    });

    const calories = usdaResponse.data.foods[0].foodNutrients.find(
      (nutrient) => nutrient.nutrientName === 'Energy'
    ).value;

    // 3. בדיקת חג באמצעות Hebcal
    const date = new Date(dateTime);
    const hebcalResponse = await axios.get(`https://www.hebcal.com/converter`, {
      params: {
        cfg: 'json',
        gy: date.getFullYear(),
        gm: date.getMonth() + 1,
        gd: date.getDate(),
        g2h: 1,
      },
    });

    const holiday = hebcalResponse.data.holidays?.[0]?.desc || 'Not a holiday';

    // 4. יצירת הארוחה ושמירתה במסד הנתונים
    const newMeal = await Meal.create({
      mealType,
      dateTime,
      description,
      gram,
      calories,
      holiday,
    });

    res.status(201).json(newMeal); // החזרת הארוחה ללקוח
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
};
