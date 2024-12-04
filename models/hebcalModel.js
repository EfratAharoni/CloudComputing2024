const axios = require('axios');

// פונקציה לחישוב אם זה חג או לא באמצעות Hebcal
const getHolidayFromHebcal = async (date) => {
    try {
        const response = await axios.get('https://www.hebcal.com/converter', {
            params: {
                cfg: 'json',
                gy: date.getFullYear(),
                gm: date.getMonth() + 1,
                gd: date.getDate(),
                g2h: 1,
            },
        });

        const holidays = response.data.holidays || [];
        return holidays.length > 0 ? "Holiday" : "Regular Day";
    } catch (error) {
        console.error('Error fetching holiday from Hebcal:', error.message);
        throw new Error('Failed to fetch holiday');
    }
};

module.exports = { getHolidayFromHebcal };
