const themeSelect = document.querySelector("#theme-select");
const appRoot = document.querySelector(".app");
const decorGrid = document.querySelector("#decor-grid");
const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const finishBtn = document.querySelector(".finish-btn");
const finishMsg = document.querySelector("#finish-msg");

const themes = {
  "pilates-princess": {
    decor: [
      { icon: "🍓", label: "Strawberry notes" },
      { icon: "🧘‍♀️", label: "Stretch tracker" },
      { icon: "💗", label: "Soft hearts" },
      { icon: "📎", label: "Rose clips" },
    ],
  },
  "matcha-village": {
    decor: [
      { icon: "🍵", label: "Matcha mug" },
      { icon: "🌿", label: "Leaf corners" },
      { icon: "🏮", label: "Paper lantern" },
      { icon: "🥠", label: "Fortune stickers" },
    ],
  },
  "beach-episode": {
    decor: [
      { icon: "🍍", label: "Pineapple memo" },
      { icon: "🌊", label: "Wave dividers" },
      { icon: "🐚", label: "Shell stickers" },
      { icon: "🩴", label: "Flip-flop tabs" },
    ],
  },
};

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
  themes[theme].decor.forEach((card) => {
    const div = document.createElement("div");
    div.className = "decor-card";
    div.innerHTML = `<span>${card.icon}</span><p>${card.label}</p>`;
    decorGrid.appendChild(div);
  });
}

function setTheme(theme) {
  appRoot.dataset.theme = theme;
  renderDecor(theme);
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

// Initial render
setTheme(themeSelect.value);
renderTasks();

