const { analyzeImage } = require('../models/imaggaModel');

/**
 * מטפל בבקשת העלאת תמונה וניתוחה.
 * @param {object} req - הבקשה שמגיעה מהלקוח
 * @param {object} res - התשובה שתשלח ללקוח
 */
exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // ניתוח התמונה באמצעות Imagga
        const ingredients = await analyzeImage(req.file.path);

        // החזרת תגובה ללקוח
        if (ingredients.length > 0) {
            res.json({ message: 'Food items detected:', ingredients });
        } else {
            res.json({ message: 'No food items detected with sufficient confidence.' });
        }
    } catch (error) {
        console.error('Error processing the image:', error.message);
        res.status(500).send('Error processing the image');
    }
};
