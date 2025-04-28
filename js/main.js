// JavaScript for login and user authentication with localStorage

document.addEventListener('DOMContentLoaded', () => {
  const roleSelect = document.getElementById('role');
  const studentSelectContainer = document.getElementById('studentSelectContainer');
  const studentSelect = document.getElementById('studentSelect');
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  // Fixed accounts
  const adminAccount = { username: 'admin', password: 'p@ssw0rd' };
  const teacherAccount = { username: 'teacher', password: 'te@ch3r' };

  // Load student accounts from localStorage or initialize empty array
  function loadStudents() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    return students;
  }

  // Populate student select dropdown
  function populateStudentSelect() {
    const students = loadStudents();
    studentSelect.innerHTML = '';
    if (students.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No student accounts available';
      studentSelect.appendChild(option);
      studentSelect.disabled = true;
    } else {
      studentSelect.disabled = false;
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select student';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      studentSelect.appendChild(defaultOption);
      students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.username;
        option.textContent = student.username + ' (Grade ' + student.grade + ')';
        studentSelect.appendChild(option);
      });
    }
  }

  // Show or hide student select based on role
  roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'student') {
      studentSelectContainer.style.display = 'block';
      populateStudentSelect();
    } else {
      studentSelectContainer.style.display = 'none';
    }
    loginMessage.textContent = '';
  });

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = roleSelect.value;
    const password = document.getElementById('password').value.trim();

    if (!role) {
      loginMessage.textContent = 'Please select a role.';
      return;
    }

    if (role === 'admin') {
      if (password === adminAccount.password) {
        localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', username: 'admin' }));
        window.location.href = 'pages/admin-dashboard.html';
      } else {
        loginMessage.textContent = 'Incorrect password for Admin.';
      }
    } else if (role === 'teacher') {
      if (password === teacherAccount.password) {
        localStorage.setItem('currentUser', JSON.stringify({ role: 'teacher', username: 'teacher' }));
        window.location.href = 'pages/teacher-dashboard.html';
      } else {
        loginMessage.textContent = 'Incorrect password for Teacher.';
      }
    } else if (role === 'student') {
      const selectedStudent = studentSelect.value;
      if (!selectedStudent) {
        loginMessage.textContent = 'Please select a student account.';
        return;
      }
      const students = loadStudents();
      const student = students.find(s => s.username === selectedStudent);
      if (!student) {
        loginMessage.textContent = 'Selected student account not found.';
        return;
      }
      if (password === student.password) {
        localStorage.setItem('currentUser', JSON.stringify({ role: 'student', username: student.username }));
        window.location.href = 'pages/student-dashboard.html';
      } else {
        loginMessage.textContent = 'Incorrect password for Student.';
      }
    }
  });
});
