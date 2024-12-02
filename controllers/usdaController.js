const USDAService = require('../models/usdaModel');

class USDAController {
    // בדיקת רמת גלוקוז במוצר
    static async checkGlucose(req, res) {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Food description is required' });
        }

        try {
            const glucoseData = await USDAService.getGlucoseLevel(description);
            res.json({
                foodName: glucoseData.foodName,
                glucoseLevel: glucoseData.glucoseLevel
            });
        } catch (error) {
            console.error('Error checking glucose level:', error.message);
            res.status(500).json({ message: 'Error fetching glucose data' });
        }
    }
}

module.exports = USDAController;
