"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PlussMobilLogo, IconArrowRight } from "@/components/icons";
import { formatPhone } from "@/lib/mock-data";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "99999999";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "")) {
      setLoading(true);
      setTimeout(() => router.push("/"), 1000);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
      setLoading(true);
      setTimeout(() => router.push("/"), 1000);
    }
  };

  const allFilled = code.every((d) => d !== "");

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <Link href="/logg-inn" className="inline-block text-white mb-6">
            <PlussMobilLogo className="h-10 mx-auto" />
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Verifiser
          </h1>
          <p className="text-white/50 text-sm">
            Skriv inn koden vi sendte til{" "}
            <span className="text-gold font-semibold">{formatPhone(phone)}</span>
          </p>
        </div>

        {/* OTP card */}
        <div className="animate-slide-up stagger-1">
          <div className="bg-surface rounded-2xl shadow-2xl shadow-black/25">
            <div className="h-[3px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="p-7">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-4 text-center">
                    Engangskode (6 siffer)
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handlePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`
                          w-12 h-14 text-center text-xl font-bold rounded-xl border-2
                          focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30
                          transition-all tabular-nums
                          ${error
                            ? "border-danger text-danger"
                            : digit
                            ? "border-navy bg-page text-navy"
                            : "border-border text-navy hover:border-navy-400/40"
                          }
                        `}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-3 text-sm text-danger font-medium text-center">{error}</p>
                  )}
                </div>

                <button
                  disabled={loading || !allFilled}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => router.push("/"), 1000);
                  }}
                  className="group w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-dark hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-gold/20 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Logger inn...
                    </span>
                  ) : (
                    <>
                      Logg inn
                      <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button className="text-xs text-text-muted hover:text-navy transition-colors">
                    Ikke mottatt kode?{" "}
                    <span className="font-semibold text-navy-400 underline underline-offset-2">Send på nytt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center animate-fade-in stagger-3">
          <button
            onClick={() => router.back()}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            ← Tilbake til innlogging
          </button>
          <div className="flex items-center justify-center gap-3 text-xs text-white/35 mt-4">
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

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
