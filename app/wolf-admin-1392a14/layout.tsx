import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#020202] selection:bg-brand-cyan/30 text-slate-200 font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
                {/* Global Ambient Glows */}
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-brand-cyan/5 blur-[150px] rounded-full pointer-events-none" />
                <div className="fixed bottom-0 left-72 w-[800px] h-[800px] bg-brand-violet/5 blur-[150px] rounded-full pointer-events-none" />

                <AdminHeader />
                <main className="flex-grow p-8 overflow-y-auto custom-scrollbar relative z-10 pt-28">
                    {children}
                </main>
            </div>
        </div>
    );
}
