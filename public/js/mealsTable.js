document.addEventListener('DOMContentLoaded', () => {
  const addMealButton = document.getElementById('addMealButton');
  const mealModal = document.getElementById('mealModal');
  const closeButton = document.querySelector('.close-button');
  const addMealForm = document.getElementById('addMealForm');

  // פתיחת המודל
  addMealButton.addEventListener('click', () => {
    mealModal.style.display = 'block';
  });

  // סגירת המודל
  closeButton.addEventListener('click', () => {
    mealModal.style.display = 'none';
  });

  // שליחת נתוני הארוחה לשרת
  addMealForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // מונע רענון של הדף

    const formData = new FormData();
    formData.append('mealType', document.getElementById('mealType').value);
    formData.append('dateTime', document.getElementById('dateTime').value);
    formData.append('description', document.getElementById('descriptionImage').files[0]); // קובץ התמונה
    formData.append('gram', document.getElementById('gram').value);

    try {
      // שליחת הנתונים לשרת
      const response = await fetch('/api/meals', {
        method: 'POST',
        body: formData, // שליחת הנתונים כ-FormData
      });

      if (response.ok) {
        const newMeal = await response.json();

        // עדכון הטבלה בלקוח
        const tableBody = document.querySelector('table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${newMeal.mealType}</td>
          <td>${newMeal.dateTime}</td>
          <td>${newMeal.description}</td>
          <td>${newMeal.gram}</td>
          <td>${newMeal.calories}</td>
          <td>${newMeal.holiday}</td>
        `;
        tableBody.appendChild(newRow);

        // סגירת המודל ואיפוס הטופס
        addMealForm.reset();
        mealModal.style.display = 'none';
        alert('Meal added successfully!');
      } else {
        alert('Failed to save meal. Please try again.');
        console.error('Error:', await response.text());
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  });
});
