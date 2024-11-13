let subjectCount = 0;

// Color options provided
const colorChoices = ['#9B87D2', '#F55E60', '#8EF3F7', '#A3F982'];

// Load subjects from localStorage when the page is loaded
window.onload = function() {
  loadSubjects();
  
  // Ensure the "Add Subject" button works by binding the event listener
  document.getElementById("addSubjectBtn").addEventListener("click", addSubject);
};

// Function to create a new subject
function addSubject() {
  subjectCount++;

  const subjectDiv = document.createElement('div');
  subjectDiv.classList.add('subject');
  subjectDiv.id = 'subject' + subjectCount;

  // Create subject name input
  const subjectTitleInput = document.createElement('input');
  subjectTitleInput.type = 'text';
  subjectTitleInput.placeholder = 'Enter Subject Name';
  subjectTitleInput.classList.add('subject-input');

  // Create color options for the subject
  const colorOptionsDiv = document.createElement('div');
  colorOptionsDiv.classList.add('color-options');

  colorChoices.forEach(color => {
    const colorInput = document.createElement('input');
    colorInput.type = 'radio';
    colorInput.name = 'color' + subjectCount;
    colorInput.value = color;
    colorInput.style.backgroundColor = color;
    colorInput.addEventListener('change', () => updateSubjectColor(subjectDiv, color));
    colorOptionsDiv.appendChild(colorInput);
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Set Subject';
  confirmBtn.classList.add('btn');
  confirmBtn.onclick = () => setSubjectDetails(subjectDiv, subjectTitleInput.value, colorOptionsDiv);

  // Add inputs and button to subject block
  subjectDiv.appendChild(subjectTitleInput);
  subjectDiv.appendChild(colorOptionsDiv);
  subjectDiv.appendChild(confirmBtn);

  // Add the subject block to the container
  document.getElementById('subjectsContainer').appendChild(subjectDiv);
}

// Function to set subject name and color
function setSubjectDetails(subjectDiv, name, colorOptionsDiv) {
  if (name.trim() !== '') {
    const subjectTitle = document.createElement('h3');
    subjectTitle.textContent = name;
    subjectDiv.style.backgroundColor = getSelectedColor(colorOptionsDiv);

    // Replace input and button with finalized subject name and color
    subjectDiv.innerHTML = '';
    subjectDiv.appendChild(subjectTitle);

    const addTopicBtn = document.createElement('button');
    addTopicBtn.textContent = 'Add Topic';
    addTopicBtn.classList.add('btn', 'add-topic-btn');
    addTopicBtn.onclick = () => addTopic(subjectDiv, subjectDiv.style.backgroundColor);

    const deleteSubjectBtn = document.createElement('button');
    deleteSubjectBtn.textContent = 'Delete Subject';
    deleteSubjectBtn.classList.add('btn', 'delete-subject-btn');
    deleteSubjectBtn.onclick = () => deleteSubject(subjectDiv);

    const topicList = document.createElement('ul');
    topicList.classList.add('topic-list');

    subjectDiv.appendChild(addTopicBtn);
    subjectDiv.appendChild(deleteSubjectBtn);
    subjectDiv.appendChild(topicList);

    // Save data to localStorage
    saveSubjects();
  }
}

// Function to get the selected color from color options
function getSelectedColor(colorOptionsDiv) {
  const selectedColorInput = colorOptionsDiv.querySelector('input[type="radio"]:checked');
  return selectedColorInput ? selectedColorInput.value : '#3498db'; // Default to blue
}

// Function to update the subject color
function updateSubjectColor(subjectDiv, color) {
  subjectDiv.style.backgroundColor = color;
}

// Function to delete a subject
function deleteSubject(subjectDiv) {
  document.getElementById('subjectsContainer').removeChild(subjectDiv);
  saveSubjects(); // Re-save after deletion
}

// Function to add a new topic
function addTopic(subjectDiv, color) {
  const topicName = document.createElement('div');
  topicName.classList.add('topic-item');
  
  const topicText = document.createElement('span');
  topicText.textContent = ' ';
  topicText.classList.add('editable-topic');

  // Make the topic text editable on click
  topicText.contentEditable = true;
  topicText.addEventListener('blur', () => saveSubjects()); // Save on losing focus

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.accentColor = color;

  const deleteTopicBtn = document.createElement('button');
  deleteTopicBtn.textContent = 'Delete Topic';
  deleteTopicBtn.classList.add('btn', 'delete-topic-btn');
  deleteTopicBtn.onclick = () => deleteTopic(topicName);

  // Append checkbox, topic name, and delete button to the topic item
  topicName.appendChild(checkbox);
  topicName.appendChild(topicText);
  topicName.appendChild(deleteTopicBtn);

  // Add the topic item to the topic list
  const topicList = subjectDiv.querySelector('.topic-list');
  topicList.appendChild(topicName);

  saveSubjects(); // Save after adding a topic
}

// Function to delete a topic
function deleteTopic(topicItem) {
  topicItem.parentNode.removeChild(topicItem);
  saveSubjects(); // Save after deleting a topic
}

// Function to save the current subjects to localStorage
function saveSubjects() {
  const subjects = [];
  const subjectDivs = document.querySelectorAll('.subject');

  subjectDivs.forEach(subjectDiv => {
    const subject = {
      name: subjectDiv.querySelector('h3').textContent,
      color: subjectDiv.style.backgroundColor,
      topics: []
    };

    const topics = subjectDiv.querySelectorAll('.topic-item');
    topics.forEach(topic => {
      const topicName = topic.querySelector('.editable-topic').textContent;
      const isChecked = topic.querySelector('input[type="checkbox"]').checked;
      subject.topics.push({ name: topicName, checked: isChecked });
    });

    subjects.push(subject);
  });

  localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Function to load subjects from localStorage
function loadSubjects() {
  const savedSubjects = localStorage.getItem('subjects');
  if (savedSubjects) {
    const subjects = JSON.parse(savedSubjects);
    subjects.forEach(subject => {
      const subjectDiv = document.createElement('div');
      subjectDiv.classList.add('subject');
      subjectDiv.style.backgroundColor = subject.color;

      const subjectTitle = document.createElement('h3');
      subjectTitle.textContent = subject.name;
      subjectDiv.appendChild(subjectTitle);

      const addTopicBtn = document.createElement('button');
      addTopicBtn.textContent = 'Add Topic';
      addTopicBtn.classList.add('btn', 'add-topic-btn');
      addTopicBtn.onclick = () => addTopic(subjectDiv, subject.color);

      const deleteSubjectBtn = document.createElement('button');
      deleteSubjectBtn.textContent = 'Delete Subject';
      deleteSubjectBtn.classList.add('btn', 'delete-subject-btn');
      deleteSubjectBtn.onclick = () => deleteSubject(subjectDiv);

      const topicList = document.createElement('ul');
      topicList.classList.add('topic-list');

      subject.topics.forEach(topic => {
        const topicItem = document.createElement('li');
        topicItem.classList.add('topic-item');

        const topicText = document.createElement('span');
        topicText.textContent = topic.name;
        topicText.classList.add('editable-topic');
        topicText.contentEditable = true;
        topicText.addEventListener('blur', () => saveSubjects()); // Save on losing focus

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = topic.checked;
        checkbox.style.accentColor = subject.color;

        const deleteTopicBtn = document.createElement('button');
        deleteTopicBtn.textContent = 'Delete Topic';
        deleteTopicBtn.classList.add('btn', 'delete-topic-btn');
        deleteTopicBtn.onclick = () => deleteTopic(topicItem);

        topicItem.appendChild(checkbox);
        topicItem.appendChild(topicText);
        topicItem.appendChild(deleteTopicBtn);
        topicList.appendChild(topicItem);
      });

      subjectDiv.appendChild(addTopicBtn);
      subjectDiv.appendChild(deleteSubjectBtn);
      subjectDiv.appendChild(topicList);

      document.getElementById('subjectsContainer').appendChild(subjectDiv);
    });
  }
}
