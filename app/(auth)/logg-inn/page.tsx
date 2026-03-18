"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlussMobilLogo, IconArrowRight } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    if (digits.length > 3) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return digits;
  };

  const isValid = phone.replace(/\s/g, "").length === 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\s/g, "");
    if (!/^[49]\d{7}$/.test(digits)) {
      setError("Ugyldig norsk mobilnummer");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      router.push(`/verifiser?phone=${digits}`);
    }, 800);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px]">
        {/* Logo & header */}
        <div className="text-center mb-10 animate-fade-in">
          <Link href="/" className="inline-block text-white mb-8">
            <PlussMobilLogo className="h-10 mx-auto" />
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Velkommen tilbake
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Logg inn på Min Side for å administrere<br className="hidden sm:block" /> ditt PlussMobil-abonnement
          </p>
        </div>

        {/* Login card */}
        <div className="animate-slide-up stagger-1">
          <div
            className={`bg-surface rounded-2xl shadow-2xl shadow-black/25 transition-all duration-300 ${
              focused ? "ring-2 ring-gold/20 shadow-gold/5" : ""
            }`}
          >
            {/* Subtle top accent */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="p-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-navy mb-2.5"
                  >
                    Mobilnummer
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {/* Norwegian flag mini */}
                      <span className="text-sm">🇳🇴</span>
                      <span className="text-text-muted text-sm font-medium">+47</span>
                      <span className="w-px h-5 bg-border ml-0.5" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="999 99 999"
                      value={phone}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onChange={(e) => {
                        setPhone(formatPhoneInput(e.target.value));
                        setError("");
                      }}
                      className={`
                        w-full pl-[88px] pr-4 py-4 rounded-xl border-2 text-navy text-lg font-semibold
                        placeholder:text-text-muted/30 placeholder:font-normal
                        focus:outline-none focus:border-gold
                        transition-colors tabular-nums tracking-widest
                        ${error ? "border-danger bg-danger-light/30" : "border-border hover:border-navy-400/30"}
                      `}
                      autoFocus
                    />
                    {isValid && !error && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-success flex items-center justify-center animate-scale-in">
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-2.5 text-sm text-danger font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="group w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-dark hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-gold/20 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sender kode...
                    </span>
                  ) : (
                    <>
                      Send engangskode
                      <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-8 text-center space-y-3 animate-fade-in stagger-3">
          <p className="text-xs text-white/40 leading-relaxed">
            Vi sender en engangskode via SMS til ditt mobilnummer.<br />
            Ingen passord å huske.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-white/35">
            <span>Personvern</span>
            <span>•</span>
            <span>Vilkår</span>
            <span>•</span>
            <span>Hjelp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
