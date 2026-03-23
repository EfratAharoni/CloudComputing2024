# מערכת ניהול אורח חיים ותזונה מבוססת ענן
# Cloud-Based Nutrition and Lifestyle Management System

---

## חלק 1: עברית / Hebrew Version

### תיאור
מערכת Web לניהול אורח חיים וניתוח תזונה, המשתלבת עם שירותי ענן שונים כדי לבצע את המשימות הנדרשות. המערכת כוללת אופציה לאנליטיקה וחיזוי רמות סוכר בזמן מסוים.

### תכונות

#### דרישות פונקציונליות
- **זיהוי משתמש**: התחברות מאובטחת למערכת לצפייה ועריכת נתונים אישיים.
- **עדכון ארוחות**: ארוחת בוקר, צהריים וערב; תאריך ותיאור; תמונת הארוחה; רמת סוכר אחרי שעתיים; סוג יום (יום חול, חג או מועד).
- **היסטוריית ארוחות**: הצגת הארוחות לפי טווח תאריכים או לפי סוג הארוחה.
- **הודעות בדחיפה**: קבלת התראות בזמן אמת מרופא.
- **בונוס אופציונלי - חיזוי רמות סוכר**: חיזוי לפי סוג ארוחה, יום ותמונה; בדיקת תוכן תמונה; בדיקת תאריך לחג או מועד; הצגת נתונים היסטוריים; תמונה דרך Telegram API.

#### דרישות לא פונקציונליות
- Node.js / Express.js
- שני תתי-פרויקטים: ניהול נתונים ושליחת מסרים בזמן אמת
- API Gateway עם Controllers ו-Models נפרדים
- DBaaS (למשל Somee.com)
- שילוב עם שירותי ענן: Imagga (תמונות), USDA ERS (תזונה), Telegram API (אופציונלי)
- שירות מסרים בזמן אמת עם Kafka (Upstash / CloudKarafka)

### טכנולוגיות
- Backend: Node.js, Express.js
- Frontend: Web (HTML, CSS, JavaScript)
- Database: DBaaS (SQL)
- Cloud APIs: Imagga, USDA ERS, Telegram (אופציונלי)
- Messaging: Kafka (Upstash / CloudKarafka)

### ארכיטקטורת המערכת
1. API Gateway מנהל קריאות לשירותים
2. שירות ניהול נתונים: הזנת ארוחות, הצגת היסטוריה, שילוב עם APIs תזונתיים
3. שירות הודעות בזמן אמת: טיפול בדחיפות והודעות
4. ממשק Web למשתמש
5. מודול אנליטיקה אופציונלי לחיזוי רמות סוכר


# Cloud-Based Nutrition and Lifestyle Management System

## Overview
A web-based system for lifestyle management and nutrition analysis, integrating multiple cloud services to perform the required tasks. The system optionally supports analytics and blood sugar prediction at specific times.

## Features

### Functional Requirements
- **User Authentication**: Secure login functionality for accessing and editing personal data.
- **Meal Logging**:  
  - Breakfast, lunch, and dinner  
  - Date and description of the meal  
  - Meal photo  
  - Blood sugar measured 2 hours after the meal  
  - Day type: weekday, holiday, or special occasion  
- **Meal History Display**: View historical meals filtered by date range or meal type.  
- **Push Notifications**: Receive real-time notifications from a doctor regarding newly available test results.  
- **Optional Bonus - Blood Sugar Prediction**:  
  - Predict blood sugar based on meal type, day, and photo  
  - Validate image content to ensure it contains food  
  - Check if the date is a holiday or special occasion  
  - Display historical data in tables or charts  
  - Optional photo upload via Telegram API

### Non-Functional Requirements
- Built with **Node.js** and **Express.js**  
- Two sub-projects: Data Management and Real-Time Messaging  
- Access via **API Gateway**, with separate **Controllers** and **Models** for each service  
- Database hosted as **DBaaS** (e.g., Somee.com)  
- Integration with cloud services:  
  - **Imagga** for image analysis  
  - **USDA ERS Data APIs** for nutritional information  
  - Optional: **Telegram API** for photo upload  
- Real-time messaging sub-project uses a broker such as **Kafka** (Upstash / CloudKarafka)

## Technologies
- **Backend:** Node.js, Express.js  
- **Frontend:** Web interface (HTML, CSS, JavaScript)  
- **Database:** DBaaS (SQL)  
- **Cloud APIs:** Imagga, USDA ERS, Telegram (optional)  
- **Messaging:** Kafka (Upstash / CloudKarafka)

## System Architecture
1. **API Gateway** routes requests to the appropriate services.  
2. **Data Management Service** handles meal logging, history retrieval, and integration with nutritional APIs.  
3. **Real-Time Messaging Service** handles notifications and push messages.  
4. **Web Interface** for user interaction.  
5. **Optional Analytics Module** for blood sugar prediction.

