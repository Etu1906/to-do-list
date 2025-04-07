"use client";

import { cn } from "@/lib/utils";
import {
  ListTodo,
  Calendar,
  Clock,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTodoStore } from "@/store/useTodoStore";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { getOverdueTodos } = useTodoStore();
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    setOverdueCount(getOverdueTodos().length);
  }, [getOverdueTodos]);

  const menuItems = [
    {
      href: "/",
      label: "Toutes les tâches",
      icon: <ListTodo size={20} />,
    },
    {
      href: "/today",
      label: "Aujourd'hui",
      icon: <Calendar size={20} />,
    },
    {
      href: "/tomorrow",
      label: "Demain",
      icon: <Clock size={20} />,
    },
    {
      href: "/upcoming",
      label: "À venir",
      icon: <CalendarDays size={20} />,
    },
    {
      href: "/overdue",
      label: "En retard",
      icon: <Clock size={20} />,
      badge: overdueCount > 0 ? overdueCount : undefined,
    },
  ];

  return (
    <div className="pb-12 min-h-screen bg-secondary">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold text-primary">Menu</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:bg-secondary hover:text-primary",
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-500"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {item.badge ? (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
