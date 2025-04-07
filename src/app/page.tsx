import { TodoList } from "./components/TodoList";
import { MobileSidebar } from "@/components/MobileSidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <MobileSidebar />
          <h1 className="text-3xl mx-10 font-bold text-primary">Mes tâches</h1>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
