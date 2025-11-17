const themeSelect = document.querySelector("#theme-select");
const appRoot = document.querySelector(".app");
const decorGrid = document.querySelector("#decor-grid");
const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const finishBtn = document.querySelector(".finish-btn");
const finishMsg = document.querySelector("#finish-msg");
const stickerCanvas = document.querySelector("#sticker-canvas");
const body = document.body;
const VISIBLE_DECOR_CARDS = 6;

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
      { icon: "🪞", label: "Mirror charm" },
      { icon: "🪩", label: "Disco gloss" },
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
      { icon: "🧺", label: "Bamboo basket" },
      { icon: "🍃", label: "Tea steam" },
      { icon: "⛩️", label: "Torii gate" },
      { icon: "🎎", label: "Hina dolls" },
      { icon: "🥢", label: "Chopsticks" },
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
      { icon: "🕶️", label: "Sunset shades" },
      { icon: "🧉", label: "Coconut sip" },
    ],
  },
  "dexter-lab": {
    decor: [
      { icon: "🩸", label: "Blood droplets" },
      { icon: "🔪", label: "Knife tabs" },
      { icon: "🧬", label: "DNA ribbon" },
      { icon: "🧪", label: "Lab vial" },
      { icon: "🌙", label: "Moon sigil" },
      { icon: "🕷️", label: "Shadow spider" },
      { icon: "🩹", label: "Silver tape" },
      { icon: "⛵", label: "Night boat" },
      { icon: "🌴", label: "Miami palm" },
    ],
  },
};

const deckState = {};

let tasks = [];

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

function getNextDecor(theme) {
  const pool = themes[theme].decor;
  if (!deckState[theme]) deckState[theme] = 0;
  const data = pool[deckState[theme] % pool.length];
  deckState[theme] = (deckState[theme] + 1) % pool.length;
  return data;
}

function createDecorCard(theme, slot) {
  const card = getNextDecor(theme);
  const div = document.createElement("div");
  div.className = "decor-card";
  div.draggable = true;
  div.dataset.icon = card.icon;
  div.dataset.label = card.label;
  div.dataset.slot = slot;
  div.innerHTML = `<span>${card.icon}</span><p>${card.label}</p>`;
  div.addEventListener("dragstart", handleDecorDragStart);
  return div;
}

function renderDecor(theme) {
  decorGrid.innerHTML = "";
  for (let slot = 0; slot < VISIBLE_DECOR_CARDS; slot += 1) {
    decorGrid.appendChild(createDecorCard(theme, slot));
  }
}

function replaceDecorCard(theme, slot) {
  const target = decorGrid.querySelector(`[data-slot="${slot}"]`);
  if (!target) {
    return;
  }
  const replacement = createDecorCard(theme, slot);
  target.replaceWith(replacement);
}

function setTheme(theme) {
  appRoot.dataset.theme = theme;
  body.dataset.theme = theme;
  deckState[theme] = 0;
  renderDecor(theme);
  resetStickerCanvas();
  updateStickerPlaceholder();
}

function updateStickerPlaceholder() {
  const hasStickers = stickerCanvas.querySelectorAll(".sticker").length > 0;
  stickerCanvas.classList.toggle("has-stickers", hasStickers);
}

function handleDecorDragStart(event) {
  const { icon, label, slot } = event.currentTarget.dataset;
  event.dataTransfer.setData(
    "application/json",
    JSON.stringify({ icon, label, slot })
  );
  event.dataTransfer.effectAllowed = "copy";
}

function handleStickerDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("application/json");
  if (!data) return;

  const { icon, label, slot } = JSON.parse(data);
  const rect = stickerCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const sticker = document.createElement("button");
  sticker.type = "button";
  sticker.className = "sticker";
  sticker.style.left = `${x - 90}px`;
  sticker.style.top = `${y - 90}px`;
  sticker.innerHTML = `<span>${icon}</span>`;
  sticker.title = label;
  sticker.addEventListener("click", () => {
    sticker.remove();
    updateStickerPlaceholder();
  });

  stickerCanvas.appendChild(sticker);
  updateStickerPlaceholder();
  if (typeof slot !== "undefined") {
    replaceDecorCard(themeSelect.value, Number(slot));
  }
}

function resetStickerCanvas() {
  stickerCanvas.innerHTML = "";
  const placeholder = document.createElement("p");
  placeholder.className = "sticker-placeholder";
  placeholder.textContent = "Перетащи милые стикеры сюда";
  stickerCanvas.appendChild(placeholder);
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
  launchStickerCelebration();
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

function launchStickerCelebration() {
  const stickerIcons = Array.from(
    stickerCanvas.querySelectorAll(".sticker span")
  ).map((node) => node.textContent);
  if (!stickerIcons.length) return;

  const overlay = document.createElement("div");
  overlay.className = "sticker-overlay";

  const totalItems = Math.max(18, stickerIcons.length * 4);
  for (let i = 0; i < totalItems; i += 1) {
    const item = document.createElement("div");
    item.className = "sticker-overlay__item";
    item.textContent = stickerIcons[i % stickerIcons.length];
    const delay = i * 0.08;
    item.style.setProperty("--delay", `${delay}s`);
    item.style.left = `${Math.random() * 100}%`;
    item.style.top = `${Math.random() * 100}%`;
    overlay.appendChild(item);
  }

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("visible"));
  setTimeout(() => {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.remove(), 600);
  }, 5000);
}

