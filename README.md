# מערכת ניהול אורח חיים ותזונה מבוססת ענן
# Cloud-Based Nutrition and Lifestyle Management System

## תיאור / Overview
מערכת Web לניהול אורח חיים וניתוח תזונה, המשתלבת עם שירותי ענן שונים כדי לבצע את המשימות הנדרשות. המערכת כוללת אופציה לאנליטיקה וחיזוי רמות סוכר בזמן מסוים.
A web-based system for lifestyle management and nutrition analysis, integrating multiple cloud services. Optionally supports analytics and blood sugar prediction at specific times.

## תכונות / Features

### דרישות פונקציונליות / Functional Requirements
- **זיהוי משתמש / User Authentication**  
  התחברות מאובטחת למערכת לצפייה ועריכת נתונים אישיים.  
  Secure login functionality for accessing personal data.

- **עדכון ארוחות / Meal Logging**  
  - ארוחת בוקר, צהריים וערב  
  - תאריך ותיאור הארוחה  
  - תמונת הארוחה  
  - רמת סוכר נמדדת אחרי שעתיים  
  - סוג יום: יום חול, חג או מועד  
  Breakfast, lunch, and dinner with date, description, meal photo, measured blood sugar after 2 hours, and day type (weekday, holiday, or special occasion).

- **היסטוריית ארוחות / Meal History Display**  
  הצגת הארוחות לפי טווח תאריכים או לפי סוג הארוחה.  
  View historical meals filtered by date range or meal type (breakfast, lunch, dinner).

- **הודעות בדחיפה / Push Notifications**  
  קבלת התראות בזמן אמת מרופא אודות תוצאות בדיקות חדשות.  
  Receive real-time notifications from a doctor regarding newly available test results.

- **בונוס אופציונלי: חיזוי רמות סוכר / Optional Bonus: Blood Sugar Prediction**  
  - חיזוי רמות סוכר לפי סוג הארוחה, יום ותמונה  
  - בדיקת תוכן תמונה לוודא שמדובר במאכל  
  - בדיקת תאריך לחג או מועד  
  - הצגת נתונים היסטוריים בטבלה או בגרף  
  - תמונה יכולה להגיע גם דרך Telegram API  
  Predict blood sugar levels based on meal type, day, and meal photo; validate image content; check if date is holiday/special occasion; visualize historical data in tables or charts; optional photo via Telegram API.

### דרישות לא פונקציונליות / Non-Functional Requirements
- Node.js / Express.js  
- שני תתי-פרויקטים: ניהול נתונים ושליחת מסרים בזמן אמת  
- גישה לשירותים דרך API Gateway, עם Controllers ו-Models נפרדים לכל שירות  
- DBaaS (למשל Somee.com)  
- שילוב עם שירותי ענן:  
  - ניתוח תמונות: Imagga  
  - מידע תזונתי: USDA ERS Data APIs  
  - אפשרות: Telegram API  
- שירות מסרים בזמן אמת משתמש במתווך כמו Kafka (Upstash / CloudKarafka)  

Node.js / Express.js, two sub-projects (Data Management and Real-Time Messaging), API Gateway with separate Controllers and Models, DBaaS (e.g., Somee.com), cloud integrations: Imagga for image analysis, USDA ERS Data APIs for nutritional info, optional Telegram API. Real-time messaging uses a broker like Kafka (Upstash / CloudKarafka).

## טכנולוגיות / Technologies
- **Backend:** Node.js, Express.js  
- **Frontend:** Web Interface (HTML, CSS, JavaScript)  
- **Database:** DBaaS (SQL)  
- **Cloud APIs:** Imagga, USDA ERS, optional Telegram  
- **Messaging:** Kafka (Upstash / CloudKarafka)

## ארכיטקטורת המערכת / System Architecture
1. API Gateway מנהל את כל הקריאות לשירותים השונים.  
2. שירות ניהול נתונים - אחראי על הזנת ארוחות, הצגת היסטוריה ושילוב עם APIs תזונתיים.  
3. שירות הודעות בזמן אמת - טיפול בהודעות ודחיפות.  
4. ממשק Web למשתמש.  
5. מודול אנליטיקה אופציונלי לחיזוי רמות סוכר.  

1. API Gateway routes requests to services.  
2. Data Management Service handles meal logging, history retrieval, and integration with nutritional APIs.  
3. Real-Time Messaging Service handles notifications.  
4. Web interface for user interaction.  
5. Optional analytics module for blood sugar prediction.

## התקנה והפעלה / Setup and Installation
