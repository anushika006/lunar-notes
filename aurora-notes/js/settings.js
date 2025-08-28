document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme');
  const notificationsCheckbox = document.getElementById('notifications');
  const resetBtn = document.getElementById('resetBtn');

  // Load saved settings from localStorage or defaults
  const savedTheme = localStorage.getItem('aurora_theme') || 'light';
  themeSelect.value = savedTheme;
  document.body.className = savedTheme;

  themeSelect.addEventListener('change', () => {
    const selected = themeSelect.value;
    document.body.className = selected;
    localStorage.setItem('aurora_theme', selected);
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data?')) {
      localStorage.clear();
      location.reload();
    }
  });
});
