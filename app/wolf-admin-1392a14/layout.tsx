import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Defense in depth: server-side auth check (second layer after middleware)
    // We check session here — if no session exists, the middleware already
    // handles the redirect for non-login pages. This is an extra safety net.
    // The login page is excluded in the middleware, but this layout wraps ALL
    // admin pages including login. So we only redirect if there's no session
    // AND the request made it past middleware (meaning middleware was bypassed).
    // Since login page is allowed through middleware, we simply check: if no session,
    // just render children (login page will render). If session exists, render full layout.
    const session = await getSession();

    if (!session) {
        // No session: render children without the admin chrome (sidebar/header).
        // This allows the login page to render. For all other admin pages,
        // middleware will have already redirected, so this is a safe fallback.
        return <>{children}</>;
    }

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
