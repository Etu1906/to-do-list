import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  scheduledFor: Date | null;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, scheduledFor?: Date) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  getTodayTodos: () => Todo[];
  getOverdueTodos: () => Todo[];
  getTomorrowTodos: () => Todo[];
}

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (title, scheduledFor) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              scheduledFor: scheduledFor || null,
              createdAt: new Date(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      getTodayTodos: () => {
        const { todos } = get();
        return todos.filter(
          (todo) => todo.scheduledFor && isToday(new Date(todo.scheduledFor))
        );
      },
      getOverdueTodos: () => {
        const { todos } = get();
        const now = new Date();
        return todos.filter(
          (todo) =>
            todo.scheduledFor &&
            new Date(todo.scheduledFor) < now &&
            !isToday(new Date(todo.scheduledFor)) &&
            !todo.completed
        );
      },
      getTomorrowTodos: () => {
        const { todos } = get();
        return todos.filter(
          (todo) => todo.scheduledFor && isTomorrow(new Date(todo.scheduledFor))
        );
      },
    }),
    {
      name: "todo-storage",
    }
  )
);
