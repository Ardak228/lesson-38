// Той: список дел к празднику
// Результат — на странице и в консоли: F12 → Console
console.log("script.js подключен");

// ===== Шаг 1. Состояние =====
const state = {
  title: "Той Айгуль и Ерлана",
  date: "14 июня",
  guests: 120,
  tasks: [
    { id: 1, text: "Заказать зал", done: true },
    { id: 2, text: "Пригласить тамаду", done: false },
    { id: 3, text: "Купить шары", done: false },
  ],
  nextId: 4,
  filter: "all",
  query: "",
  buys: [
    { id: 1, text: "Торт", price: 45000 },
    { id: 2, text: "Шары", price: 12000 },
  ],
  nextBuyId: 3,
  sortByPrice: false,
};
document.querySelector(".party-title").textContent = state.title;
document.querySelector(".party-date").textContent = `Дата: ${state.date}`;
console.log(state);
console.log("Дел в состоянии:", state.tasks.length);

// ===== Шаг 2. render: список дел =====
const tasksList = document.querySelector(".tasks");
function renderTasks() {
  tasksList.replaceChildren();
  let shown = state.tasks;
  if (state.filter === "todo") {
    shown = shown.filter((t) => !t.done);
  } else if (state.filter === "done") {
    shown = shown.filter((t) => t.done);
  }
  shown = shown.filter((t) => t.text.toLowerCase().includes(state.query));
  shown.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.dataset.id = task.id;
    li.classList.toggle("done", task.done);
    tasksList.append(li);
  });
}
function render() {
  renderTasks();
  renderGuests();
  renderStats();
  renderChips();
  renderBuys();
}

// ===== Шаг 3. Событие → состояние → render: гости =====
const guestsNum = document.querySelector(".guests-num");
const guestsMinus = document.querySelector(".guests-minus");
function renderGuests() {
  guestsNum.textContent = state.guests;
  guestsMinus.disabled = state.guests <= 100;
}
document.querySelector(".guests-plus").addEventListener("click", () => {
  state.guests = state.guests + 10;
  render();
  console.log("Гостей:", state.guests);
});
guestsMinus.addEventListener("click", () => {
  state.guests = state.guests - 10;
  render();
  console.log("Гостей:", state.guests);
});

// ===== Шаг 4. Вычисляемые значения: итог =====
const stats = document.querySelector(".stats");
function renderStats() {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.done).length;
  stats.textContent = `Готово: ${done} из ${total}`;
  stats.classList.toggle("all-done", done === total);
}

// ===== Шаг 5. Добавление: новое дело =====
const taskForm = document.querySelector(".task-form");
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskForm.elements.text.value.trim();
  if (text === "") {
    return;
  }
  state.tasks.push({ id: state.nextId, text: text, done: false });
  state.nextId = state.nextId + 1;
  taskForm.reset();
  render();
  console.log("Добавили, nextId:", state.nextId);
});

// ===== Шаг 6. Изменить по id: отметить дело =====
tasksList.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) {
    return;
  }
  const id = Number(li.dataset.id);
  const task = state.tasks.find((t) => t.id === id);
  task.done = !task.done;
  render();
  console.log(task);
});

// ===== Шаг 7. Фильтр в состоянии =====
document.querySelector(".chips").addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) {
    return;
  }
  state.filter = chip.dataset.filter;
  render();
  console.log(`Фильтр ${state.filter}:`, tasksList.children.length);
});

// ===== Шаг 8. Поиск при вводе =====
const search = document.querySelector(".search");
search.addEventListener("input", () => {
  state.query = search.value.trim().toLowerCase();
  render();
  console.log(`[${state.query}] найдено:`, tasksList.children.length);
});

// ===== Шаг 9. Ошибки исправлены =====
const chips = document.querySelectorAll(".chip");
function renderChips() {
  chips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === state.filter);
  });
}
document.querySelector(".clear-done").addEventListener("click", () => {
  state.tasks = state.tasks.filter((t) => !t.done);
  render();
  console.log("Осталось дел:", state.tasks.length);
});

// ===== Общая практика. Покупки =====
const buysList = document.querySelector(".buys");
const buysTotal = document.querySelector(".buys-total");
const buyForm = document.querySelector(".buy-form");
function renderBuys() {
  buysList.replaceChildren();
  let sum = 0;
  const shown = state.buys.slice();
  if (state.sortByPrice) {
    shown.sort((x, y) => y.price - x.price);
  }
  shown.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = `${b.text} — ${b.price} ₸`;
    const del = document.createElement("button");
    del.className = "remove";
    del.textContent = "×";
    del.dataset.id = b.id;
    li.append(del);
    buysList.append(li);
    sum = sum + b.price;
  });
  buysTotal.textContent = `Итого: ${sum} ₸`;
}
buyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = buyForm.elements.text.value.trim();
  const price = Number(buyForm.elements.price.value);
  if (text === "" || Number.isNaN(price) || price <= 0) {
    return;
  }
  state.buys.push({ id: state.nextBuyId, text: text, price: price });
  state.nextBuyId = state.nextBuyId + 1;
  buyForm.reset();
  render();
  console.log("Покупок:", state.buys.length, "|", buysTotal.textContent);
});
buysList.addEventListener("click", (event) => {
  const del = event.target.closest(".remove");
  if (!del) {
    return;
  }
  const id = Number(del.dataset.id);
  state.buys = state.buys.filter((b) => b.id !== id);
  render();
  console.log("Удалили, осталось:", state.buys.length);
});

// ===== Бонус. Сначала дорогие =====
const buysSort = document.querySelector(".buys-sort");
buysSort.addEventListener("change", () => {
  state.sortByPrice = buysSort.checked;
  render();
  console.log("Сначала дорогие:", state.sortByPrice);
});

const themeBtn = document.querySelector(".theme-btn");
let theme = localStorage.getItem("toi-theme");

function showTheme() {
  const night = theme === "night";
  document.body.classList.toggle("night", night);
  themeBtn.textContent = night ? "Дневная тема" : "Ночная тема";
}

themeBtn.addEventListener("click", () => {
  theme = theme === "night" ? "day" : "night";

  localStorage.setItem("toi-theme", theme);
  showTheme();
  console.log("Тема:", theme);
});

console.log("Тема при загрузке:", theme);

const savedVisits = localStorage.getItem("toi-visits");
const visits = Number(savedVisits) + 1;
localStorage.setItem("toi-visits", visits);
// ✎ в .visits — «Открытий: ...» из visits
console.log("Из хранилища:", savedVisits, "| открытий:", visits);

// ===== Запуск =====
render();
console.log("Пунктов в списке:", tasksList.children.length);
console.log(stats.textContent);
