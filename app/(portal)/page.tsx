import Link from "next/link";
import { DataUsageRing } from "@/components/portal/DataUsageRing";
import { AnimatedCounter } from "@/components/portal/AnimatedCounter";
import { UsageBar } from "@/components/portal/UsageBar";
import { SpendingChart } from "@/components/portal/SpendingChart";
import {
  mockUser,
  mockSubscriptions,
  mockInvoices,
  mockUsageBreakdown,
  mockSpendingHistory,
  mockQuickStats,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import {
  IconChevronRight,
  IconSignal,
  IconSim,
  IconArrowRight,
  IconInvoice,
  IconWifi,
  IconSubscription,
  IconShield,
} from "@/components/icons";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "God natt";
  if (hour < 12) return "God morgen";
  if (hour < 17) return "God ettermiddag";
  return "God kveld";
}

export default function DashboardPage() {
  const primary = mockSubscriptions[0];
  const latestInvoice = mockInvoices[0];

  return (
    <div className="space-y-8">
      {/* Greeting hero */}
      <section className="animate-fade-in">
        <p className="text-sm font-medium text-gold-dark mb-1">{getGreeting()}</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {mockUser.firstName} 👋
        </h1>
      </section>

      {/* Quick stats row */}
      <section className="animate-slide-up stagger-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Månedskostnad",
              value: mockQuickStats.totalMonthly,
              suffix: " kr",
              icon: IconInvoice,
              accent: "bg-gold/10 text-gold-dark",
            },
            {
              label: "Neste forfall",
              text: mockQuickStats.nextInvoiceDate,
              icon: IconInvoice,
              accent: "bg-navy/5 text-navy",
            },
            {
              label: "Aktive SIM-kort",
              value: mockQuickStats.activeSims,
              icon: IconSim,
              accent: "bg-success-light text-success",
            },
            {
              label: "Dager til fornyelse",
              value: mockQuickStats.daysUntilRenewal,
              icon: IconSubscription,
              accent: "bg-navy/5 text-navy",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.accent} flex items-center justify-center`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
                {"value" in stat && stat.value !== undefined ? (
                  <p className="font-heading text-xl font-bold text-navy mt-0.5">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                ) : (
                  <p className="font-heading text-base font-bold text-navy mt-0.5 sm:text-lg">
                    {stat.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary subscription hero card */}
      <section className="animate-slide-up stagger-2">
        <div className="bg-navy rounded-2xl overflow-hidden relative">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 plus-pattern opacity-50" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/8 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-navy-400/20 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Left: Plan info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" />
                    Aktiv
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/50 text-sm">{primary.phone}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  {primary.planName}
                </h2>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <IconSignal className="w-4 h-4 text-gold/60" />
                    {primary.speed}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconWifi className="w-4 h-4 text-gold/60" />
                    {primary.dataTotal ? `${primary.dataTotal} GB` : "Ubegrenset data"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconSim className="w-4 h-4 text-gold/60" />
                    {primary.simType === "esim" ? "eSIM" : "SIM-kort"}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-heading font-bold text-gold">
                    <AnimatedCounter value={primary.price} />
                  </span>
                  <span className="text-sm text-gold/60">kr/mnd</span>
                </div>

                <Link
                  href={`/bytt-abonnement/${primary.id}`}
                  className="group inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Bytt abonnement
                  <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Right: Data usage ring */}
              <div className="self-center sm:self-auto">
                <DataUsageRing
                  used={primary.dataUsed}
                  total={primary.dataTotal}
                  size={170}
                  variant="dark"
                />
              </div>
            </div>
          </div>

          {/* Usage breakdown strip */}
          <div className="relative border-t border-white/10 bg-white/[0.03] px-6 sm:px-8 py-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Tale", ...mockUsageBreakdown.calls, color: "bg-gold" },
                { label: "SMS", ...mockUsageBreakdown.sms, color: "bg-navy-300" },
                { label: "MMS", ...mockUsageBreakdown.mms, color: "bg-navy-400" },
                { label: "Data EU/EØS", used: mockUsageBreakdown.dataEu.used, total: mockUsageBreakdown.dataEu.total, unit: mockUsageBreakdown.dataEu.unit, color: "bg-gold" },
              ].map((item, i) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white/70">{item.label}</span>
                    <span className="text-white/40 tabular-nums">
                      {typeof item.used === "number" ? item.used.toLocaleString("nb-NO") : item.used} / {item.total.toLocaleString("nb-NO")} {item.unit}
                    </span>
                  </div>
                  <UsageBar
                    label=""
                    used={item.used}
                    total={item.total}
                    unit=""
                    color={item.color}
                    delay={i * 150 + 500}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary subscriptions + spending chart row */}
      <section className="animate-slide-up stagger-3 grid gap-6 lg:grid-cols-5">
        {/* Secondary subscriptions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-navy">
              Andre abonnementer
            </h2>
          </div>
          {mockSubscriptions.slice(1).map((sub) => (
            <Link
              key={sub.id}
              href={`/abonnement/${sub.id}`}
              className="group bg-surface rounded-xl border border-border p-4 card-hover block"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <DataUsageRing
                    used={sub.dataUsed}
                    total={sub.dataTotal}
                    size={64}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted">{sub.phone}</p>
                  <h3 className="font-heading text-sm font-bold text-navy group-hover:text-navy-400 transition-colors truncate">
                    {sub.planName}
                  </h3>
                  <p className="text-xs text-text-muted">{sub.holderName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-lg font-bold text-navy">
                    {formatCurrency(sub.price)}
                  </p>
                  <p className="text-[10px] text-text-muted">kr/mnd</p>
                </div>
                <IconChevronRight className="w-4 h-4 text-text-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}

          <Link
            href="/bytt-abonnement/new"
            className="group flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-gold hover:bg-gold-light/30 transition-all text-sm font-semibold text-text-muted hover:text-gold-dark"
          >
            <span className="w-6 h-6 rounded-full bg-border group-hover:bg-gold/20 flex items-center justify-center text-lg leading-none transition-colors">+</span>
            Bestill nytt abonnement
          </Link>
        </div>

        {/* Spending chart */}
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-xl border border-border p-5 h-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading text-lg font-bold text-navy">
                Månedlige kostnader
              </h2>
              <span className="text-xs text-text-muted font-medium">Siste 6 mnd</span>
            </div>
            <SpendingChart data={mockSpendingHistory} />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="animate-slide-up stagger-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/fakturaer", label: "Se fakturaer", icon: IconInvoice, accent: "bg-navy/5 text-navy", desc: "Oversikt og PDF" },
            { href: `/bytt-abonnement/${primary.id}`, label: "Bytt abonnement", icon: IconSignal, accent: "bg-gold/10 text-gold-dark", desc: "Sammenlign planer" },
            { href: "/innstillinger", label: "Min profil", icon: IconShield, accent: "bg-success-light text-success", desc: "Kontoinformasjon" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 sm:p-5 bg-surface rounded-xl border border-border card-hover text-center"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${action.accent} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-navy group-hover:text-navy-400 transition-colors">
                {action.label}
              </span>
              <span className="text-[10px] text-text-muted hidden sm:block">{action.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest invoice card */}
      <section className="animate-slide-up stagger-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-navy">
            Siste faktura
          </h2>
          <Link
            href="/fakturaer"
            className="group text-sm font-medium text-navy-400 hover:text-navy transition-colors flex items-center gap-1"
          >
            Se alle
            <IconChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <Link href="/fakturaer" className="block group">
          <div className="bg-surface rounded-xl border border-border overflow-hidden card-hover">
            {/* Status accent */}
            <div className={`h-1 ${latestInvoice.status === "paid" ? "bg-success" : "bg-gold"}`} />

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        latestInvoice.status === "paid"
                          ? "bg-success-light text-success"
                          : latestInvoice.status === "overdue"
                          ? "bg-danger-light text-danger"
                          : "bg-gold-light text-gold-dark"
                      }`}
                    >
                      {latestInvoice.status === "paid"
                        ? "Betalt"
                        : latestInvoice.status === "overdue"
                        ? "Forfalt"
                        : "Ikke betalt"}
                    </span>
                    <span className="text-xs text-text-muted">
                      Forfall {formatDate(latestInvoice.dueDate)}
                    </span>
                  </div>
                  <p className="text-3xl font-heading font-bold text-navy">
                    <AnimatedCounter value={latestInvoice.amount} decimals={2} suffix=" kr" />
                  </p>
                  <p className="text-sm text-text-muted">
                    {latestInvoice.period} — Fakturanr. {latestInvoice.invoiceNumber}
                  </p>
                </div>

                <IconChevronRight className="w-5 h-5 text-text-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all mt-2 shrink-0" />
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
