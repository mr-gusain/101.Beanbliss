import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { Search, Package } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await ordersAPI.getAllAdmin();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400';
            case 'Pending': return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400';
            case 'Failed': return 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400';
            default: return 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300';
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && (
            order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Orders</h1>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-12 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 transition-all"
                    />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {order.user ? (
                                            <div>
                                                <div className="font-semibold text-secondary-900 dark:text-secondary-100">{order.user.firstName} {order.user.lastName}</div>
                                                <div className="text-xs text-secondary-500 dark:text-secondary-400">{order.user.email}</div>
                                            </div>
                                        ) : (
                                            <span className="italic text-secondary-400 dark:text-secondary-500">Deleted User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                                        {order.items.length} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-secondary-900 dark:text-secondary-100">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-secondary-500 dark:text-secondary-400">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">#{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="min-w-0">
                                <p className="text-sm text-secondary-700 dark:text-secondary-300 font-medium truncate">
                                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Deleted User'}
                                </p>
                                <p className="text-xs text-secondary-400 dark:text-secondary-500">{order.items.length} items</p>
                            </div>
                            <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100 shrink-0 ml-4">${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-16 text-secondary-500 dark:text-secondary-400">
                        <Package size={48} className="mx-auto mb-4 text-secondary-300 dark:text-secondary-500" />
                        <p className="font-medium">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
