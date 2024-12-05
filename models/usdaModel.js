const axios = require('axios');
const https = require('https');

const getGlucoseFromUSDA = async (description) => {
    try {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${description}&api_key=dmEABHQgm4n37dIWD7qzKZus7FlseVu449tQAtdU`;

        console.log('Fetching USDA data with description:', description);

        const response = await axios.get(url, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // עקיפת בדיקת SSL (לא מומלץ בייצור)
            }),
        });

        const foods = response.data.foods;

        if (!foods || foods.length === 0) {
            throw new Error('No food found for the given description');
        }

        const nutrients = foods[0].foodNutrients;

        const glucoseValue = nutrients.find(nutrient => nutrient.nutrientName === 'Glucose (dextrose)');
        const sugarValue = nutrients.find(nutrient => nutrient.nutrientName === 'Sugars, total including NLEA');

        return {
            glucoseLevel: glucoseValue ? glucoseValue.value : sugarValue ? sugarValue.value : 0,
            foodName: foods[0].description,
        };
    } catch (error) {
        console.error('Error fetching glucose from USDA:', error.response?.data || error.message);
        throw new Error('Failed to fetch glucose from USDA API');
    }
};

module.exports = { getGlucoseFromUSDA };
