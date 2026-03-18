export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-navy-400/20 blur-[80px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gold/[0.03] blur-[60px] animate-pulse-soft" style={{ animationDelay: "0.5s" }} />

      {/* Plus pattern overlay */}
      <div className="absolute inset-0 plus-pattern opacity-40" />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,197,24,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
