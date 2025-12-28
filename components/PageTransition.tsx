"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useContext } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

const routes: Record<string, number> = {
    "/": 0,
    "/products": 1,
    "/services": 2,
    "/elektronik-finans": 3,
    "/cihaz-tamir": 4,
    "/ikinci-el-alim": 5,
    "/contact": 6,
};

function FrozenRouter({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const frozen = useRef(context).current;

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {children}
        </LayoutRouterContext.Provider>
    );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    // Skip animation for admin routes - they have their own layout
    const isAdminRoute = pathname.startsWith("/wolf-admin-1392a14");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    const getIndex = (path: string) => {
        if (routes[path] !== undefined) {
            return routes[path];
        }
        if (path.startsWith("/products/")) return 1.5;
        return -1;
    };

    const currentIndex = getIndex(pathname);
    const prevIndex = getIndex(prevPathname.current);
    const direction = currentIndex > prevIndex ? 1 : -1;

    useEffect(() => {
        if (pathname !== prevPathname.current) {
            prevPathname.current = pathname;
        }
    }, [pathname]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "30%" : "-30%",
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "30%" : "-30%",
            opacity: 0,
        }),
    };

    return (
        <div className="grid grid-cols-1 grid-rows-1 w-full flex-grow overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={pathname}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.35 },
                        opacity: { duration: 0.25 },
                    }}
                    className="w-full h-full col-start-1 row-start-1 will-change-transform"
                >
                    <FrozenRouter>
                        {children}
                    </FrozenRouter>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
