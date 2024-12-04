const axios = require('axios');

// פונקציה לחישוב תיאור התמונה באמצעות Imagga
const getDescriptionFromImage = async (imagePath) => {
    try {
        const response = await axios.post('https://api.imagga.com/v2/tags', null, {
            headers: {
                Authorization: `Basic ${Buffer.from('acc_705510e873a5cad:YOUR_IMAGGA_API_SECRET').toString('base64')}`,
            },
            params: {
                image: imagePath,
            },
        });
        const tags = response.data.result.tags || [];
        return tags.length > 0 ? tags[0].tag.en : 'No description found';
    } catch (error) {
        console.error('Error fetching description from Imagga:', error.message);
        throw new Error('Failed to fetch description');
    }
};

module.exports = { getDescriptionFromImage };
