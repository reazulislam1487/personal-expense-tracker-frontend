"use client";

import { useState } from "react";
import { Trash2, Edit3, DollarSign } from "lucide-react";

const categoryColors = {
  Food: "bg-green-500",
  Transport: "bg-blue-500",
  Shopping: "bg-orange-500",
  Others: "bg-gray-500",
};

export default function ExpenseItem({ expense, onDelete, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
              {expense.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-white text-xs rounded-full ${
                  categoryColors[expense.category] || "bg-gray-500"
                }`}
              >
                {expense.category}
              </span>
              • {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${expense.amount}
            </div>
          </div>

          <div
            className={`flex space-x-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={() => onEdit(expense)}
              className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transform transition-all duration-200 hover:scale-110"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(expense._id)}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transform transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
