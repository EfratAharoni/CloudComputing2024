const axios = require('axios');

// פונקציה לחישוב כמות הגלוקוז/קלוריות באמצעות USDA
const getGlucoseFromUSDA = async (description) => {
    try {
        const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
            params: {
                query: description,
                dataType: ['Foundation', 'SR Legacy'],
                api_key: 'dmEABHQgm4n37dIWD7qzKZus7FlseVu449tQAtdU',
            },
        });

        const food = response.data.foods?.[0];
        if (!food) throw new Error('No food found for the given description');

        const glucoseNutrient = food.foodNutrients.find(
            (nutrient) => nutrient.nutrientName === 'Energy'  // כאן תוכל להתאים את החישוב לפי הצורך
        );

        return glucoseNutrient ? glucoseNutrient.value : 0;
    } catch (error) {
        console.error('Error fetching glucose from USDA:', error.message);
        throw new Error('Failed to fetch glucose');
    }
};

module.exports = { getGlucoseFromUSDA };
