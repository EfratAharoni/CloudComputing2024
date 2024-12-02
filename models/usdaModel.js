const axios = require('axios');

class USDAService {
    static apiKey = 'dmEABHQgm4n37dIWD7qzKZus7FlseVu449tQAtdU'; // ה-Key שלך

    static async getGlucoseLevel(description) {
        try {
            const response = await axios.get(
                `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(description)}&api_key=${this.apiKey}`
            );

            console.log('Response from USDA API:', response.data); // הצג את כל התשובה בקונסול
            const food = response.data.foods[0]; // המוצר הראשון ברשימה

            if (!food) {
                throw new Error('No food found for the given description');
            }

            const glucoseNutrient = food.foodNutrients.find(nutrient => 
                nutrient.nutrientName.toLowerCase().includes('sugar') || 
                nutrient.nutrientName.toLowerCase().includes('glucose')
            );

            return {
                foodName: food.description,
                glucoseLevel: glucoseNutrient ? glucoseNutrient.value : 0
            };
        } catch (error) {
            console.error('Error fetching glucose data:', error.response?.data || error.message);
            throw new Error('Failed to fetch glucose data from USDA API');
        }
    }
}

module.exports = USDAService;
