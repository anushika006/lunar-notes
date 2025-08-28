document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gratitudeForm');
  const inputs = [...document.querySelectorAll('.gratitude-input')];
  const timeline = document.getElementById('gratitudeTimeline');

  const STORAGE_KEY = 'aurora_gratitude';

  function loadGratitude() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveGratitude(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function renderTimeline() {
    const entries = loadGratitude().slice(-15).reverse();
    timeline.innerHTML = '';

    if (entries.length === 0) {
      timeline.textContent = 'No gratitude entries yet.';
      return;
    }

    entries.forEach(entry => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${entry.date}:</strong> <ul>${entry.items
        .map(item => `<li>${item}</li>`).join('')}</ul>`;
      timeline.appendChild(div);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (inputs.some(input => input.value.trim() === '')) {
      alert('Please fill in all three gratitude items.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const gratitudeEntry = {
      date: today,
      items: inputs.map(input => input.value.trim())
    };

    const allEntries = loadGratitude();
    allEntries.push(gratitudeEntry);
    saveGratitude(allEntries);

    inputs.forEach(input => input.value = '');
    renderTimeline();
  });

  renderTimeline();
});
