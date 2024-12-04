const { getHolidayFromHebcal } = require('./hebcalModel');
const { getDescriptionFromImage } = require('./imageModel');
const { getGlucoseFromUSDA } = require('./usdaModel');

class Meal {
    constructor(username, mealType, date, imagePath) {
        this.username = username;
        this.mealType = mealType;
        this.date = date;
        this.imagePath = imagePath;
        this.description = null;
        this.glucoseLevel = null;
        this.holiday = null;
    }

    async initializeMeal() {
        console.log('Initializing meal...');

        try {
            // חישוב אם זה חג או לא
            this.holiday = await getHolidayFromHebcal(this.date);
            console.log('Holiday:', this.holiday);

            // חישוב תיאור התמונה באמצעות Imagga
            this.description = await getDescriptionFromImage(this.imagePath);
            console.log('Description:', this.description);

            // חישוב רמת גלוקוז/קלוריות באמצעות USDA
            this.glucoseLevel = await getGlucoseFromUSDA(this.description);
            console.log('Glucose Level:', this.glucoseLevel);
        } catch (error) {
            console.error('Error initializing meal:', error);
            throw new Error('Failed to initialize meal');
        }
    }

}

module.exports = { Meal };
