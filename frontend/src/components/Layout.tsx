import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/features/theme/ThemeToggleButton";
import { toast } from "sonner";

const Layout = () => {
    const handleLogout = () => {
        const user = localStorage.getItem('user');
        if (user) {
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            window.location.href = '/';
        }
    };

    const isLoggedIn = localStorage.getItem('user');

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-background sticky top-0 z-50 border-b border-border px-4 py-3 flex items-center justify-between h-12">
                <div className="flex items-center">
                    <img
                        onClick={() => navigate('/')}
                        src="/kodnest-logo.png"
                        alt="KodNest Logo"
                        className="h-8 w-auto"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggleButton />
                    {isLoggedIn && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-muted/50 border-t border-border px-4 py-3 text-center">
                <p className="text-sm text-muted-foreground">
                    All rights reserved
                </p>
            </footer>
        </div>
    );
};

export default Layout;