document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('calendarGrid');
  const popup = document.getElementById('journalPopup');
  const popupTitle = document.getElementById('popupTitle');
  const popupEntry = document.getElementById('popupEntry');
  const popupSave = document.getElementById('popupSave');
  const popupClose = document.getElementById('popupClose');
  const journalList = document.getElementById('journalList');

  let journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '{}');
  const todayDate = new Date();

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function buildCalendar() {
    grid.innerHTML = '';
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
  
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
  
    // blank days for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('calendar-cell');
      grid.appendChild(emptyCell);
    }
  
    // date cells
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.classList.add('calendar-cell');
      const dateISO = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      cell.textContent = day;
      if (journalEntries[dateISO]) cell.classList.add('has-entry');
      if (dateISO === formatDate(todayDate)) cell.classList.add('today');
      
      cell.onclick = () => openPopup(dateISO);
      grid.appendChild(cell);
    }
  }

  function openPopup(dateISO) {
    popupTitle.textContent = `Journal for ${dateISO}`;
    popupEntry.value = journalEntries[dateISO] || '';
    popup.dataset.date = dateISO;
    popup.style.display = 'block';
    popupEntry.focus();
  }

  popupSave.addEventListener('click', () => {
    const dateISO = popup.dataset.date;
    const text = popupEntry.value.trim();

    if (text.length > 0) {
      journalEntries[dateISO] = text;
    } else {
      delete journalEntries[dateISO];
    }
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    popup.style.display = 'none';
    buildCalendar();
    renderJournalList();
  });

  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  function renderJournalList() {
    journalList.innerHTML = '';
    const sortedDates = Object.keys(journalEntries).sort().reverse();
    if (sortedDates.length === 0) {
      journalList.textContent = 'No journal entries yet.';
      return;
    }
    sortedDates.forEach(dateISO => {
      const div = document.createElement('div');
      div.textContent = `${dateISO}: ${journalEntries[dateISO].slice(0, 120)}${journalEntries[dateISO].length > 120 ? '...' : ''}`;
      div.onclick = () => openPopup(dateISO);
      journalList.appendChild(div);
    });
  }

  buildCalendar();
  renderJournalList();
});
