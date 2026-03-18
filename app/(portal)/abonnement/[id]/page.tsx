import Link from "next/link";
import { DataUsageRing } from "@/components/portal/DataUsageRing";
import {
  mockSubscriptions,
  mockServices,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import {
  IconArrowRight,
  IconSignal,
  IconSim,
  IconWifi,
  IconShield,
  IconGlobe,
  IconCheck,
} from "@/components/icons";

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sub = mockSubscriptions.find((s) => s.id === id) ?? mockSubscriptions[0];

  const categoryIcons = {
    security: IconShield,
    data: IconWifi,
    international: IconGlobe,
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="animate-fade-in">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-navy transition-colors">
              Oversikt
            </Link>
          </li>
          <li>/</li>
          <li className="text-navy font-medium">Abonnement</li>
        </ol>
      </nav>

      {/* Plan header */}
      <section className="animate-slide-up stagger-1">
        <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white overflow-hidden relative plus-pattern">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold/5 blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" />
                  {sub.status === "active" ? "Aktiv" : "Suspendert"}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                {sub.planName}
              </h1>

              <p className="text-lg text-white/70">{sub.phone} — {sub.holderName}</p>

              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <IconSignal className="w-4 h-4 text-gold/70" />
                  {sub.speed}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconWifi className="w-4 h-4 text-gold/70" />
                  {sub.dataTotal ? `${sub.dataTotal} GB` : "Ubegrenset data"}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconSim className="w-4 h-4 text-gold/70" />
                  {sub.simType === "esim" ? "eSIM" : "Fysisk SIM"}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <p className="text-3xl font-heading font-bold text-gold">
                  {formatCurrency(sub.price)}{" "}
                  <span className="text-base font-normal text-gold/70">kr/mnd</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/bytt-abonnement/${sub.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-navy text-sm font-semibold hover:bg-gold-dark transition-colors"
                >
                  Bytt abonnement
                  <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="self-center sm:self-auto">
              <DataUsageRing
                used={sub.dataUsed}
                total={sub.dataTotal}
                size={170}
                variant="dark"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription details grid */}
      <section className="animate-slide-up stagger-2">
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Abonnementdetaljer
        </h2>
        <div className="bg-surface rounded-xl border border-border divide-y divide-border">
          {[
            { label: "Abonnement", value: sub.planName },
            { label: "Telefonnummer", value: sub.phone },
            { label: "Abonnent", value: sub.holderName },
            { label: "SIM-type", value: sub.simType === "esim" ? "eSIM" : "Fysisk SIM-kort" },
            { label: "Startdato", value: formatDate(sub.startDate) },
            { label: "Datahastighet", value: sub.speed },
            { label: "Inkludert tale", value: "Fri tale, SMS og MMS" },
            { label: "EU/EØS-data", value: sub.dataTotal ? `${Math.round(sub.dataTotal * 2.5)} GB` : "100 GB" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-text-muted">{row.label}</span>
              <span className="text-sm font-semibold text-navy">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="animate-slide-up stagger-3">
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Tjenester
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {mockServices.map((service) => {
            const Icon = categoryIcons[service.category];
            return (
              <div
                key={service.id}
                className="bg-surface rounded-xl border border-border p-5 flex gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    service.active ? "bg-success-light text-success" : "bg-page text-text-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-navy">{service.name}</h3>
                    {service.active && (
                      <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                        <IconCheck className="w-3 h-3" />
                        Aktiv
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{service.description}</p>
                  <p className="text-xs font-semibold text-navy mt-2">
                    {service.price === 0 ? "Inkludert" : `${formatCurrency(service.price)} kr/mnd`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
