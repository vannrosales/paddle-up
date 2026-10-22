"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Users,
  LayoutDashboard,
  UserPlus,
  LogIn,
  Trophy,
  Shield,
  UserCheck,
  Search,
} from "lucide-react";

export function Navbar() {
  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/brand/mark.svg"
              alt="PaddleUp Mark"
              width={36}
              height={36}
              priority
            />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white">
            Paddle<span className="text-lime-600 dark:text-[#C8F31D]">Up</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <Link
            href="/players"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Players</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard</span>
          </Link>
          <Link
            href="/clubs"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Clubs</span>
          </Link>
          <Link
            href="/tournaments"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tournaments</span>
          </Link>
          <Link
            href="/partners"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <UserCheck className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
            <span>Find Partner</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ⌘K Command Palette Button */}
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-colors"
            title="Search command palette (Ctrl+K / ⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">⌘K</span>
          </button>

          <LanguageSwitcher />

          <ThemeToggle />

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#C8F31D] text-[#1C2A00] hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Now</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
