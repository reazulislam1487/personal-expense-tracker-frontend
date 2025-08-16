"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import ExpenseItem from "@/components/ExpenseItem";
import ExpenseChart from "@/components/ExpenseChart";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // ফেক ডাটা লোড (API থাকলে এখানে ফেচ করবে)
  useEffect(() => {
    const dummyData = [
      {
        _id: "1",
        title: "Lunch",
        amount: 15,
        category: "Food",
        date: "2025-08-14",
      },
      {
        _id: "2",
        title: "Bus Ticket",
        amount: 5,
        category: "Transport",
        date: "2025-08-15",
      },
      {
        _id: "3",
        title: "T-shirt",
        amount: 25,
        category: "Shopping",
        date: "2025-08-15",
      },
    ];
    setExpenses(dummyData);
  }, []);

  // ফর্ম সাবমিট
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category || !form.date) return;

    if (isEditing) {
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === editId ? { ...form, _id: editId } : exp))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setExpenses((prev) => [...prev, { ...form, _id: Date.now().toString() }]);
    }

    setForm({ title: "", amount: "", category: "", date: "" });
  };

  // ডিলিট
  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp._id !== id));
  };

  // এডিট
  const handleEdit = (expense) => {
    setForm(expense);
    setIsEditing(true);
    setEditId(expense._id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* হেডার */}
      <h1 className="text-3xl font-bold text-white mb-6">Expense Tracker</h1>

      {/* চার্ট */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6">
        <ExpenseChart expenses={expenses} />
      </div>

      {/* ফর্ম */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-4 rounded-xl mb-6 flex flex-wrap gap-3 items-center"
      >
        <input
          type="text"
          placeholder="Title"
          className="p-2 rounded-lg bg-gray-800 text-white flex-1"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          className="p-2 rounded-lg bg-gray-800 text-white w-28"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          className="p-2 rounded-lg bg-gray-800 text-white"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="date"
          className="p-2 rounded-lg bg-gray-800 text-white"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
        >
          <PlusCircle size={18} />
          {isEditing ? "Update" : "Add"}
        </button>
      </form>

      {/* খরচের লিস্ট */}
      <div>
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p className="text-white/60 text-center">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
