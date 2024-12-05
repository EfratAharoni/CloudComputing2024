const USDAService = require('../models/usdaModel');

class USDAController {
    // בדיקת רמת גלוקוז במוצר
    static async checkGlucose(req, res) {
        const { description } = req.body;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid or empty food description.' });
        }

        try {
            console.log('Checking glucose for description:', description);

            const glucoseData = await USDAService.getGlucoseFromUSDA(description);
            console.log('Glucose data received from USDA:', glucoseData);

            if (!glucoseData || !glucoseData.glucoseLevel) {
                console.log('No glucose data found for:', description);
                return res.status(404).json({ 
                    message: 'No glucose data found for the given description.', 
                    foodName: description 
                });
            }

            res.json({
                success: true,
                data: {
                    foodName: glucoseData.foodName || description,
                    glucoseLevel: glucoseData.glucoseLevel || 'No data available',
                },
            });
        } catch (error) {
            console.error('Error checking glucose level:', error.message);
            res.status(500).json({ 
                message: 'Error fetching glucose data', 
                error: error.message 
            });
        }
        console.log("hhhhhh")
    }
}

module.exports ={ USDAController }
