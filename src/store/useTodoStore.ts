import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, isToday, isTomorrow, isAfter } from "date-fns";

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
  getUpcomingTodos: () => Todo[];
}

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
    }),
    {
      name: "todo-storage",
    }
  )
);
