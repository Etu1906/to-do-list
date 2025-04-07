"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTodoStore } from "@/store/useTodoStore";
import { useState, useEffect } from "react";
import { Calendar, Clock, List, CalendarDays } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const overdueCount = useTodoStore((state) => state.overdueCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      href: "/",
      label: "Toutes les tâches",
      icon: <List size={20} />,
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
      badge: mounted && overdueCount > 0 ? overdueCount : undefined,
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-80 bg-secondary border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-primary">Menu</h2>
      </div>
      <div className="p-4">

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
