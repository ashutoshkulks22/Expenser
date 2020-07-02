const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const checkbox = document.getElementById("checkbox");

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transactions
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000000);
}

// Add transactions to the DOM list

function addTransactionDOM(transaction) {
  let formatter = checkbox.checked ? INR : USD;
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.classList.add("zero");

  item.innerHTML = `${transaction.text} <span> ${sign}${formatter.format(
    Math.abs(transaction.amount)
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">X</button>`;

  list.appendChild(item);
}

// Update values of balance, income and expenses

function updateValues() {
  let formatter = checkbox.checked ? INR : USD;

  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(1);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(1);

  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -(1).toFixed(1);

  balance.innerText = `${formatter.format(total)}`;
  money_plus.innerText = `${formatter.format(income)}`;
  money_minus.innerText = `${formatter.format(expense)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id != id);

  updateLocalStorage();

  init();
}

// Reformat transactions

function formatTransaction() {
  let formatter = checkbox.checked ? INR : USD;
  const amounts = transactions.map((transaction) => transaction.amount);

  var items = list.getElementsByTagName("span");
  for (var i = 0; i < items.length; i++) {
    var sign = amounts[i] < 0 ? "-" : "+";

    items[i].innerHTML = `${sign}${formatter.format(Math.abs(amounts[i]))}`;
  }
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app

function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
checkbox.addEventListener("click", updateValues);
checkbox.addEventListener("click", formatTransaction);
