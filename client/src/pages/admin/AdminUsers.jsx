import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Phone, MapPin, User, Search, Users, Trash2 } from 'lucide-react';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersAPI.getAll();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (currentUser && String(userId) === String(currentUser._id)) {
            alert('You cannot delete your own account.');
            return;
        }
        if (!window.confirm('Delete this user and all of their orders and cart data? This cannot be undone.')) return;
        try {
            setDeletingId(userId);
            await usersAPI.adminDelete(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message || 'Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Users</h1>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-12 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredUsers.map((user) => {
                    const isSelf = currentUser && String(user._id) === String(currentUser._id);
                    return (
                        <div key={user._id} className="bg-white dark:bg-secondary-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center min-w-0">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 flex items-center justify-center text-primary-700 dark:text-primary-400 mr-4 shrink-0 shadow-inner">
                                        <User size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-secondary-900 dark:text-secondary-100 truncate">{user.firstName} {user.lastName}</h3>
                                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400' : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(user._id)}
                                    disabled={deletingId === user._id || isSelf}
                                    className="shrink-0 p-2 text-error-500 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                                    <Mail size={15} className="mr-3 text-secondary-400 dark:text-secondary-500 shrink-0" />
                                    <span className="text-sm truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                                        <Phone size={15} className="mr-3 text-secondary-400 dark:text-secondary-500 shrink-0" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-start text-secondary-600 dark:text-secondary-400">
                                    <MapPin size={15} className="mr-3 mt-0.5 text-secondary-400 dark:text-secondary-500 shrink-0" />
                                    <span className="text-sm">
                                        {user.addresses && user.addresses.length > 0
                                            ? `${user.addresses[0].city}, ${user.addresses[0].country}`
                                            : 'No address provided'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700 text-xs text-secondary-400 dark:text-secondary-500 font-medium">
                                Member since: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-16 text-secondary-500 dark:text-secondary-400">
                    <Users size={48} className="mx-auto mb-4 text-secondary-300 dark:text-secondary-500" />
                    <p className="font-medium">No users found</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
