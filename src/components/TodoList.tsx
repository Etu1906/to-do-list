"use client";

import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoSection } from "./TodoSection";

interface TodoListProps {
  defaultFilter?: "all" | "today" | "tomorrow" | "overdue";
}

export function TodoList({ defaultFilter = "all" }: TodoListProps) {
  const {
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    getTodayTodos,
    getOverdueTodos,
    getTomorrowTodos,
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      let scheduledFor: Date | undefined;

      if (scheduledDate) {
        // Si une date est spécifiée
        if (scheduledTime) {
          // Si une heure est spécifiée
          scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
        } else {
          // Si seule la date est spécifiée, on utilise minuit
          scheduledFor = new Date(scheduledDate);
        }
      } else {
        // Si aucune date n'est spécifiée, on utilise la date actuelle
        scheduledFor = new Date();
        scheduledFor.setHours(0, 0, 0, 0);
      }

      addTodo(newTodo.trim(), scheduledFor);
      setNewTodo("");
      setScheduledDate("");
      setScheduledTime("");
    }
  };

  const overdueTodos = getOverdueTodos();
  const todayTodos = getTodayTodos();
  const tomorrowTodos = getTomorrowTodos();

  return (
    <div className="max-w-6xl mx-10 py-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Ajouter une tâche..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary bg-white"
          />
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary bg-white"
          />
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary bg-white"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Ajouter
          </button>
        </div>
      </form>

      {defaultFilter === "all" && (
        <>
          {overdueTodos.length > 0 && (
            <TodoSection
              title="En retard"
              todos={overdueTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          )}
          <TodoSection
            title="Aujourd'hui"
            todos={todayTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
          <TodoSection
            title="Demain"
            todos={tomorrowTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </>
      )}

      {defaultFilter === "today" && (
        <TodoSection
          title="Aujourd'hui"
          todos={todayTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      )}

      {defaultFilter === "tomorrow" && (
        <TodoSection
          title="Demain"
          todos={tomorrowTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      )}

      {defaultFilter === "overdue" && (
        <TodoSection
          title="En retard"
          todos={overdueTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      )}
    </div>
  );
}
