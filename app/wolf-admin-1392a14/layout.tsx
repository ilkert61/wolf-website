import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0f1115]">
            <AdminSidebar />

            <div className="flex-1 ml-72 flex flex-col min-h-screen">
                <AdminHeader />
                <main className="flex-grow p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
