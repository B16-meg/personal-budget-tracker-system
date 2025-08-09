// static/script.js

const form = document.getElementById('transaction-form');
const type = document.getElementById('type');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const date = document.getElementById('date');
const note = document.getElementById('note');
const tableBody = document.querySelector('#transaction-table tbody');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const balance = document.getElementById('balance');
const categoryChartCanvas = document.getElementById('categoryChart');
const searchInput = document.getElementById('search-input');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
let categoryChart;

let transactions = [];
let editingId = null;

// Load transactions from Flask
async function loadTransactions() {
  try {
    const res = await fetch('/transactions');
    transactions = await res.json();
    renderTransactions();
  } catch (err) {
    console.error("Failed to load transactions:", err);
  }
}

// Add new transaction
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate input
  if (!type.value || !amount.value || !category.value || !date.value) {
    alert("Please fill in all required fields.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    type: type.value,
    amount: parseFloat(amount.value),
    category: category.value.trim(),
    date: date.value,
    note: note.value.trim()
  };

  console.log("Attempting to add transaction:", newTransaction);

  try {
    const res = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction)
    });

    const result = await res.text();
    console.log("Response from /add:", res.status, result);

    if (res.ok) {
      transactions.push(newTransaction);
      form.reset();
      renderTransactions();
    } else {
      alert('Failed to add transaction.');
    }
  } catch (err) {
    console.error("Error adding transaction:", err);
    alert('An error occurred while adding the transaction.');
  }
});

// Delete transaction
async function deleteTransaction(id) {
  try {
    const res = await fetch(`/delete/${id}`, { method: 'DELETE' });

    if (res.ok) {
      transactions = transactions.filter(tx => tx.id !== id);
      renderTransactions();
    } else {
      alert('Failed to delete transaction.');
    }
  } catch (err) {
    console.error("Error deleting transaction:", err);
    alert('An error occurred while deleting.');
  }
}

// Open modal to edit transaction
function openEditModal(tx) {
  editingId = tx.id;
  editForm.type.value = tx.type;
  editForm.amount.value = tx.amount;
  editForm.category.value = tx.category;
  editForm.date.value = tx.date;
  editForm.note.value = tx.note;
  editModal.style.display = 'block';
}

// Submit edit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedTransaction = {
    type: editForm.type.value,
    amount: parseFloat(editForm.amount.value),
    category: editForm.category.value.trim(),
    date: editForm.date.value,
    note: editForm.note.value.trim()
  };

  try {
    const res = await fetch(`/edit/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction)
    });

    const result = await res.text();
    console.log("Response from /edit:", res.status, result);

    if (res.ok) {
      const index = transactions.findIndex(tx => tx.id === editingId);
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      renderTransactions();
      editModal.style.display = 'none';
    } else {
      alert('Failed to update transaction.');
    }
  } catch (err) {
    console.error("Error updating transaction:", err);
    alert('An error occurred while updating.');
  }
});

// Filter by keyword (search)
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = transactions.filter(tx =>
    tx.note.toLowerCase().includes(query) ||
    tx.category.toLowerCase().includes(query) ||
    tx.type.toLowerCase().includes(query)
  );
  renderTransactions(filtered);
});

// Render all transactions
function renderTransactions(data = transactions) {
  tableBody.innerHTML = '';
  let income = 0;
  let expense = 0;

  data.forEach((tx) => {
    const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Type" class="${tx.type}">${tx.type}</td>
        <td data-label="Amount">₦${tx.amount.toFixed(2)}</td>
        <td data-label="Category">${tx.category}</td>
        <td data-label="Date">${tx.date}</td>
        <td data-label="Note">${tx.note}</td>
        <td data-label="Action">
          <button class="action-btn" id="delete" onclick="deleteTransaction(${tx.id})">Delete</button>
          <button class="action-btn" id="edit" onclick='openEditModal(${JSON.stringify(tx)})'>Edit</button>
        </td> 
      `;

    tableBody.appendChild(row);

    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  });

  totalIncome.textContent = income.toFixed(2);
  totalExpense.textContent = expense.toFixed(2);
  balance.textContent = (income - expense).toFixed(2);
  updateCategoryChart(data);
}

// Update category chart
function updateCategoryChart(data = transactions) {
  const categoryTotals = {};
  data.forEach((tx) => {
    if (tx.type === 'expense') {
      const cat = tx.category.trim().toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
    }
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(categoryChartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '₦ Spent by Category',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Category-wise Expense Chart',
          font: { size: 18, weight: 'bold' }
        },
        legend: { display: true, position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: value => '₦' + value }
        }
      }
    }
  });
}

loadTransactions();
