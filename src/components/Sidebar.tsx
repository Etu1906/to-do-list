"use client";

import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pb-12 min-h-screen bg-[#f7f8fd]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold text-[#4772FA]">Menu</h2>
          <div className="space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-secondary hover:text-primary",
                pathname === "/"
                  ? "bg-primary/10 text-[#4772FA] font-medium"
                  : "text-gray-500"
              )}
            >
              <ListTodo className="h-5 w-5" />
              Mes tâches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
