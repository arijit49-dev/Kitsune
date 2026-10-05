"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";

const BottomNav = () => {
  const pathname = usePathname();
  const { auth } = useAuthStore();

  const items = [
    {
      label: "New",
      icon: Home,
      href: ROUTES.HOME,
      active: pathname === ROUTES.HOME,
    },
    {
      label: "Search",
      icon: Search,
      href: ROUTES.SEARCH,
      active: pathname === ROUTES.SEARCH,
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "#schedule",
      active: false,
    },
  ];

  if (auth) {
    items.push({
      label: "You",
      icon: User,
      href: `/profile/${auth.username}`,
      active: pathname?.startsWith("/profile") ?? false,
    });
  }

  return (
    <nav className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-2 shadow-2xl backdrop-blur-xl">
        {items.map(({ label, icon: Icon, href, active }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors",
              active ? "text-violet-400" : "text-gray-400 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
