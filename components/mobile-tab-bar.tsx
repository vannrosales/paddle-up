"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, User, Trophy, Shield } from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home, exact: true },
    { label: "Players", href: "/players", icon: Users },
    { label: "Rankings", href: "/leaderboard", icon: Trophy },
    { label: "Clubs", href: "/clubs", icon: Shield },
    { label: "Dashboard", href: "/dashboard", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-neutral-200/90 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? "text-neutral-950 dark:text-[#C8F31D] font-bold scale-105"
                  : "text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#C8F31D]/15 text-lime-700 dark:text-[#C8F31D]"
                    : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
