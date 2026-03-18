import { PortalNav } from "@/components/portal/PortalNav";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <PortalNav />

      {/* Main content — offset by sidebar on desktop, by header on mobile */}
      <main className="lg:ml-[260px] pt-16 lg:pt-0 pb-[72px] lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
