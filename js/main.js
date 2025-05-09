// JavaScript for login and user authentication with localStorage

document.addEventListener('DOMContentLoaded', () => {
  const roleSelect = document.getElementById('role');
  const studentSelectContainer = document.getElementById('studentSelectContainer');
  const studentSelect = document.getElementById('studentSelect');
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  // Load teacher password from localStorage or use default
  function getTeacherPassword() {
    return localStorage.getItem('teacherPassword') || 'te@ch3r';
  }

  function setTeacherPassword(newPassword) {
    localStorage.setItem('teacherPassword', newPassword);
  }

  // Fixed accounts
  const adminAccount = { username: 'admin', password: 'p@ssw0rd' };

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
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show loader
  
    const role = roleSelect.value;
    const password = document.getElementById('password').value.trim();
  
    if (!role) {
      loginMessage.textContent = 'Please select a role.';
      loader.style.display = 'none';
      return;
    }
  
    setTimeout(() => {  // Simulate delay, replace with actual async if needed
      if (role === 'admin') {
        if (password === adminAccount.password) {
          localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', username: 'admin' }));
          window.location.href = 'pages/admin-dashboard.html';
        } else {
          loginMessage.textContent = 'Incorrect password for Admin.';
          loader.style.display = 'none';
        }
      } else if (role === 'teacher') {
        if (password === getTeacherPassword()) {
          localStorage.setItem('currentUser', JSON.stringify({ role: 'teacher', username: 'teacher' }));
          window.location.href = 'pages/teacher-dashboard.html';
        } else {
          loginMessage.textContent = 'Incorrect password for Teacher.';
          loader.style.display = 'none';
        }
      } else if (role === 'student') {
        const selectedStudent = studentSelect.value;
        if (!selectedStudent) {
          loginMessage.textContent = 'Please select a student account.';
          loader.style.display = 'none';
          return;
        }
  
        const students = loadStudents();
        const student = students.find(s => s.username === selectedStudent);
        if (!student) {
          loginMessage.textContent = 'Selected student account not found.';
          loader.style.display = 'none';
          return;
        }
  
          if (password === student.password) {
          // Update lastLogin timestamp
          const students = loadStudents();
          const studentIndex = students.findIndex(s => s.username === selectedStudent);
          if (studentIndex !== -1) {
            students[studentIndex].lastLogin = new Date().toISOString();
            localStorage.setItem('students', JSON.stringify(students));
          }
          localStorage.setItem('currentUser', JSON.stringify({ role: 'student', username: student.username, name: student.name || student.username, grade: student.grade }));
          window.location.href = 'pages/new-dashboard.html';
        } else {
          loginMessage.textContent = 'Incorrect password for Student.';
          loader.style.display = 'none';
        }
      }
    }, 500); // Optional delay for showing the loader animation
  });
});
