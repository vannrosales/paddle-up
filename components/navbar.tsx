"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, LayoutDashboard, UserPlus, LogIn } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/players"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Players Directory</span>
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
        <div className="flex items-center gap-3">
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
