const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
                data: { image_base64: encodedFile }
            });

            const tags = response.data.result.tags || [];
            return tags
                .filter(tag => tag.confidence >= this.CONFIDENCE_THRESHOLD)
                .map(tag => tag.tag.en);
        } catch (error) {
            console.error('Error with Imagga API:', error.response?.data || error.message);
            throw new Error('Failed to process image with Imagga API');
        }
    }

    static async downloadImageFromUrl(imageUrl) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imagePath = path.join(__dirname, '../uploads', `temp-${Date.now()}.jpg`);
            
            if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
                fs.mkdirSync(path.join(__dirname, '../uploads'));
            }

            fs.writeFileSync(imagePath, response.data);
            return imagePath;
        } catch (error) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }

    static deleteTemporaryImage(imagePath) {
        try {
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.error(`Failed to delete temporary image: ${error.message}`);
        }
    }
}

module.exports = ImageModel;