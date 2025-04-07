"use client";

import { Todo } from "@/store/useTodoStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, Pencil, Trash2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function TodoSection({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
    setEditingDate(
      todo.scheduledFor ? format(todo.scheduledFor, "yyyy-MM-dd") : ""
    );
    setEditingTime(todo.scheduledFor ? format(todo.scheduledFor, "HH:mm") : "");
  };

  const handleUpdate = (id: string) => {
    if (editingText.trim()) {
      const updates: Partial<Todo> = {
        title: editingText.trim(),
      };

      if (editingDate) {
        const date = new Date(editingDate);
        if (editingTime) {
          const [hours, minutes] = editingTime.split(":");
          date.setHours(parseInt(hours), parseInt(minutes));
        }
        updates.scheduledFor = date;
      } else {
        updates.scheduledFor = null;
      }

      onUpdate(id, updates);
      setEditingId(null);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="w-5 h-5 rounded-full border border-gray-300" />
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm"
        >
          <button
            onClick={() => onToggle(todo.id)}
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              todo.completed
                ? "bg-primary border-primary"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>

          {editingId === todo.id ? (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
                autoFocus
              />
              <input
                type="date"
                value={editingDate}
                onChange={(e) => setEditingDate(e.target.value)}
                className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
              />
              <input
                type="time"
                value={editingTime}
                onChange={(e) => setEditingTime(e.target.value)}
                className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleUpdate(todo.id)}
                className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
              >
                Valider
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <span
                className={`${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
              {todo.scheduledFor && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {format(todo.scheduledFor, "d MMMM yyyy", { locale: fr })}
                  {format(todo.scheduledFor, "HH:mm") !== "00:00" && (
                    <>
                      <Clock size={14} />
                      {format(todo.scheduledFor, "HH:mm")}
                    </>
                  )}
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(todo)}
              className="p-1 text-gray-500 hover:text-primary"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
