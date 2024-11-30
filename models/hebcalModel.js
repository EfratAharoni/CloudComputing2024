const axios = require('axios');

class HebcalModel {
    static async getDayInfo(date) {
        try {
            const url = `https://www.hebcal.com/converter?cfg=json&gy=${date.split('-')[0]}&gm=${date.split('-')[1]}&gd=${date.split('-')[2]}&g2h=1`;
            const response = await axios.get(url);

            if (response.data.events && response.data.events.length > 0) {
                return `The date falls on: ${response.data.events.join(', ')}`;
            } else if (response.data.weekday === "Saturday") {
                return "The selected date is Shabbat.";
            } else {
                return "The selected date is a regular weekday.";
            }
        } catch (error) {
            console.error('Error fetching Hebcal data:', error.message);
            throw new Error('Unable to fetch date information');
        }
    }
}

module.exports = HebcalModel;
