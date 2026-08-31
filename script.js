document.addEventListener("DOMContentLoaded", () => {
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const taskSubmitButton = document.getElementById("addExpenseButton");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalDiv = document.getElementById("total");
    const totalAmountDisplay = document.getElementById("total-amount");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let totalAmount = calculateTotal();

    renderExpenses();

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault(); // we do this here because the default behavior of a form submission is to refresh the page, which we don't want in this case because we want to handle the form submission with JavaScript instead of letting the browser handle it.

        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());  // here we do parseFloat because the amount entered by the user is stored as a string and we want to convert the string value of the input to a number, so we can do calculations with it later on. We also use trim() to remove any whitespace from the beginning and end of the string, so we don't end up with an empty string or a string with only whitespace.

        if(name !== "" && !isNaN(amount) && amount !== "") {
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount
            }

            expenses.push(newExpense);
            saveExpensesTolocal();
            renderExpenses();
            updateTotal();
            expenseFormReset();
        }
    })

    function renderExpenses() {
        expenseList.innerHTML = ""; // we do this because we want to clear the list before we render the new expenses, otherwise we would end up with duplicate entries in the list, which can be when we are adding a new expense and the list is re-rendered
        expenses.forEach(expense => {
            const expenseItem = document.createElement("li");
            expenseItem.innerHTML = `
            ${expense.name} - $${expense.amount}
            <button id="${expense.id}">Delete</button>
            `
            // here we use data-id not id to avoid conflicts with the li's id as but we could have also used id="${expense.id}" and then in the event listener we would have to use e.target.id instead of e.target.getAttribute("data-id")
            // also here we use dollar variable in button without backtick because we are already inside a backtick string, so we can't use backticks again, but we can use dollar variable because we are already inside a backtick string, so we can use dollar variable to access the expense.id value and set it as the button's id attribute
            expenseList.appendChild(expenseItem);
        })

    }

    function updateTotal() {
        totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2); 
    }

    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);  // using parseFloat here because the amount is stored as a string in the expenses array, so we need to convert it to a number before we can add it to the sum
    }
    

    function expenseFormReset() {
        expenseNameInput.value = "";
        expenseAmountInput.value = "";
    }

    function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.id); // here we use parseInt because the id is stored as a string in the button's id attribute, so we need to convert it to a number before we can compare it to the expense.id value, which is a number
      expenses = expenses.filter((expense) => expense.id !== expenseId);

      saveExpensesTolocal();
      renderExpenses();
      updateTotal();
    }
  });
})