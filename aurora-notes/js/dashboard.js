document.addEventListener('DOMContentLoaded', () => {
  const dailyNote = document.getElementById('dailyNote');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const recentEntriesContainer = document.getElementById('recentEntries');
  const totalEntriesElem = document.getElementById('totalEntries');
  const writingStreakElem = document.getElementById('writingStreak');
  const dailyMotivation = document.getElementById('dailyMotivation');

  // Modal Elements
  const modal = document.getElementById('settingsModal');
  const settingsIcon = document.querySelector('.settings-icon');
  const closeSettings = document.getElementById('closeSettings');
  const resetBtn = document.getElementById('resetBtn');

  // Use localStorage key 'aurora_notes' to store daily notes in { 'YYYY-MM-DD': 'note' }
  const STORAGE_KEY = 'aurora_notes';

  function getStoredNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }

  function saveStoredNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  // Calculate max streak of consecutive days writing notes up to today
  function calculateStreak(notes) {
    const dates = Object.keys(notes).sort((a, b) => b.localeCompare(a));
    if (dates.length === 0) return 0;
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      if (notes[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  // Show recent 3 entries
  function renderRecentEntries(notes) {
    const dates = Object.keys(notes).sort((a, b) => b.localeCompare(a)).slice(0, 3);
    if (dates.length === 0) {
      recentEntriesContainer.textContent = 'Welcome! Start your first entry.';
      return;
    }
    recentEntriesContainer.innerHTML = '';
    dates.forEach(date => {
      const noteText = notes[date].length > 130 ? notes[date].slice(0, 130) + '...' : notes[date];
      const div = document.createElement('div');
      div.classList.add('recent-entry');
      div.textContent = `${date}: ${noteText}`;
      recentEntriesContainer.appendChild(div);
    });
  }

  // Load initial dashboard state
  function loadDashboard() {
    const notes = getStoredNotes();
    renderRecentEntries(notes);
    totalEntriesElem.textContent = Object.keys(notes).length;
    writingStreakElem.textContent = calculateStreak(notes);

    // Load today's note if exists
    const today = new Date().toISOString().slice(0, 10);
    if (notes[today]) {
      dailyNote.value = notes[today];
    } else {
      dailyNote.value = '';
    }

    // Set motivation message
    dailyMotivation.textContent = `"${getMotivation()}"`;
  }

  function getMotivation() {
    const messages = [
      "Keep going, you're doing great!",
      "Every day is a new chance to grow.",
      "Small steps get you closer to your dreams.",
      "Your thoughts are valuable — express them!",
      "Reflecting helps you evolve and thrive."
    ];
    const idx = new Date().getDate() % messages.length;
    return messages[idx];
  }

  // Save note button event
  saveNoteBtn.addEventListener('click', () => {
    const text = dailyNote.value.trim();
    if (text === '') {
      alert('Please enter a note before saving.');
      return;
    }
    const notes = getStoredNotes();
    const today = new Date().toISOString().slice(0, 10);
    notes[today] = text;
    saveStoredNotes(notes);
    loadDashboard();
    alert('Your note has been saved!');
  });

  // Modal open settings
  settingsIcon.addEventListener('click', (e) => {
    e.preventDefault(); // prevent navigation
    modal.style.display = 'flex';
  });

  // Close modal on 'x'
  closeSettings.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal on outside click
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Reset all data button
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data?')) {
      localStorage.clear();
      location.reload();
    }
  });

  loadDashboard();
});
