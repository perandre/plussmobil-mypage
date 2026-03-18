import Link from "next/link";
import { AnimatedCounter } from "@/components/portal/AnimatedCounter";
import { mockInvoices, mockUser, formatCurrency, formatDate } from "@/lib/mock-data";
import { IconDownload, IconChevronRight } from "@/components/icons";

export default function InvoicesPage() {
  const latestInvoice = mockInvoices[0];
  const previousInvoices = mockInvoices.slice(1);

  const statusConfig = {
    paid: { label: "Betalt", bg: "bg-success-light", text: "text-success", accent: "bg-success" },
    unpaid: { label: "Ikke betalt", bg: "bg-gold-light", text: "text-gold-dark", accent: "bg-gold" },
    overdue: { label: "Forfalt", bg: "bg-danger-light", text: "text-danger", accent: "bg-danger" },
  };

  const latest = statusConfig[latestInvoice.status];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="animate-fade-in">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          Fakturaer
        </h1>
        <p className="mt-1 text-text-muted">
          Fakturagruppe {mockUser.billingGroupId} — {mockUser.name}
        </p>
      </section>

      {/* Latest invoice hero */}
      <section className="animate-slide-up stagger-1">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {/* Accent bar */}
          <div className={`h-1.5 ${latest.accent}`} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-lg font-bold text-navy">
                    Siste faktura
                  </h2>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${latest.bg} ${latest.text}`}>
                    {latest.label}
                  </span>
                </div>

                <p className="text-4xl sm:text-5xl font-heading font-bold text-navy tracking-tight">
                  <AnimatedCounter value={latestInvoice.amount} decimals={2} />
                  <span className="text-lg font-normal text-text-muted ml-1">kr</span>
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-muted">
                  <span>Forfall <span className="font-semibold text-navy">{formatDate(latestInvoice.dueDate)}</span></span>
                  <span className="text-border">|</span>
                  <span>Fakturanr. {latestInvoice.invoiceNumber}</span>
                  <span className="text-border">|</span>
                  <span>{latestInvoice.period}</span>
                </div>
              </div>

              <button className="group flex items-center gap-2.5 px-5 py-3 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-600 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0">
                <IconDownload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Last ned PDF
              </button>
            </div>

            {latestInvoice.status !== "paid" && (
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <span className="text-sm text-text-muted">Utestående beløp</span>
                <span className="font-heading font-bold text-2xl text-navy">
                  <AnimatedCounter
                    value={latestInvoice.amount - latestInvoice.amountPaid}
                    decimals={2}
                    suffix=" kr"
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Invoice history */}
      <section className="animate-slide-up stagger-2">
        <h2 className="font-heading text-lg font-bold text-navy mb-4">
          Tidligere fakturaer
        </h2>

        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-page/60 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
            <span>Periode</span>
            <span>Fakturanr.</span>
            <span>Forfallsdato</span>
            <span className="text-right">Beløp</span>
            <span className="w-28" />
          </div>

          <div className="divide-y divide-border">
            {previousInvoices.map((invoice, i) => (
              <div
                key={invoice.id}
                className={`group sm:grid sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] sm:gap-4 px-5 py-4 hover:bg-gold-light/20 transition-colors animate-slide-up`}
                style={{ animationDelay: `${i * 60 + 200}ms` }}
              >
                {/* Mobile layout */}
                <div className="sm:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-navy">{invoice.period}</span>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-success-light text-success text-xs font-bold">
                      Betalt
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Nr. {invoice.invoiceNumber}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-bold text-navy">
                        {formatCurrency(invoice.amount)} kr
                      </span>
                      <button className="p-1.5 rounded-lg bg-page text-text-muted hover:text-navy transition-colors">
                        <IconDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <span className="hidden sm:flex items-center text-sm font-semibold text-navy">
                  {invoice.period}
                </span>
                <span className="hidden sm:flex items-center text-sm text-text-muted font-mono">
                  {invoice.invoiceNumber}
                </span>
                <span className="hidden sm:flex items-center text-sm text-text-muted">
                  {formatDate(invoice.dueDate)}
                </span>
                <span className="hidden sm:flex items-center justify-end text-sm font-heading font-bold text-navy tabular-nums">
                  {formatCurrency(invoice.amount)} kr
                </span>
                <div className="hidden sm:flex items-center justify-end gap-2 w-28">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-success-light text-success text-[11px] font-bold">
                    Betalt
                  </span>
                  <button className="p-2 rounded-lg hover:bg-page transition-colors text-text-muted hover:text-navy group-hover:text-navy-400">
                    <IconDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
