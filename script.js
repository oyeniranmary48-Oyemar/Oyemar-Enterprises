// Oyemar Enterprises: mobile menu and service request form

// Your WhatsApp number: country code first, no + sign, no spaces
const WHATSAPP_NUMBER = "2347035093978";

// Every "wa-link" link opens a WhatsApp chat with your number
document.querySelectorAll(".wa-link").forEach(function (link) {
  link.href = "https://wa.me/" + 2347035093978;
  link.target = "_blank";
  link.rel = "noopener";
});

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

// ----- Service request form -----
const form = document.getElementById("request-form");
const summary = document.getElementById("summary");
const summaryText = document.getElementById("summary-text");
const sendLink = document.getElementById("send-link");
const networkField = document.getElementById("network-field");
const phoneLabel = document.getElementById("phone-label");

const fields = {
  name: document.getElementById("f-name"),
  service: document.getElementById("f-service"),
  network: document.getElementById("f-network"),
  phone: document.getElementById("f-phone"),
  amount: document.getElementById("f-amount")
};
const details = document.getElementById("f-details");

const serviceNames = {
  pos: "POS banking",
  airtime: "Airtime top-up",
  data: "Data subscription"
};

// Show the network box only for airtime and data
fields.service.addEventListener("change", function () {
  const service = fields.service.value;
  const needsNetwork = service === "airtime" || service === "data";
  networkField.hidden = !needsNetwork;
  if (!needsNetwork) {
    fields.network.value = "";
    showError("network", "");
  }

  if (service === "airtime") phoneLabel.textContent = "Phone number to receive airtime";
  else if (service === "data") phoneLabel.textContent = "Phone number to receive data";
  else phoneLabel.textContent = "Phone number";
});

function check(key) {
  const value = fields[key].value.trim();

  if (key === "name") {
    if (value === "") return "Please enter your name.";
    if (!/^[\p{L}][\p{L}\s'.-]+$/u.test(value)) return "Use letters only, at least 2 characters.";
  }

  if (key === "service") {
    if (value === "") return "Please choose a service.";
  }

  if (key === "network") {
    const service = fields.service.value;
    if ((service === "airtime" || service === "data") && value === "") {
      return "Please choose a network.";
    }
  }

  if (key === "phone") {
    if (value === "") return "Please enter a phone number.";
    let digits = value.replace(/[\s()+-]/g, "");
    if (digits.startsWith("234") && digits.length === 13) {
      digits = "0" + digits.slice(3);
    }
    if (!/^0[789][01]\d{8}$/.test(digits)) {
      return "Enter a valid Nigerian number, like 08031234567.";
    }
  }

  if (key === "amount") {
    if (value === "") return "Please enter the amount.";
    const amount = Number(value);
    if (!Number.isInteger(amount) || amount < 50 || amount > 500000) {
      return "Enter a whole amount from \u20A650 to \u20A6500,000.";
    }
  }

  return "";
}

function showError(key, message) {
  document.getElementById("f-" + key + "-error").textContent = message;
  fields[key].classList.toggle("invalid", message !== "");
  fields[key].setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener("input", function () { showError(key, ""); });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  summary.hidden = true;

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

  const service = fields.service.value;
  const lines = [
    "Hello Oyemar Enterprises, I would like to request a service.",
    "Name: " + fields.name.value.trim(),
    "Service: " + serviceNames[service]
  ];
  if (service === "airtime" || service === "data") {
    lines.push("Network: " + fields.network.value);
  }
  lines.push("Phone number: " + fields.phone.value.trim());
  lines.push("Amount: \u20A6" + Number(fields.amount.value).toLocaleString("en-US"));
  if (details.value.trim() !== "") {
    lines.push("Details: " + details.value.trim());
  }

  const message = lines.join("\n");
  summaryText.textContent = "Your request is ready:\n\n" + message;
  sendLink.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  summary.hidden = false;
  summary.scrollIntoView({ behavior: "smooth", block: "center" });
});