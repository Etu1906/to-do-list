import { MobileSidebar } from "@/components/MobileSidebar";
import { TodoList } from "@/components/TodoList";

export default function UpcomingPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="flex items-center gap-4 mb-8">
        <MobileSidebar />
        <h1 className="text-3xl mx-10 font-bold text-primary">À venir</h1>
      </div>
      <TodoList defaultFilter="upcoming" />
    </div>
  );
}
