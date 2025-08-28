document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('moodChart').getContext('2d');
  const moods = JSON.parse(localStorage.getItem('aurora_mood_user1')) || [];

  // Aggregate mood counts by date and mood type
  const moodCounts = {};
  moods.forEach(({ date, mood }) => {
    if (!moodCounts[date]) {
      moodCounts[date] = {};
    }
    moodCounts[date][mood] = (moodCounts[date][mood] || 0) + 1;
  });

  // Prepare last 15 days labels
  const dates = [];
  const todayTs = new Date().getTime();
  for (let i = 14; i >= 0; i--) {
    const dt = new Date(todayTs - i * 86400000);
    dates.push(dt.toISOString().slice(0, 10));
  }

  const moodTypes = [
    "Happy","Sad","Angry","Tired","Excited","Calm",
    "Frustrated","Anxious","Content","Bored","Hopeful",
    "Stressed","Relaxed","Lonely","Confident"
  ];

  // Generate datasets for Chart.js
  const datasets = moodTypes.map(type => ({
    label: type,
    data: dates.map(date => (moodCounts[date] && moodCounts[date][type]) || 0),
    fill: false,
    borderColor: getColorFromString(type),
    tension: 0.2,
    pointRadius: 2,
  }));

  // Simple hash-based color selection
  function getColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;
    return `rgba(${r},${g},${b},0.7)`;
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 10 } }
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 90, minRotation: 45 }
        },
        y: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    }
  });

  // Gratitude timeline analysis
  const gratitudeDiv = document.getElementById('gratitudeAnalysis');
  const gratitudes = JSON.parse(localStorage.getItem('aurora_gratitude')) || [];

  if (gratitudes.length === 0) {
    gratitudeDiv.textContent = "No gratitude entries to analyze.";
  } else {
    gratitudeDiv.innerHTML = '';
    gratitudes.slice(-15).reverse().forEach(entry => {
      const div = document.createElement('div');
      div.textContent = `${entry.date}: ${entry.items.join(', ')}`;
      gratitudeDiv.appendChild(div);
    });
  }
});
