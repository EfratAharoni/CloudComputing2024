const HebcalModel = require('../models/hebcalModel');

class HebcalController {
    static async checkDate(req, res) {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: 'No date provided' });
        }

        try {
            // שימוש בפונקציה getHolidayFromHebcal
            const result = await HebcalModel.getHolidayFromHebcal(date);
            res.json({ message: result });
        } catch (error) {
            console.error('Error checking date:', error.message);
            res.status(500).json({ message: 'Error checking the date' });
        }
    }
}

module.exports = HebcalController;
