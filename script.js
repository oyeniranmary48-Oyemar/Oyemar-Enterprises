// Bloom Café: mobile menu, menu filter, order tray and table reservation

// ----- Menu data -----
const menuItems = [
  { id: "espresso",   name: "Espresso",          category: "coffee", price: 1800, desc: "Rich, bold and short.",              icon: "\u2615" },
  { id: "cappuccino", name: "Cappuccino",        category: "coffee", price: 2500, desc: "Espresso with silky milk foam.",     icon: "\u2615" },
  { id: "latte",      name: "Iced Latte",        category: "coffee", price: 3000, desc: "Chilled, smooth and refreshing.",    icon: "\uD83E\uDD64" },
  { id: "zobo",       name: "Zobo Cooler",       category: "drinks", price: 1500, desc: "Chilled hibiscus with ginger.",      icon: "\uD83C\uDF39" },
  { id: "ginger",     name: "Ginger Lemon Tea",  category: "drinks", price: 1500, desc: "Warm, zesty and soothing.",          icon: "\uD83C\uDF75" },
  { id: "smoothie",   name: "Strawberry Smoothie", category: "drinks", price: 3200, desc: "Fresh strawberries and yoghurt.", icon: "\uD83C\uDF53" },
  { id: "avocado",    name: "Avocado Toast",     category: "food",   price: 4000, desc: "Sourdough, avocado and herbs.",      icon: "\uD83E\uDD51" },
  { id: "sandwich",   name: "Chicken Sandwich",  category: "food",   price: 4500, desc: "Grilled chicken with fresh salad.",  icon: "\uD83E\uDD6A" },
  { id: "jollof",     name: "Jollof Rice Bowl",  category: "food",   price: 5000, desc: "Smoky jollof with plantain.",        icon: "\uD83C\uDF5B" },
  { id: "croissant",  name: "Butter Croissant",  category: "pastry", price: 2000, desc: "Flaky and baked this morning.",      icon: "\uD83E\uDD50" },
  { id: "muffin",     name: "Blueberry Muffin",  category: "pastry", price: 1800, desc: "Soft, sweet and full of berries.",   icon: "\uD83E\uDDC1" },
  { id: "cake",       name: "Chocolate Cake",    category: "pastry", price: 3000, desc: "A rich slice for chocolate lovers.", icon: "\uD83C\uDF70" }
];

function money(amount) {
  return "\u20A6" + amount.toLocaleString("en-US");
}

// ----- Mobile navigation -----
const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");

navToggle.addEventListener("click", function () {
  const open = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

navList.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ----- Menu and filter -----
const menuGrid = document.getElementById("menu-grid");
const filterButtons = document.querySelectorAll(".filter");
let currentFilter = "all";

function renderMenu() {
  menuGrid.replaceChildren();

  menuItems
    .filter(function (item) {
      return currentFilter === "all" || item.category === currentFilter;
    })
    .forEach(function (item) {
      const card = document.createElement("article");
      card.className = "menu-item";

      const icon = document.createElement("div");
      icon.className = "item-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;

      const title = document.createElement("h3");
      title.textContent = item.name;

      const desc = document.createElement("p");
      desc.textContent = item.desc;

      const foot = document.createElement("div");
      foot.className = "item-foot";

      const price = document.createElement("span");
      price.className = "price";
      price.textContent = money(item.price);

      const add = document.createElement("button");
      add.type = "button";
      add.className = "add";
      add.dataset.id = item.id;
      add.textContent = "Add";
      add.setAttribute("aria-label", "Add " + item.name + " to your order");

      foot.append(price, add);
      card.append(icon, title, desc, foot);
      menuGrid.append(card);
    });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (other) {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderMenu();
  });
});

// ----- Order tray -----
const order = {};
const orderList = document.getElementById("order-list");
const orderEmpty = document.getElementById("order-empty");
const orderTotal = document.getElementById("order-total");
const orderCount = document.getElementById("order-count");
const orderMessage = document.getElementById("order-message");

function findItem(id) {
  return menuItems.find(function (item) { return item.id === id; });
}

function setOrderMessage(text, isError) {
  orderMessage.textContent = text;
  orderMessage.classList.toggle("error", Boolean(isError));
}

function renderOrder() {
  orderList.replaceChildren();
  let total = 0;
  let count = 0;

  Object.keys(order).forEach(function (id) {
    const item = findItem(id);
    const qty = order[id];
    total += item.price * qty;
    count += qty;

    const row = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "line-price";
    price.textContent = money(item.price * qty);

    const controls = document.createElement("span");
    controls.className = "qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.id = id;
    minus.dataset.change = "-1";
    minus.textContent = "\u2212";
    minus.setAttribute("aria-label", "Remove one " + item.name);

    const amount = document.createElement("span");
    amount.textContent = qty;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.id = id;
    plus.dataset.change = "1";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Add one more " + item.name);

    controls.append(minus, amount, plus);
    row.append(name, price, controls);
    orderList.append(row);
  });

  orderEmpty.hidden = count > 0;
  orderTotal.textContent = money(total);
  orderCount.textContent = count;
}

menuGrid.addEventListener("click", function (event) {
  const button = event.target.closest(".add");
  if (!button) return;
  const id = button.dataset.id;
  order[id] = (order[id] || 0) + 1;
  setOrderMessage("", false);
  renderOrder();
});

orderList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;
  order[id] += Number(button.dataset.change);
  if (order[id] <= 0) {
    delete order[id];
  }
  renderOrder();
});

document.getElementById("clear-order").addEventListener("click", function () {
  Object.keys(order).forEach(function (id) { delete order[id]; });
  setOrderMessage("", false);
  renderOrder();
});

document.getElementById("place-order").addEventListener("click", function () {
  const count = Object.keys(order).reduce(function (sum, id) { return sum + order[id]; }, 0);
  if (count === 0) {
    setOrderMessage("Your order is empty. Add something from the menu first.", true);
    return;
  }
  const total = orderTotal.textContent;
  Object.keys(order).forEach(function (id) { delete order[id]; });
  renderOrder();
  setOrderMessage("Thank you! Your order of " + count + (count === 1 ? " item" : " items") + " (" + total + ") has been received.", false);
});

// ----- Reservation form -----
const form = document.getElementById("reserve-form");
const success = document.getElementById("reserve-success");
const fields = {
  name: document.getElementById("r-name"),
  email: document.getElementById("r-email"),
  date: document.getElementById("r-date"),
  time: document.getElementById("r-time"),
  guests: document.getElementById("r-guests")
};

const now = new Date();
const todayText =
  now.getFullYear() + "-" +
  String(now.getMonth() + 1).padStart(2, "0") + "-" +
  String(now.getDate()).padStart(2, "0");
fields.date.min = todayText;

function check(key) {
  const value = fields[key].value.trim();

  if (key === "name") {
    if (value === "") return "Please enter your name.";
    if (!/^[\p{L}][\p{L}\s'.-]+$/u.test(value)) return "Use letters only, at least 2 characters.";
  }
  if (key === "email") {
    if (value === "") return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email, like name@example.com.";
  }
  if (key === "date") {
    if (value === "") return "Please choose a date.";
    if (value < todayText) return "The date cannot be in the past.";
  }
  if (key === "time") {
    if (value === "") return "Please choose a time.";
  }
  if (key === "guests") {
    if (value === "") return "Please enter the number of guests.";
    const count = Number(value);
    if (!Number.isInteger(count) || count < 1 || count > 10) return "Enter a whole number from 1 to 10.";
  }
  return "";
}

function showError(key, message) {
  document.getElementById("r-" + key + "-error").textContent = message;
  fields[key].classList.toggle("invalid", message !== "");
  fields[key].setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener("input", function () { showError(key, ""); });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  success.hidden = true;

  let firstInvalid = null;
  Object.keys(fields).forEach(function (key) {
    const message = check(key);
    showError(key, message);
    if (message !== "" && firstInvalid === null) firstInvalid = fields[key];
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const guests = Number(fields.guests.value);
  success.textContent =
    "Thank you, " + fields.name.value.trim() + "! We have a table for " + guests +
    (guests === 1 ? " guest" : " guests") + " on " + fields.date.value + " at " + fields.time.value +
    ". We will email " + fields.email.value.trim() + " to confirm.";
  success.hidden = false;
  form.reset();
  success.scrollIntoView({ behavior: "smooth", block: "center" });
});

renderMenu();
renderOrder();