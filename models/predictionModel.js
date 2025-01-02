const { DecisionTreeClassifier } = require('ml-cart');

async function predictGlucose(mealData) {
    try {
        if (!mealData || mealData.length === 0) {
            throw new Error('Meal data is empty or undefined');
        }

        // ✅ קידוד נתונים קטגוריים (Label Encoding)
        const mealTypeEncoding = { breakfast: 0, lunch: 1, dinner: 2 };
        const holidayEncoding = { 'Regular Day': 0, 'Holiday': 1 };

        // ✅ המרת המידע למבנה נתונים מתאים
        const inputs = mealData.map(meal => [
            mealTypeEncoding[meal.mealType] || 0,  // קידוד סוג הארוחה
            holidayEncoding[meal.holiday] || 0,   // קידוד חג
            meal.glucoseLevel || 0,               // רמת גלוקוז במזון
            meal.BloodSugarLevel || 0            // רמת סוכר בדם אחרי הארוחה
        ]);

        // ✅ שימוש ב-BloodSugarLevel כתגית למודל
        const labels = mealData.map(meal => meal.BloodSugarLevel || 0);

        if (inputs.length === 0 || labels.length === 0) {
            throw new Error('Inputs or labels array is empty after processing.');
        }

        // ✅ יצירת מודל Decision Tree
        const cart = new DecisionTreeClassifier();
        cart.train(inputs, labels);

        console.log('Model trained successfully');

        // ✅ דוגמת חיזוי - שימוש בכל הקלטים לחיזוי
        const predictedValues = inputs.map(input => {
            if (!Array.isArray(input) || input.length === 0) {
                console.warn('Invalid input for prediction:', input);
                return 0; // ברירת מחדל אם הקלט לא חוקי
            }
            return cart.predict([input])[0]; // Ensure input is wrapped in an array
        });

        console.log('Predicted Values:', predictedValues);

        return predictedValues;
    } catch (error) {
        console.error('Prediction error:', error.message);
        throw error;
    }
}

module.exports = { predictGlucose };
