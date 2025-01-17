const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class ImageModel {
    static apiKey = 'acc_c0c982c9e1559ca';
    static apiSecret = '3042ba139cd30fb0ff73902079731e70';
    static CONFIDENCE_THRESHOLD = 70;

    static async analyzeImage(imagePath) {
        try {

            if (!fs.existsSync(imagePath)) {
                throw new Error("File does not exist at the given path.");
            }

            const fileBuffer = fs.readFileSync(imagePath);

            // יצירת אובייקט FormData
            const formData = new FormData();
            formData.append('image', fileBuffer, {
                filename: imagePath.split('\\').pop(),
                contentType: 'image/jpeg', 
            });

            const response = await axios.post(
                'https://api.imagga.com/v2/tags',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Basic ${Buffer.from(this.apiKey + ':' + this.apiSecret).toString('base64')}`,
                    },
                    httpsAgent: new (require('https').Agent)({
                        rejectUnauthorized: false,
                    }),
                }
            );

            // ניתוח התגובה
            const tags = response.data.result.tags || [];
            const filteredTags = tags.filter(tag => tag.confidence >= this.CONFIDENCE_THRESHOLD);

            // החזרת התוצאה הראשונה
            if (filteredTags.length > 0) {
                console.log("Top tag:", filteredTags[0].tag.en);
                return filteredTags[0].tag.en;
            } else {
                console.warn('No tags found with sufficient confidence for:', imagePath);
                return 'No suitable description available';
            }
        } catch (error) {
            console.error('Error with Imagga API:', error.response?.data || error.message);
            throw new Error('Failed to process image with Imagga API');
        }
    }

    static async getDescriptionFromImage(imagePath) {
        return this.analyzeImage(imagePath);
    }
}

module.exports = ImageModel;
