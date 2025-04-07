"use client";

import { Todo } from "@/store/useTodoStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, Pencil, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

function TodoItem({
  todo,
  editingId,
  editingText,
  editingDate,
  editingTime,
  onToggle,
  onDelete,
  onEdit,
  onUpdate,
}: {
  todo: Todo;
  editingId: string | null;
  editingText: string;
  editingDate: string;
  editingTime: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onUpdate: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
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
            onChange={(e) => onEdit({ ...todo, title: e.target.value })}
            className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
            autoFocus
          />
          <input
            type="date"
            value={editingDate}
            onChange={(e) =>
              onEdit({
                ...todo,
                scheduledFor: e.target.value ? new Date(e.target.value) : null,
              })
            }
            className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
          />
          <input
            type="time"
            value={editingTime}
            onChange={(e) =>
              onEdit({
                ...todo,
                scheduledFor: e.target.value
                  ? new Date(`${editingDate}T${e.target.value}`)
                  : null,
              })
            }
            className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => onUpdate(todo.id)}
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <span
            className={`flex-1 ${
              todo.completed ? "text-gray-400 line-through" : ""
            }`}
          >
            {todo.title}
          </span>
          {todo.scheduledFor && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(todo.scheduledFor), "dd MMM", {
                  locale: fr,
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {format(new Date(todo.scheduledFor), "HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {!editingId && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-400 hover:text-primary"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export function TodoSection({
  title,
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState<string>("");
  const [editingTime, setEditingTime] = useState<string>("");

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
    if (todo.scheduledFor) {
      const date = new Date(todo.scheduledFor);
      setEditingDate(format(date, "yyyy-MM-dd"));
      setEditingTime(format(date, "HH:mm"));
    } else {
      setEditingDate("");
      setEditingTime("");
    }
  };

  const handleUpdate = (id: string) => {
    if (editingText.trim()) {
      const updates: Partial<Todo> = {
        title: editingText.trim(),
      };

      if (editingDate && editingTime) {
        const scheduledFor = new Date(`${editingDate}T${editingTime}`);
        updates.scheduledFor = scheduledFor;
      } else {
        updates.scheduledFor = null;
      }

      onUpdate(id, updates);
      setEditingId(null);
    }
  };

  if (todos.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            editingId={editingId}
            editingText={editingText}
            editingDate={editingDate}
            editingTime={editingTime}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={handleEdit}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
);
}
