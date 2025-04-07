import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addDays,
  isToday,
  isTomorrow,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  scheduledFor: Date | null;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  overdueCount: number;
  addTodo: (title: string, scheduledFor?: Date) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  getTodayTodos: () => Todo[];
  getOverdueTodos: () => Todo[];
  getTomorrowTodos: () => Todo[];
  getUpcomingTodos: () => Todo[];
  updateOverdueCount: () => void;
}

const isOverdue = (date: Date | null) => {
  if (!date) return false;
  const today = startOfDay(new Date());
  return isBefore(date, today);
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      overdueCount: 0,
      addTodo: (title, scheduledFor) =>
        set((state) => {
          const newTodo = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            scheduledFor: scheduledFor || null,
            createdAt: new Date(),
          };

          const newOverdueCount = isOverdue(newTodo.scheduledFor)
            ? state.overdueCount + 1
            : state.overdueCount;

          return {
            todos: [...state.todos, newTodo],
            overdueCount: newOverdueCount,
          };
        }),
      toggleTodo: (id) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );

          const newOverdueCount = updatedTodos.filter(
            (todo) => !todo.completed && isOverdue(todo.scheduledFor)
          ).length;

          return {
            todos: updatedTodos,
            overdueCount: newOverdueCount,
          };
        }),
      updateTodo: (id, updates) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          );

          const newOverdueCount = updatedTodos.filter(
            (todo) => !todo.completed && isOverdue(todo.scheduledFor)
          ).length;

          return {
            todos: updatedTodos,
            overdueCount: newOverdueCount,
          };
        }),
      deleteTodo: (id) =>
        set((state) => {
          const todoToDelete = state.todos.find((todo) => todo.id === id);
          const wasOverdue =
            todoToDelete &&
            !todoToDelete.completed &&
            isOverdue(todoToDelete.scheduledFor);

          const newOverdueCount = wasOverdue
            ? state.overdueCount - 1
            : state.overdueCount;

          return {
            todos: state.todos.filter((todo) => todo.id !== id),
            overdueCount: newOverdueCount,
          };
        }),
      getTodayTodos: () => {
        const { todos } = get();
        return todos.filter(
          (todo) => todo.scheduledFor && isToday(new Date(todo.scheduledFor))
        );
      },
      getOverdueTodos: () => {
        const { todos } = get();
        return todos.filter(
          (todo) => !todo.completed && isOverdue(todo.scheduledFor)
        );
      },
      getTomorrowTodos: () => {
        const { todos } = get();
        return todos.filter(
          (todo) => todo.scheduledFor && isTomorrow(new Date(todo.scheduledFor))
        );
      },
      getUpcomingTodos: () => {
        const { todos } = get();
        const tomorrow = addDays(new Date(), 1);
        tomorrow.setHours(0, 0, 0, 0);
        return todos.filter(
          (todo) =>
            todo.scheduledFor &&
            isAfter(new Date(todo.scheduledFor), tomorrow) &&
            !todo.completed
        );
      },
      updateOverdueCount: () => {
        const { todos } = get();
        const newOverdueCount = todos.filter(
          (todo) => !todo.completed && isOverdue(todo.scheduledFor)
        ).length;
        set({ overdueCount: newOverdueCount });
      },
    }),
    {
      name: "todo-storage",
    }
  )
);
