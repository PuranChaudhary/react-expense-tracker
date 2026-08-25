import { useEffect, useState } from 'react'

function App() {
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState('')

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

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: Number(amount),
    }

    setExpenses([...expenses, newExpense])

    setExpenseName('')
    setAmount('')
  }

  function deleteExpense(id) {
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

    const newAmount = prompt(
      'Enter amount:',
      expense.amount
    )

    if (!newName || !newAmount) {
      return
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              name: newName,
              amount: Number(newAmount),
            }
          : expense
      )
    )
  }

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

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

          <button type="submit">
            Add Expense
          </button>
        </form>

        <div className="total">
          <span>Total Expense</span>
          <strong>Rs. {totalExpense}</strong>
        </div>

        <div className="expense-list">
  <h2>Expenses</h2>

  {expenses.length === 0 ? (
    <p className="empty-message">
      No expenses yet. Add your first expense!
    </p>
  ) : (
    expenses.map((expense) => (
      <div
        className="expense-item"
        key={expense.id}
      >
        <span>
          {expense.name} - Rs. {expense.amount}
        </span>

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