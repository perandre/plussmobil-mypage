"use client";

import Link from "next/link";
import { use, useState } from "react";
import { mockSubscriptions, mockPlans, formatCurrency } from "@/lib/mock-data";
import { IconCheck, IconSignal, IconArrowRight } from "@/components/icons";

export default function ChangePlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const sub = mockSubscriptions.find((s) => s.id === id) ?? mockSubscriptions[0];
  const [selectedGroup, setSelectedGroup] = useState<"fri-data" | "standard">("fri-data");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const filteredPlans = mockPlans.filter((p) => p.group === selectedGroup);
  const currentVariantId = sub.variantId;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="animate-fade-in">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-navy transition-colors">Oversikt</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/abonnement/${id}`} className="hover:text-navy transition-colors">Abonnement</Link>
          </li>
          <li>/</li>
          <li className="text-navy font-medium">Bytt abonnement</li>
        </ol>
      </nav>

      {/* Header */}
      <section className="animate-slide-up">
        <h1 className="font-heading text-3xl font-bold text-navy">
          Bytt abonnement
        </h1>
        <p className="mt-1 text-text-muted text-lg">
          Velg et nytt abonnement for {sub.phone}
        </p>
      </section>

      {/* Current plan badge */}
      <section className="animate-slide-up stagger-1">
        <div className="inline-flex items-center gap-3 bg-navy/5 rounded-xl px-5 py-3">
          <span className="text-sm text-text-muted">Nåværende:</span>
          <span className="font-heading font-bold text-navy">{sub.planName}</span>
          <span className="text-sm text-text-muted">—</span>
          <span className="font-semibold text-navy">{formatCurrency(sub.price)} kr/mnd</span>
        </div>
      </section>

      {/* Group toggle */}
      <section className="animate-slide-up stagger-2">
        <div className="inline-flex bg-cream-dark rounded-xl p-1">
          {[
            { key: "fri-data" as const, label: "Fri Data" },
            { key: "standard" as const, label: "Med datapakke" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedGroup(tab.key)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                selectedGroup === tab.key
                  ? "bg-surface text-navy shadow-sm"
                  : "text-text-muted hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Plan cards */}
      <section className="animate-slide-up stagger-3">
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPlans.map((plan) => {
            const isCurrent = plan.variantId === currentVariantId;
            const isSelected = selectedPlan === plan.id;
            const priceDiff = plan.price - sub.price;

            return (
              <button
                key={plan.id}
                onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                disabled={isCurrent}
                className={`
                  relative text-left p-6 rounded-2xl border-2 transition-all duration-200
                  ${isCurrent
                    ? "border-navy bg-navy/5 cursor-default"
                    : isSelected
                    ? "border-gold bg-gold-light shadow-lg scale-[1.02]"
                    : "border-border bg-surface hover:border-navy-400 hover:shadow-md card-hover"
                  }
                `}
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-navy text-white text-xs font-semibold">
                      <IconCheck className="w-3 h-3" />
                      Ditt abonnement
                    </span>
                  )}
                  {plan.popular && !isCurrent && (
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-gold text-navy text-xs font-semibold">
                      Populær
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-xl font-bold text-navy">
                  {plan.name}
                </h3>

                <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
                  <IconSignal className="w-4 h-4" />
                  {plan.speed}
                </div>

                <p className="mt-4 mb-4">
                  <span className="text-3xl font-heading font-bold text-navy">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-sm text-text-muted"> kr/mnd</span>
                  {!isCurrent && priceDiff !== 0 && (
                    <span className={`ml-2 text-xs font-semibold ${priceDiff > 0 ? "text-danger" : "text-success"}`}>
                      {priceDiff > 0 ? "+" : ""}{formatCurrency(priceDiff)} kr
                    </span>
                  )}
                </p>

                <ul className="space-y-2">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-text-muted">
                      <IconCheck className="w-4 h-4 text-success shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      {/* Confirm button */}
      {selectedPlan && (
        <section className="animate-scale-in sticky bottom-20 lg:bottom-4 z-30">
          <div className="bg-surface rounded-2xl border border-border shadow-xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">Valgt abonnement</p>
              <p className="font-heading font-bold text-navy text-lg">
                {mockPlans.find((p) => p.id === selectedPlan)?.name}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-navy font-semibold hover:bg-gold-dark transition-colors text-sm whitespace-nowrap">
              Bekreft bytte
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
