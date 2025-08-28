document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dreamsForm');
  const dreamsInput = document.getElementById('dreamsInput');
  const timeline = document.getElementById('dreamsTimeline');

  const STORAGE_KEY = 'aurora_dreams';

  function loadDreams() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveDreams(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function renderTimeline() {
    const dreams = loadDreams().slice(-15).reverse();
    timeline.innerHTML = '';

    if (dreams.length === 0) {
      timeline.textContent = 'No dreams or reflections logged yet.';
      return;
    }

    dreams.forEach(dream => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<strong>${dream.date}</strong><br>${dream.text}`;
      timeline.appendChild(div);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (dreamsInput.value.trim() === '') {
      alert('Please write something to save.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const dreamEntry = {
      date: today,
      text: dreamsInput.value.trim()
    };

    const allDreams = loadDreams();
    allDreams.push(dreamEntry);
    saveDreams(allDreams);

    dreamsInput.value = '';
    renderTimeline();
  });

  renderTimeline();
});
