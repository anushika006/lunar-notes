// auth.js - handles login and signup

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('loginForm')) return;

  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      errorDiv.textContent = 'Please fill in all fields.';
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '{}');

    if (!users[email]) {
      errorDiv.textContent = 'User not found. Please sign up.';
      return;
    }

    if (users[email].password !== password) {
      errorDiv.textContent = 'Incorrect password.';
      return;
    }

    // Save logged-in user data
    localStorage.setItem('user', JSON.stringify(users[email]));

    // Redirect to dashboard
    window.location.href = 'index.html';
  });
});
// Signup handling
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('signupForm')) return;

  const form = document.getElementById('signupForm');
  const errorDiv = document.getElementById('signupError');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      errorDiv.textContent = 'Please fill in all fields.';
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
      errorDiv.textContent = 'Email already registered. Please login.';
      return;
    }

    // Save new user
    users[email] = { name, email, password };
    localStorage.setItem('users', JSON.stringify(users));

    // Automatically login
    localStorage.setItem('user', JSON.stringify(users[email]));

    // Redirect to dashboard
    window.location.href = 'index.html';
  });
});
