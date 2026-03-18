"use client";

import { useState } from "react";
import { mockUser, mockSubscriptions, formatDate } from "@/lib/mock-data";
import { IconCheck } from "@/components/icons";

type Field = { label: string; value: string; key: string; editable?: boolean };

export default function SettingsPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState({
    email: mockUser.email,
    phone: mockUser.phone,
    address: mockUser.address,
    postalCode: mockUser.postalCode,
    city: mockUser.city,
    invoiceDelivery: "epost",
  });
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (key: string) => {
    setEditing(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const personalFields: Field[] = [
    { label: "Navn", value: mockUser.name, key: "name" },
    { label: "E-post", value: values.email, key: "email", editable: true },
    { label: "Telefon", value: values.phone, key: "phone" },
    { label: "Adresse", value: values.address, key: "address", editable: true },
    { label: "Postnummer", value: values.postalCode, key: "postalCode", editable: true },
    { label: "Sted", value: values.city, key: "city", editable: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="animate-fade-in">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          Innstillinger
        </h1>
        <p className="mt-1 text-text-muted text-lg">
          Administrer kontoinformasjon og preferanser
        </p>
      </section>

      {/* Personal info */}
      <section className="animate-slide-up stagger-1">
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Personlig informasjon
        </h2>
        <div className="bg-surface rounded-xl border border-border divide-y divide-border">
          {personalFields.map((field) => (
            <div key={field.key} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-muted">{field.label}</p>
                {editing === field.key ? (
                  <input
                    type="text"
                    value={(values as Record<string, string>)[field.key] ?? field.value}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    className="mt-1 w-full text-sm font-semibold text-navy bg-page border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-semibold text-navy mt-0.5">{field.value}</p>
                )}
              </div>

              <div className="shrink-0">
                {saved === field.key ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                    <IconCheck className="w-4 h-4" />
                    Lagret
                  </span>
                ) : field.editable ? (
                  editing === field.key ? (
                    <button
                      onClick={() => handleSave(field.key)}
                      className="px-4 py-1.5 rounded-lg bg-gold text-navy text-xs font-semibold hover:bg-gold-dark transition-colors"
                    >
                      Lagre
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditing(field.key)}
                      className="px-4 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-muted hover:text-navy hover:border-navy-400 transition-colors"
                    >
                      Endre
                    </button>
                  )
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invoice delivery */}
      <section className="animate-slide-up stagger-2">
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Fakturaleveranse
        </h2>
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "epost", label: "E-post", desc: "Mottar faktura på e-post" },
              { key: "post", label: "Post", desc: "Mottar papirfaktura (+ 39 kr/mnd)" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setValues((v) => ({ ...v, invoiceDelivery: option.key }))}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all
                  ${values.invoiceDelivery === option.key
                    ? "border-gold bg-gold-light"
                    : "border-border hover:border-navy-400"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      values.invoiceDelivery === option.key
                        ? "border-gold bg-gold"
                        : "border-border"
                    }`}
                  >
                    {values.invoiceDelivery === option.key && (
                      <IconCheck className="w-3 h-3 text-navy" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-navy">{option.label}</span>
                </div>
                <p className="text-xs text-text-muted pl-7">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Account info */}
      <section className="animate-slide-up stagger-3">
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Kontoinformasjon
        </h2>
        <div className="bg-surface rounded-xl border border-border divide-y divide-border">
          {[
            { label: "Konto-ID", value: mockUser.accountId },
            { label: "Fakturagruppe", value: mockUser.billingGroupId },
            { label: "Antall abonnementer", value: `${mockSubscriptions.length}` },
            { label: "Kunde siden", value: formatDate(mockSubscriptions[0].startDate) },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-text-muted">{row.label}</span>
              <span className="text-sm font-semibold text-navy font-mono">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="animate-slide-up stagger-4">
        <div className="bg-danger-light/50 rounded-xl border border-danger/20 p-5">
          <h3 className="font-heading font-bold text-danger text-sm">Si opp abonnement</h3>
          <p className="text-xs text-text-muted mt-1 mb-3">
            Du kan si opp abonnementet ditt her. Oppsigelsen trer i kraft ved neste fakturaperiode.
          </p>
          <button className="px-4 py-2 rounded-lg border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/10 transition-colors">
            Si opp abonnement
          </button>
        </div>
      </section>
    </div>
  );
}
