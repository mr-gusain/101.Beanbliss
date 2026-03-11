import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/admin/products', icon: Package, label: 'Products' },
        { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { to: '/admin/users', icon: Users, label: 'Users' },
    ];

    return (
        <div className="pt-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
            {/* Mobile Header Bar */}
            <div className="lg:hidden sticky z-30 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 px-4 py-3 flex items-center justify-between shadow-sm" style={{ top: '60px' }}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 rounded-xl text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                        aria-label="Open Admin Menu"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-secondary-900 dark:text-white">Admin Panel</span>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-20 left-0 z-50 w-64 h-[calc(100vh-5rem)] bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-800">
                    <h2 className="font-bold text-lg text-secondary-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-primary-600 dark:text-primary-400" />
                        Admin Panel
                    </h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-1 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-secondary-100 dark:border-secondary-800">
                    <button
                        onClick={() => navigate('/account')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100 transition-all w-full"
                    >
                        <ArrowLeft size={18} />
                        Back to Store
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 md:p-8 lg:p-10 min-h-[calc(100vh-5rem-4rem)] lg:min-h-[calc(100vh-5rem)] transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
