// Always restore theme on page load
(function restoreTheme() {
  const savedTheme = localStorage.getItem("theme") || "light-theme";
  document.body.className = savedTheme;
})();


document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login.html if not logged in
  const user = JSON.parse(localStorage.getItem('user'));
  const currentPage = window.location.pathname.split('/').pop();

  // Pages allowed without login
  const publicPages = ['login.html', 'signup.html'];

  if (!user && !publicPages.includes(currentPage)) {
    window.location.href = 'login.html';
  }

  // Highlight sidebar active link based on current page
  const sidebarLinks = document.querySelectorAll('.sidebar-nav li a');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.parentElement.classList.add('active');
    } else {
      link.parentElement.classList.remove('active');
    }
  });

  // Display user's initial in profile bubble if exists
  const profileBubble = document.querySelector('.profile-bubble');
  if (user && profileBubble) {
    if (user.name && user.name.length > 0) {
      profileBubble.textContent = user.name.charAt(0).toUpperCase();
    } else if (user.email) {
      profileBubble.textContent = user.email.charAt(0).toUpperCase();
    } else {
      profileBubble.textContent = 'U';
    }
  }

  // Optional: Add logout handler if needed
  const logoutLink = document.querySelector('.sidebar-nav li a[href="logout.html"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }
});
