"use client";
import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { Check, Trash2, Pencil } from "lucide-react";

export function TodoList() {
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoStore();
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingText(title);
  };

  const handleUpdate = (id: string) => {
    if (editingText.trim()) {
      updateTodo(id, editingText.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-10 py-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Ajouter une tâche..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary bg-white"
        />
      </form>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                todo.completed
                  ? "bg-primary border-primary"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              {todo.completed && <Check size={14} className="text-white" />}
            </button>

            {editingId === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={() => handleUpdate(todo.id)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(todo.id)}
                className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary bg-white"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 ${
                  todo.completed ? "text-gray-400 line-through" : ""
                }`}
              >
                {todo.title}
              </span>
            )}

            <button
              onClick={() => handleEdit(todo.id, todo.title)}
              className="p-1 text-gray-400 hover:text-primary"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
