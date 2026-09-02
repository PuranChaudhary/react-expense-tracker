import { useEffect, useState } from 'react'

function App() {
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses')
    return savedExpenses ? JSON.parse(savedExpenses) : []
  })

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  function handleSubmit(e) {
    e.preventDefault()

    if (!expenseName.trim()) {
      alert('Please enter an expense name.')
      return
    }

    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.')
      return
    }

    if (!category) {
      alert('Please select a category.')
      return
    }

    if (!date) {
      alert('Please select a date.')
      return
    }

    const newExpense = {
      id: Date.now(),
      name: expenseName.trim(),
      amount: Number(amount),
      category: category,
      date: date,
    }

    setExpenses([...expenses, newExpense])

    setExpenseName('')
    setAmount('')
    setCategory('')
    setDate('')
  }

  function deleteExpense(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    )

    if (!confirmDelete) {
      return
    }

    setExpenses(
      expenses.filter((expense) => expense.id !== id)
    )
  }

  function editExpense(id) {
    const expense = expenses.find(
      (expense) => expense.id === id
    )

    if (!expense) {
      return
    }

    const newName = prompt(
      'Enter expense name:',
      expense.name
    )

    if (newName === null) {
      return
    }

    const newAmount = prompt(
      'Enter amount:',
      expense.amount
    )

    if (newAmount === null) {
      return
    }

    const newCategory = prompt(
      'Enter category:',
      expense.category
    )

    if (newCategory === null) {
      return
    }

    const newDate = prompt(
      'Enter date:',
      expense.date
    )

    if (newDate === null) {
      return
    }

    if (
      !newName.trim() ||
      !newAmount ||
      !newCategory ||
      !newDate
    ) {
      alert('Please fill in all fields.')
      return
    }

    if (Number(newAmount) <= 0) {
      alert('Please enter a valid amount.')
      return
    }

    const validCategories = [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Education',
      'Other',
    ]

    if (!validCategories.includes(newCategory)) {
      alert('Please enter a valid category.')
      return
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              name: newName.trim(),
              amount: Number(newAmount),
              category: newCategory,
              date: newDate,
            }
          : expense
      )
    )
  }

  const filteredExpenses =
    filterCategory === 'All'
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.category === filterCategory
        )

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  const filteredTotal = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  const totalItems = expenses.length

  const averageExpense =
    expenses.length > 0
      ? totalExpense / expenses.length
      : 0

  const categoryTotals = expenses.reduce(
    (totals, expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }

      totals[expense.category] += expense.amount

      return totals
    },
    {}
  )

  function formatAmount(amount) {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Expense Tracker</h1>

        <p className="subtitle">
          Track your daily expenses
        </p>

        <form
          onSubmit={handleSubmit}
          className="expense-form"
        >
          <input
            type="text"
            placeholder="Expense name"
            value={expenseName}
            onChange={(e) =>
              setExpenseName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">Select category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">💡 Bills</option>
            <option value="Education">📚 Education</option>
            <option value="Other">📦 Other</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <button type="submit">
            Add Expense
          </button>
        </form>

        <div className="stats">
          <div className="stat-card">
            <span>
              {filterCategory === 'All'
                ? 'Total Expense'
                : `${filterCategory} Expense`}
            </span>

            <strong>
              Rs. {formatAmount(filteredTotal)}
            </strong>
          </div>

          <div className="stat-card">
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="stat-card">
            <span>Average Expense</span>
            <strong>
              Rs. {formatAmount(averageExpense)}
            </strong>
          </div>
        </div>

        <div className="category-summary">
          <h2>Spending by Category</h2>

          {Object.entries(categoryTotals).length === 0 ? (
            <p className="empty-message">
              No category data available.
            </p>
          ) : (
            Object.entries(categoryTotals).map(
              ([category, total]) => (
                <div
                  className="category-row"
                  key={category}
                >
                  <span>{category}</span>

                  <strong>
                    Rs. {formatAmount(total)}
                  </strong>
                </div>
              )
            )
          )}
        </div>

        <div className="total">
          <span>Total Expense</span>

          <strong>
            Rs. {formatAmount(totalExpense)}
          </strong>
        </div>

        <div className="expense-list">
          <h2>Expenses</h2>

          <div className="filter">
            <label>Filter by category:</label>

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Food">🍔 Food</option>
              <option value="Transport">
                🚗 Transport
              </option>
              <option value="Shopping">
                🛍️ Shopping
              </option>
              <option value="Bills">💡 Bills</option>
              <option value="Education">
                📚 Education
              </option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          {expenses.length === 0 ? (
            <p className="empty-message">
              No expenses yet. Add your first expense!
            </p>
          ) : filteredExpenses.length === 0 ? (
            <p className="empty-message">
              No {filterCategory} expenses found.
            </p>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                className="expense-item"
                key={expense.id}
              >
                <div className="expense-info">
                  <strong>{expense.name}</strong>

                  <span className="expense-amount">
                    Rs. {formatAmount(expense.amount)}
                  </span>

                  <small className="expense-category">
                    {expense.category}
                  </small>

                  <small className="expense-date">
                    📅 {formatDate(expense.date)}
                  </small>
                </div>

                <div className="actions">
                  <button
                    onClick={() =>
                      editExpense(expense.id)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteExpense(expense.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App