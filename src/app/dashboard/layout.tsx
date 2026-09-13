import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative z-10 transition-colors duration-300">
      <Sidebar />
      <main className="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:pl-76 lg:pr-8">
        {children}
      </main>
    </div>
  );
}