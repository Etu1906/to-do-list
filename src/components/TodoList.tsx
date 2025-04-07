"use client";

import { useState } from "react";
import { useTodoStore, Todo } from "@/store/useTodoStore";
import { TodoSection } from "./TodoSection";
import { addDays } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TodoListProps {
  defaultFilter?: "all" | "today" | "tomorrow" | "overdue" | "upcoming";
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
    getUpcomingTodos,
  } = useTodoStore();

  const [newTodo, setNewTodo] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      let scheduledFor: Date | undefined;

      if (scheduledDate) {
        if (scheduledTime) {
          scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
        } else {
          scheduledFor = new Date(scheduledDate);
        }
      } else {
        scheduledFor = new Date();
        scheduledFor.setHours(0, 0, 0, 0);

        if (defaultFilter === "tomorrow") {
          scheduledFor = addDays(scheduledFor, 1);
        }
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
  const upcomingTodos = getUpcomingTodos();

  const renderSection = (title: string, todos: Todo[], value: string) => {
    if (todos.length === 0) return null;

    return (
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="flex items-center gap-2 w-full p-2 bg-secondary rounded-lg hover:bg-gray-100 hover:no-underline">
          <span className="text-md font-semibold  text-gray-700">{title}</span>
          <span className="ml-auto text-sm text-gray-500">
            {todos.length} tâche{todos.length > 1 ? "s" : ""}
          </span>
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          <TodoSection
            title={""}
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </AccordionContent>
      </AccordionItem>
    );
  };

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
        <Accordion
          type="single"
          collapsible
          defaultValue="today"
          className="space-y-4"
        >
          {renderSection("Aujourd'hui", todayTodos, "today")}
          {renderSection("Demain", tomorrowTodos, "tomorrow")}
          {renderSection("En retard", overdueTodos, "overdue")}
          {renderSection("À venir", upcomingTodos, "upcoming")}
        </Accordion>
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

      {defaultFilter === "upcoming" && (
        <TodoSection
          title="À venir"
          todos={upcomingTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      )}
    </div>
  );
}
