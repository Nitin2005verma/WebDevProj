// Initialize the table from localStorage
window.onload = function() {
    loadExams();
};

// Function to load exams from localStorage
function loadExams() {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];

    // Sort the exams by date, putting the nearest date on top and passed dates at the bottom
    exams.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
    });

    // Mark passed exams as completed and move them to the bottom
    const currentDate = new Date();
    exams.forEach(exam => {
        const examDate = new Date(exam.date + ' ' + exam.time);
        if (examDate < currentDate) {
            exam.completed = true;
        }
    });

    // Sort exams again to move passed ones to the bottom
    exams.sort((a, b) => {
        if (a.completed === b.completed) {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        }
        return a.completed ? 1 : -1; // Move completed exams to the bottom
    });

    // Update the table
    const tableBody = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    // Add each exam to the table
    exams.forEach((exam, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><input type="date" value="${exam.date}" onchange="updateDate(${index}, this)"></td>
            <td><input type="time" value="${exam.time}" onchange="updateTime(${index}, this)"></td>
            <td contenteditable="true">${exam.subject}</td>
            <td><input type="checkbox" ${exam.completed ? 'checked' : ''} onchange="updateCheckbox(${index}, this)"></td>
            <td><button onclick="deleteExam(${index})">Delete</button></td> <!-- Add Delete button -->
        `;
    });

    // Save the exams to localStorage
    saveExams(exams);
}

// Function to save exams to localStorage
function saveExams(exams) {
    localStorage.setItem('exams', JSON.stringify(exams));
}

// Function to handle adding a new exam
document.getElementById('addExamBtn').addEventListener('click', function() {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)

    // Create a new exam object with current date as the default
    const newExam = {
        date: formattedDate,  // Use the current date as default
        time: '9:00',        // Default time
        subject: 'Subject Name',
        completed: false
    };

    exams.push(newExam);
    saveExams(exams);

    loadExams(); // Reload the table with updated data
});

// Function to update the date field when changed
function updateDate(index, dateInput) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams[index].date = dateInput.value;
    saveExams(exams);

    loadExams(); // Re-sort after date change
}

// Function to update the time field when changed
function updateTime(index, timeInput) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams[index].time = timeInput.value;
    saveExams(exams);

    loadExams(); // Re-sort after time change
}

// Function to update the checkbox status
function updateCheckbox(index, checkbox) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams[index].completed = checkbox.checked;
    saveExams(exams);

    loadExams(); // Re-sort after checkbox change
}

// Function to delete an exam
function deleteExam(index) {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams.splice(index, 1); // Remove the exam at the specified index
    saveExams(exams);

    loadExams(); // Reload the table after deletion
}

// Function to detect changes in editable cells and save them
document.getElementById('examTable').addEventListener('blur', function(event) {
    if (event.target.hasAttribute('contenteditable')) {
        const rowIndex = event.target.closest('tr').rowIndex - 1; // Get the row index
        const colIndex = event.target.cellIndex;

        const exams = JSON.parse(localStorage.getItem('exams')) || [];
        const columnNames = ['date', 'time', 'subject'];

        exams[rowIndex][columnNames[colIndex]] = event.target.innerText;
        saveExams(exams);

        loadExams(); // Re-sort after any changes
    }
}, true);
