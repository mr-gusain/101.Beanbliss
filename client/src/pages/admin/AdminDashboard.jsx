import { useState, useEffect } from 'react';
import { usersAPI, ordersAPI, productsAPI } from '../../services/api';
import { Users, ShoppingBag, Package, IndianRupee, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        products: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, orders, products] = await Promise.all([
                    usersAPI.getAll(),
                    ordersAPI.getAllAdmin(),
                    productsAPI.getAll()
                ]);

                const revenue = orders.reduce((acc, order) => {
                    return acc + (order.paymentStatus === 'Paid' ? order.total : 0);
                }, 0);

                setStats({
                    users: users.length,
                    orders: orders.length,
                    products: products.length,
                    revenue
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₹${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: IndianRupee,
            color: 'green',
            trend: '+12.5%',
            trendLabel: 'from last month'
        },
        {
            label: 'Total Orders',
            value: stats.orders,
            icon: ShoppingBag,
            color: 'blue',
            trend: '+8.2%',
            trendLabel: 'from last month'
        },
        {
            label: 'Total Products',
            value: stats.products,
            icon: Package,
            color: 'purple',
            trend: null,
            trendLabel: 'Active inventory'
        },
        {
            label: 'Total Users',
            value: stats.users,
            icon: Users,
            color: 'orange',
            trend: '+24.3%',
            trendLabel: 'from last month'
        }
    ];

    const colorMap = {
        green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', trend: 'text-green-600 dark:text-green-400' },
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', trend: 'text-blue-600 dark:text-blue-400' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', trend: 'text-gray-500 dark:text-gray-400' },
        orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', trend: 'text-orange-600 dark:text-orange-400' }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1 text-sm sm:text-base">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map(({ label, value, icon: Icon, color, trend, trendLabel }) => {
                    const colors = colorMap[color];
                    return (
                        <div key={label} className="bg-white dark:bg-secondary-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 transition-transform hover:scale-[1.02]">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1 truncate">{label}</p>
                                    <h3 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white truncate">{value}</h3>
                                </div>
                                <div className={`p-2.5 sm:p-3 ${colors.bg} rounded-xl ${colors.text} shrink-0 ml-3`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                            <div className={`mt-3 sm:mt-4 flex items-center text-sm ${colors.trend}`}>
                                {trend ? (
                                    <>
                                        <TrendingUp size={16} className="mr-1 shrink-0" />
                                        <span className="font-medium">{trend}</span>
                                        <span className="text-secondary-400 dark:text-secondary-500 ml-1 truncate">{trendLabel}</span>
                                    </>
                                ) : (
                                    <span className="font-medium text-secondary-900 dark:text-secondary-300">{trendLabel}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-secondary-100 dark:border-secondary-700 flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-bold text-secondary-900 dark:text-white">Recent Orders</h2>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">View All</button>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest/Deleted'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-secondary-900 dark:text-secondary-100">
                                        ₹{order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.paymentStatus === 'Paid'
                                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                                            : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-secondary-500 dark:text-secondary-400">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="sm:hidden p-4 space-y-3">
                    {recentOrders.map((order) => (
                        <div key={order._id} className="bg-secondary-50 dark:bg-secondary-700/50 rounded-xl p-4 border border-secondary-100 dark:border-secondary-600">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">#{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.paymentStatus === 'Paid'
                                    ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                                    : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                                </p>
                                <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">₹{order.total.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    {recentOrders.length === 0 && (
                        <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
                            No orders found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
