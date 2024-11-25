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
            const imagePath = await ImageModel.downloadImageFromUrl(imageUrl);
            const ingredients = await ImageModel.analyzeImage(imagePath);
            ImageModel.deleteTemporaryImage(imagePath);

            if (ingredients.length > 0) {
                res.json({ 
                    status: 'success',
                    message: 'Food items detected', 
                    ingredients 
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