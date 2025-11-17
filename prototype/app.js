const themeSelect = document.querySelector("#theme-select");
const appRoot = document.querySelector(".app");
const decorGrid = document.querySelector("#decor-grid");
const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const finishBtn = document.querySelector(".finish-btn");
const finishMsg = document.querySelector("#finish-msg");
const stickerCanvas = document.querySelector("#sticker-canvas");

const themes = {
  "pilates-princess": {
    decor: [
      { icon: "🍓", label: "Strawberry notes" },
      { icon: "🧘‍♀️", label: "Stretch tracker" },
      { icon: "💗", label: "Soft hearts" },
      { icon: "📎", label: "Rose clips" },
      { icon: "🩰", label: "Ballet tabs" },
      { icon: "🌸", label: "Sakura tape" },
      { icon: "🧴", label: "Glow serum" },
      { icon: "🫧", label: "Bubble dividers" },
    ],
  },
  "matcha-village": {
    decor: [
      { icon: "🍵", label: "Matcha mug" },
      { icon: "🌿", label: "Leaf corners" },
      { icon: "🏮", label: "Paper lantern" },
      { icon: "🥠", label: "Fortune stickers" },
      { icon: "🍡", label: "Dango dots" },
      { icon: "📜", label: "Haiku scroll" },
      { icon: "🪴", label: "Moss buddy" },
      { icon: "🎋", label: "Tanabata ribbon" },
    ],
  },
  "beach-episode": {
    decor: [
      { icon: "🍍", label: "Pineapple memo" },
      { icon: "🌊", label: "Wave dividers" },
      { icon: "🐚", label: "Shell stickers" },
      { icon: "🩴", label: "Flip-flop tabs" },
      { icon: "🍧", label: "Shaved ice tag" },
      { icon: "🪸", label: "Coral corners" },
      { icon: "🌺", label: "Hibiscus spark" },
      { icon: "🫧", label: "Seafoam bubbles" },
    ],
  },
  "dexter-lab": {
    decor: [
      { icon: "🩸", label: "Blood droplets" },
      { icon: "🔪", label: "Knife tabs" },
      { icon: "🧬", label: "DNA ribbon" },
      { icon: "🪞", label: "Mirror shard" },
      { icon: "🕯️", label: "Candle ritual" },
      { icon: "🩻", label: "Scan overlay" },
      { icon: "🧪", label: "Lab vial" },
      { icon: "🌙", label: "Moon sigil" },
    ],
  },
};

const deckState = {};

let tasks = [
  { id: crypto.randomUUID(), text: "Morning pilates flow", done: false },
  { id: crypto.randomUUID(), text: "Matcha latte & journaling", done: true },
];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.done ? "task--done" : ""}`;
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} data-action="toggle" data-id="${task.id}" />
      <p class="task__text">${task.text}</p>
      <button data-action="remove" data-id="${task.id}" aria-label="Удалить задачу">✕</button>
    `;
    taskList.appendChild(li);
  });
}

function renderDecor(theme) {
  decorGrid.innerHTML = "";
  const pool = themes[theme].decor;
  if (!deckState[theme]) deckState[theme] = 0;
  const start = deckState[theme];
  const visibleCount = Math.min(6, pool.length);

  for (let i = 0; i < visibleCount; i++) {
    const idx = (start + i) % pool.length;
    const card = pool[idx];
    const div = document.createElement("div");
    div.className = "decor-card";
    div.draggable = true;
    div.dataset.icon = card.icon;
    div.dataset.label = card.label;
    div.innerHTML = `<span>${card.icon}</span><p>${card.label}</p>`;
    div.addEventListener("dragstart", handleDecorDragStart);
    decorGrid.appendChild(div);
  }
}

function setTheme(theme) {
  appRoot.dataset.theme = theme;
  deckState[theme] = 0;
  renderDecor(theme);
}

function updateStickerPlaceholder() {
  const hasStickers = stickerCanvas.querySelectorAll(".sticker").length > 0;
  stickerCanvas.classList.toggle("has-stickers", hasStickers);
}

function handleDecorDragStart(event) {
  const { icon, label } = event.currentTarget.dataset;
  event.dataTransfer.setData(
    "application/json",
    JSON.stringify({ icon, label })
  );
  event.dataTransfer.effectAllowed = "copy";
}

function handleStickerDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("application/json");
  if (!data) return;

  const { icon, label } = JSON.parse(data);
  const rect = stickerCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const sticker = document.createElement("button");
  sticker.type = "button";
  sticker.className = "sticker";
  sticker.style.left = `${x - 32}px`;
  sticker.style.top = `${y - 32}px`;
  sticker.innerHTML = `<span>${icon}</span>`;
  sticker.title = label;
  sticker.addEventListener("click", () => {
    sticker.remove();
    updateStickerPlaceholder();
  });

  stickerCanvas.appendChild(sticker);
  updateStickerPlaceholder();
  deckState[themeSelect.value] = (deckState[themeSelect.value] || 0) + 1;
  renderDecor(themeSelect.value);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  tasks = [{ id: crypto.randomUUID(), text: value, done: false }, ...tasks];
  taskInput.value = "";
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  const taskId = target.dataset.id;
  if (!action || !taskId) return;

  if (action === "toggle") {
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
  }

  if (action === "remove") {
    tasks = tasks.filter((task) => task.id !== taskId);
  }

  renderTasks();
});

finishBtn.addEventListener("click", () => {
  finishMsg.classList.add("visible");
  setTimeout(() => finishMsg.classList.remove("visible"), 2000);
});

themeSelect.addEventListener("change", (event) => {
  setTheme(event.target.value);
});

stickerCanvas.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

stickerCanvas.addEventListener("drop", handleStickerDrop);

// Initial render
setTheme(themeSelect.value);
renderTasks();
updateStickerPlaceholder();

