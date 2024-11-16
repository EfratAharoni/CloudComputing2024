const axios = require('axios');
const fs = require('fs');

const apiKey = 'acc_705510e873a5cad'; 
const apiSecret = 'c3ce3258c1198596acc18d6e8aadb36a'; 
const CONFIDENCE_THRESHOLD = 70; // רמת ביטחון מינימלית

/**
 * מנתח תמונה באמצעות ה-API של Imagga.
 * @param {string} imagePath - הנתיב לקובץ התמונה
 * @returns {Promise<Array>} - מערך של תגיות מזון מזוהות
 */
const analyzeImage = async (imagePath) => {
    try {
        // קריאה לקובץ התמונה שהועלה והמרה ל-Base64
        const encodedFile = fs.readFileSync(imagePath, { encoding: 'base64' });

        // שליחת בקשה ל-API של Imagga
        const response = await axios({
            method: 'post',
            url: 'https://api.imagga.com/v2/tags',
            headers: {
                'Authorization': `Basic ${Buffer.from(apiKey + ':' + apiSecret).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                image_base64: encodedFile,
            }
        });

        // בדיקת התוצאה וסינון תגיות לפי רמת ביטחון
        const tags = response.data.result.tags || [];
        const filteredTags = tags
            .filter(tag => tag.confidence >= CONFIDENCE_THRESHOLD)
            .map(tag => tag.tag.en);

        return filteredTags;
    } catch (error) {
        console.error('Error with Imagga API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to process image with Imagga API');
    }
};

module.exports = { analyzeImage };
