const axios = require('axios');
const fs = require('fs');

class ImageModel {
    static apiKey = 'acc_705510e873a5cad';
    static apiSecret = 'c3ce3258c1198596acc18d6e8aadb36a';
    static CONFIDENCE_THRESHOLD = 70;

    static async analyzeImage(imagePath) {
        try {
            const encodedFile = fs.readFileSync(imagePath, { encoding: 'base64' });
            const response = await axios({
                method: 'post',
                url: 'https://api.imagga.com/v2/tags',
                headers: {
                    'Authorization': `Basic ${Buffer.from(this.apiKey + ':' + this.apiSecret).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: { image_base64: encodedFile },
            });

            const tags = response.data.result.tags || [];
            const filteredTags = tags.filter(tag => tag.confidence >= this.CONFIDENCE_THRESHOLD);

            if (filteredTags.length > 0) {
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

    // אליאס לפונקציה
    static async getDescriptionFromImage(imagePath) {
        return this.analyzeImage(imagePath);
    }
}

module.exports = ImageModel;
