"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  PlussMobilLogo,
  IconHome,
  IconSubscription,
  IconInvoice,
  IconSettings,
  IconLogout,
  IconMenu,
  IconX,
} from "@/components/icons";
import { mockUser } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Oversikt", icon: IconHome },
  { href: "/abonnement/SUB-001", label: "Abonnement", icon: IconSubscription },
  { href: "/fakturaer", label: "Fakturaer", icon: IconInvoice },
  { href: "/innstillinger", label: "Innstillinger", icon: IconSettings },
];

export function PortalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] min-h-screen bg-navy text-white fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/" className="text-white">
            <PlussMobilLogo className="h-8" />
          </Link>
        </div>

        {/* User card */}
        <div className="mx-4 mb-6 p-4 rounded-lg bg-navy-600/50 border border-navy-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-sm">
              {mockUser.firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{mockUser.firstName}</p>
              <p className="text-xs text-navy-300">{mockUser.phone}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? "bg-gold/15 text-gold nav-active"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-6 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200 w-full">
            <IconLogout className="w-5 h-5" />
            Logg ut
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy text-white h-16 flex items-center justify-between px-4">
        <Link href="/" className="text-white">
          <PlussMobilLogo className="h-7" />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Lukk meny" : "Åpne meny"}
        >
          {mobileOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out nav */}
      <div
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-navy text-white z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User card */}
        <div className="mx-4 mt-4 mb-6 p-4 rounded-lg bg-navy-600/50 border border-navy-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-sm">
              {mockUser.firstName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{mockUser.name}</p>
              <p className="text-xs text-navy-300">{mockUser.phone}</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? "bg-gold/15 text-gold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-6">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 w-full">
            <IconLogout className="w-5 h-5" />
            Logg ut
          </button>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border h-[72px] flex items-stretch safe-area-pb">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                active ? "text-navy" : "text-text-muted"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "text-gold" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
