document.addEventListener("DOMContentLoaded", () => {
  const moods = [
    "Happy", "Sad", "Angry", "Tired", "Excited", "Calm", "Frustrated",
    "Anxious", "Content", "Bored", "Hopeful", "Stressed",
    "Relaxed", "Lonely", "Confident"
  ];

  const journalPrompts = {
    Happy: "What made you feel happy today?",
    Sad: "What caused your sadness? How can you feel better?",
    Angry: "What triggered your anger, and how could you calm down?",
    Tired: "Why are you feeling tired today? What can refresh you?",
    Excited: "What has made you excited? Describe the moment.",
    Calm: "What is keeping you calm today?",
    Frustrated: "What is frustrating you? How might you solve it?",
    Anxious: "What are you anxious about? Write down your feelings.",
    Content: "What contentment did you experience today?",
    Bored: "What bored you? Would you try something new?",
    Hopeful: "What gives you hope for tomorrow?",
    Stressed: "What is causing your stress, and how to relax?",
    Relaxed: "What helped you relax today?",
    Lonely: "What makes you feel lonely, and what can help?",
    Confident: "What boosted your confidence today?"
  };

  const moodGrid = document.querySelector(".mood-grid");
  const promptSection = document.querySelector(".prompt-section");
  const promptText = document.getElementById("prompt-text");
  const moodNote = document.getElementById("mood-note");
  const saveBtn = document.getElementById("saveMoodBtn");
  const moodHistoryEl = document.getElementById("mood-history");

  let selectedMood = null;

  // Create mood buttons
  moods.forEach(mood => {
    const btn = document.createElement("div");
    btn.textContent = mood;
    btn.classList.add("mood-btn");
    btn.addEventListener("click", () => selectMood(btn, mood));
    moodGrid.appendChild(btn);
  });

  // Load mood data from localStorage
  function loadMoodData() {
    return JSON.parse(localStorage.getItem("aurora_mood_user1")) || [];
  }

  // Save mood data to localStorage
  function saveMoodData(data) {
    localStorage.setItem("aurora_mood_user1", JSON.stringify(data));
  }

  // Handle mood selection
  function selectMood(btn, mood) {
    selectedMood = mood;
    // Remove previous selection highlight
    document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    // Show prompt and textarea
    promptText.textContent = journalPrompts[mood] || "";
    promptSection.style.display = "block";
    moodNote.value = "";
    moodNote.focus();
  }

  // Handle save
  saveBtn.addEventListener("click", () => {
    if (!selectedMood) return;
    const note = moodNote.value.trim();
    const date = new Date().toISOString().slice(0, 10);

    const moodsData = loadMoodData();
    moodsData.push({
      date,
      mood: selectedMood,
      note
    });
    saveMoodData(moodsData);

    // Reset UI
    selectedMood = null;
    document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
    promptSection.style.display = "none";
    moodNote.value = "";

    // Refresh history
    renderMoodHistory();
  });

  // Render recent mood entries (limit 10)
  function renderMoodHistory() {
    const moodsData = loadMoodData().slice(-10).reverse();
    moodHistoryEl.innerHTML = "";
    if (moodsData.length === 0) {
      moodHistoryEl.textContent = "No moods recorded yet.";
      return;
    }
    moodsData.forEach(entry => {
      const div = document.createElement("div");
      div.classList.add("entry");
      div.innerHTML = `<strong>${entry.date}</strong>: <em>${entry.mood}</em>${entry.note ? " — " + entry.note : ""}`;
      moodHistoryEl.appendChild(div);
    });
  }

  // Initial render
  renderMoodHistory();
});
