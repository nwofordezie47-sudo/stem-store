import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative z-10 transition-colors duration-300">
      <Sidebar />
      <main className="pl-76 pr-8 pt-28 pb-12">
        {children}
      </main>
    </div>
  );
}