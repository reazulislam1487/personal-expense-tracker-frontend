"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingDown,
  Sparkles,
  Filter,
  Calendar,
  PieChart,
  X,
} from "lucide-react";
import ExpenseItem from "./components/ExpenseItem";
import ExpenseChart from "./components/ExpenseChart";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);

  const backendURL = `${process.env.NEXT_PUBLIC_API_URL}`;
  // console.log(backendURL);

  // Filter expenses based on category and date range
  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch =
      !filterCategory || expense.category === filterCategory;
    const expenseDate = new Date(expense.date);
    const startMatch = !startDate || expenseDate >= new Date(startDate);
    const endMatch = !endDate || expenseDate <= new Date(endDate);

    return categoryMatch && startMatch && endMatch;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await fetch(backendURL);
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add or update expense
  const handleSubmit = async () => {
    if (!title.trim() || title.length < 3) {
      alert("Title must be at least 3 characters.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }
    if (!category.trim()) {
      alert("Category is required.");
      return;
    }
    if (!date || isNaN(new Date(date).getTime())) {
      alert("Please provide a valid date.");
      return;
    }

    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    try {
      if (editingId) {
        await fetch(`${backendURL}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
      } else {
        await fetch(backendURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
      }
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await fetch(`${backendURL}/${id}`, { method: "DELETE" });
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Edit expense
  const handleEdit = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date.split("T")[0]);
    setEditingId(expense._id);
    setIsFormVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setEditingId(null);
    setIsFormVisible(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your finances with style
          </p>
        </div>

        {/* Stats and Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Stats Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Expenses</p>
                  <p className="text-3xl font-bold text-white">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">
                  {filteredExpenses.length} Transactions
                </p>
                {(filterCategory || startDate || endDate) && (
                  <p className="text-purple-300 text-xs">
                    Filtered from {expenses.length} total
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white/10 backdrop-blur-md border mb-10 md:mb-0 border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Expense Breakdown</h3>
              <button
                onClick={() => setIsChartVisible(!isChartVisible)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <PieChart className="w-5 h-5" />
              </button>
            </div>
            {isChartVisible && (
              <div className="h-64">
                <ExpenseChart expenses={filteredExpenses} />
              </div>
            )}
            {!isChartVisible && (
              <div className="h-64 flex items-center justify-center">
                <button
                  onClick={() => setIsChartVisible(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Show Chart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/30 transform transition-all duration-300 hover:scale-[1.02] group"
            >
              <Plus className="w-5 h-5 transform transition-transform group-hover:rotate-90 duration-300" />
              <span className="font-semibold">Add New Expense</span>
            </button>
          )}

          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg hover:shadow-blue-500/30 transform transition-all duration-300 hover:scale-[1.02]"
          >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter</span>
            {(filterCategory || startDate || endDate) && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {!isChartVisible && (
            <button
              onClick={() => setIsChartVisible(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/30 transform transition-all duration-300 hover:scale-[1.02]"
            >
              <PieChart className="w-5 h-5" />
              <span className="font-semibold">Show Chart</span>
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {isFilterVisible && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Expenses
              </h3>
              <button
                onClick={() => setIsFilterVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white"
                >
                  <option value="" className="text-black">
                    All Categories
                  </option>
                  <option value="Food" className="text-black">
                    Food
                  </option>
                  <option value="Transport" className="text-black">
                    Transport
                  </option>
                  <option value="Shopping" className="text-black">
                    Shopping
                  </option>
                  <option value="Others" className="text-black">
                    Others
                  </option>
                </select>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={clearFilters}
                className="bg-white/20 text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                Clear Filters
              </button>
              <div className="text-white/60 text-sm flex items-center">
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {isFormVisible && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {editingId ? "Edit Expense" : "Add New Expense"}
              </h3>
              <button
                onClick={resetForm}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter expense title"
                    className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Amount * ($)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white"
                  >
                    <option value="" className="text-black">
                      Select category
                    </option>
                    <option value="Food" className="text-black">
                      Food
                    </option>
                    <option value="Transport" className="text-black">
                      Transport
                    </option>
                    <option value="Shopping" className="text-black">
                      Shopping
                    </option>
                    <option value="Others" className="text-black">
                      Others
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                >
                  {editingId ? "Update Expense" : "Add Expense"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-2">
                {expenses.length === 0
                  ? "No expenses yet"
                  : "No expenses match your filters"}
              </p>
              <p className="text-white/40 text-sm">
                {expenses.length === 0
                  ? "Add your first expense to get started"
                  : "Try adjusting your filter criteria"}
              </p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <ExpenseItem
                key={exp._id}
                expense={exp}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
