const axios = require('axios');
const https = require('https');

const getGlucoseFromUSDA = async (description) => {
    try {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${description}&api_key=dmEABHQgm4n37dIWD7qzKZus7FlseVu449tQAtdU`;

        console.log('Fetching USDA data with description:', description);

        const response = await axios.get(url, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Avoid SSL checks (not recommended for production)
            }),
        });

        const foods = response.data.foods;

        if (!foods || foods.length === 0) {
            console.log('No foods found for the description:', description);
            throw new Error('No food found for the given description');
        }

        const nutrients = foods[0].foodNutrients;
        //console.log('All nutrients for food:', nutrients.map(n => ({ name: n.nutrientName, value: n.value })));

        const glucoseValue = nutrients.find(nutrient => nutrient.nutrientName === 'Glucose (dextrose)');
        const sugarValue = nutrients.find(nutrient => nutrient.nutrientName === 'Sugars, total including NLEA');
        const carbohydrateValue = nutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference');

        const glucoseLevel = glucoseValue 
            ? glucoseValue.value 
            : sugarValue 
            ? sugarValue.value 
            : carbohydrateValue 
            ? carbohydrateValue.value 
            : 0;

        //console.log('Glucose Level:', glucoseLevel);

        return {
            glucoseLevel,
            foodName: foods[0].description,
        };
    } catch (error) {
        console.error('Error fetching glucose from USDA:', error.response?.data || error.message);
        throw new Error('Failed to fetch glucose from USDA API');
    }
};


module.exports = { getGlucoseFromUSDA };
