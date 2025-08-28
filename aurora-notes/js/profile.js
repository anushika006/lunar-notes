document.addEventListener('DOMContentLoaded', () => {
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const newPasswordInput = document.getElementById('newPassword');
  const saveBtn = document.getElementById('saveProfileBtn');
  const messageDiv = document.getElementById('profileMessage');
  const profileInitials = document.getElementById('profileInitials');

  // Load logged-in user data
  let user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
    return;
  }

  // Initialize form fields
  userNameInput.value = user.name || '';
  userEmailInput.value = user.email || '';

  // Set profile bubble initials (first letter)
  profileInitials.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  saveBtn.addEventListener('click', e => {
    e.preventDefault();
    const newName = userNameInput.value.trim();
    const newEmail = userEmailInput.value.trim();

    if (!newName || !newEmail) {
      messageDiv.textContent = 'Name and Email cannot be empty.';
      return;
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      messageDiv.textContent = 'Invalid email format.';
      return;
    }

    const newPassword = newPasswordInput.value;

    let users = JSON.parse(localStorage.getItem('users') || '{}');

    // Check if new email is different and already taken
    if (newEmail !== user.email && users[newEmail]) {
      messageDiv.textContent = 'This email is already registered.';
      return;
    }

    // Update user data
    delete users[user.email]; // Remove old email key if changed
    users[newEmail] = {
      name: newName,
      email: newEmail,
      password: newPassword ? newPassword : user.password,
    };
    localStorage.setItem('users', JSON.stringify(users));

    // Update logged-in user
    user = users[newEmail];
    localStorage.setItem('user', JSON.stringify(user));

    // Update profile bubble
    profileInitials.textContent = newName.charAt(0).toUpperCase();

    messageDiv.textContent = 'Profile updated successfully.';
    newPasswordInput.value = '';
  });
});
