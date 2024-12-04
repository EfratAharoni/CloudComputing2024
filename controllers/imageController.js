const ImageModel = require('../models/imageModel');

class ImageController {
    static async uploadImageByUrl(req, res) {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'No image URL provided.' 
            });
        }

        try {
            // הורדת התמונה מכתובת URL
            const imagePath = await ImageModel.downloadImageFromUrl(imageUrl);

            // ניתוח התמונה לקבלת תגית ראשונה
            const description = await ImageModel.analyzeImage(imagePath);

            // מחיקת התמונה הזמנית
            ImageModel.deleteTemporaryImage(imagePath);

            if (description) {
                res.json({ 
                    status: 'success',
                    message: 'Food item detected', 
                    description, // מחזיר את התיאור הראשון
                });
            } else {
                res.json({ 
                    status: 'warning',
                    message: 'No food items detected with sufficient confidence.' 
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ 
                status: 'error',
                message: 'Error processing the image'
            });
        }
    }
}

module.exports = ImageController;
