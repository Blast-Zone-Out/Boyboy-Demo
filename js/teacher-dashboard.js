// Check if user is teacher
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'teacher') {
  alert('Access denied. Please login as Teacher.');
  window.location.href = '../index.html';
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
});

// Load students and registration requests
function loadStudents() {
  return JSON.parse(localStorage.getItem('students')) || [];
}

function loadRegistrationRequests() {
  return JSON.parse(localStorage.getItem('registrationRequests')) || [];
}

function saveRegistrationRequests(requests) {
  localStorage.setItem('registrationRequests', JSON.stringify(requests));
}

// Register student (adds to registration requests)
const registerStudentForm = document.getElementById('registerStudentForm');
const registerMessage = document.getElementById('registerMessage');
registerStudentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('studentUsername').value.trim();
  const password = document.getElementById('studentPassword').value.trim();
  const grade = document.getElementById('studentGrade').value;

  if (!username || !password || !grade) {
    registerMessage.textContent = 'Please fill all fields.';
    return;
  }

  // Check if username already exists in students or registration requests
  const students = loadStudents();
  const requests = loadRegistrationRequests();
  if (students.find(s => s.username === username) || requests.find(r => r.username === username)) {
    registerMessage.textContent = 'Username already exists.';
    return;
  }

  requests.push({ username, password, grade });
  saveRegistrationRequests(requests);
  registerMessage.style.color = 'green';
  registerMessage.textContent = 'Student registration request submitted.';
  registerStudentForm.reset();
  renderRegistrationRequests();
});

// Render registration requests for teacher info
function renderRegistrationRequests() {
  const requests = loadRegistrationRequests();
  const container = document.getElementById('registerMessage');
  if (requests.length > 0) {
    container.textContent = 'There are pending student registration requests for Admin approval.';
  } else {
    container.textContent = '';
  }
}

// Initial render
renderRegistrationRequests();

