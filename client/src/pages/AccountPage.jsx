import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, CreditCard, LogOut, MapPin, Bell, Edit, ChevronRight, LayoutDashboard, Search, Filter, Trash2, Plus, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, usersAPI } from '../services/api';
import { gsap } from 'gsap';
import { getImageUrl } from '../utils/imageUtils';

const AccountPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, refetchUser } = useAuth();
  const contentRef = useRef(null);
  const navigate = useNavigate();

  // Address State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Payment Method State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'Credit Card',
    last4: '',
    brand: '',
    expiryDate: '',
    isDefault: false
  });


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const handleSectionSwitch = (e) => {
      if (e.detail) {
        setActiveSection(e.detail);
      }
    };
    window.addEventListener('switchAccountSection', handleSectionSwitch);
    return () => window.removeEventListener('switchAccountSection', handleSectionSwitch);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        }
      );
    }
  }, [activeSection]);

  const handleLogout = () => {
    const logoutAnimation = gsap.timeline();
    logoutAnimation
      .to('.account-container', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        force3D: true
      })
      .add(() => {
        logout();
        navigate('/');
      });
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="profile-section bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Profile Information
          </h3>
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl border border-secondary-100 dark:border-secondary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1 font-medium uppercase tracking-wider">Full Name</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">{user?.firstName} {user?.lastName}</p>
          </div>
          <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl border border-secondary-100 dark:border-secondary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1 font-medium uppercase tracking-wider">Email Address</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">{user?.email}</p>
          </div>
          <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl border border-secondary-100 dark:border-secondary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1 font-medium uppercase tracking-wider">Phone Number</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl border border-secondary-100 dark:border-secondary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1 font-medium uppercase tracking-wider">Member Since</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '(Not available)'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Recent Orders
          </h3>
          <button
            onClick={() => setActiveSection('orders')}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 group"
          >
            View All Orders <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order._id} className="flex flex-col sm:flex-row justify-between items-center p-5 bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 rounded-xl hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900 dark:text-secondary-100">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.paymentStatus === 'Paid' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                    }`}>
                    {order.paymentStatus}
                  </span>
                  <p className="font-bold text-secondary-900 dark:text-secondary-100 text-lg">${order.total.toFixed(2)}</p>
                  <ChevronRight size={20} className="text-secondary-400 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary-50 dark:bg-secondary-700/30 rounded-xl border-dashed border-2 border-secondary-200 dark:border-secondary-600">
            <Package size={48} className="mx-auto text-secondary-300 dark:text-secondary-500 mb-4" />
            <p className="text-secondary-600 dark:text-secondary-400 font-medium">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Order History
        </h3>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
            />
          </div>
          <button className="p-2 border border-secondary-200 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-secondary-500 dark:text-secondary-400">Loading your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-secondary-200 dark:border-secondary-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-secondary-800">
              <div className="bg-secondary-50 dark:bg-secondary-700/50 p-6 border-b border-secondary-200 dark:border-secondary-600 flex flex-wrap justify-between items-center gap-6">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100 mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium hover:underline">
                    View Invoice
                  </button>
                </div>
              </div>
              <div className="p-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-wrap justify-between items-center py-4 border-b border-secondary-100 dark:border-secondary-700 last:border-0 gap-4">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg flex items-center justify-center border border-secondary-200 dark:border-secondary-600 shrink-0">
                        {item.product?.image ? (
                          <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Package size={24} className="text-secondary-400 dark:text-secondary-500" />
                        )}
                      </div>
                      <div>
                        <Link to={`/products/${item.product?._id}`} className="font-bold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg mb-1 block">
                          {item.product?.name || 'Unknown Product'}
                        </Link>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary-900 dark:text-secondary-100 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium mt-1">
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary-50 dark:bg-secondary-700/30 rounded-2xl border-2 border-dashed border-secondary-200 dark:border-secondary-600">
          <div className="w-20 h-20 bg-white dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package size={40} className="text-secondary-300 dark:text-secondary-500" />
          </div>
          <h4 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">No orders placed yet</h4>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-sm mx-auto">Once you place your first order, it will appear here for you to track and manage.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-500/25"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await usersAPI.updateAddress(editingAddressId, addressForm);
      } else {
        await usersAPI.addAddress(addressForm);
      }
      await refetchUser();
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ type: 'Home', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await usersAPI.deleteAddress(id);
        await refetchUser();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const renderAddresses = () => (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Saved Addresses</h3>
        <button
          onClick={() => {
            setEditingAddressId(null);
            setAddressForm({ type: 'Home', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
            setShowAddressForm(!showAddressForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 font-medium"
        >
          {showAddressForm ? <X size={18} /> : <Plus size={18} />}
          {showAddressForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showAddressForm && (
        <form onSubmit={handleAddressSubmit} className="mb-8 p-6 bg-secondary-50 dark:bg-secondary-700/30 rounded-xl border border-secondary-200 dark:border-secondary-600 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Address Type</label>
              <select
                value={addressForm.type}
                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Street Address</label>
              <input
                type="text"
                required
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">City</label>
              <input
                type="text"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">State/Province</label>
              <input
                type="text"
                required
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">ZIP/Postal Code</label>
              <input
                type="text"
                required
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Country</label>
              <input
                type="text"
                required
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="isDefault"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="text-secondary-700 dark:text-secondary-300 font-medium select-none">Set as default address</label>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="px-6 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 font-medium"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses?.length > 0 ? (
          user.addresses.map((address) => (
            <div key={address._id} className="p-6 bg-secondary-50 dark:bg-secondary-700/30 rounded-xl border border-secondary-200 dark:border-secondary-600 relative group hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-900 dark:text-white">{address.type}</h4>
                    {address.isDefault && <span className="text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-medium">Default</span>}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setAddressForm(address);
                      setEditingAddressId(address._id);
                      setShowAddressForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                {address.street}<br />
                {address.city}, {address.state} {address.zipCode}<br />
                {address.country}
              </p>
            </div>
          ))
        ) : !showAddressForm && (
          <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed border-secondary-200 dark:border-secondary-600 rounded-xl">
            <MapPin size={40} className="mx-auto text-secondary-300 dark:text-secondary-500 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">No addresses saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.addPaymentMethod(paymentForm);
      await refetchUser();
      setShowPaymentForm(false);
      setPaymentForm({ type: 'Credit Card', last4: '', brand: '', expiryDate: '', isDefault: false });
    } catch (error) {
      console.error('Failed to save payment method:', error);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await usersAPI.deletePaymentMethod(id);
        await refetchUser();
      } catch (error) {
        console.error('Failed to delete payment method:', error);
      }
    }
  };

  const renderPaymentMethods = () => (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Payment Methods</h3>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 font-medium"
        >
          {showPaymentForm ? <X size={18} /> : <Plus size={18} />}
          {showPaymentForm ? 'Cancel' : 'Add New Card'}
        </button>
      </div>

      {showPaymentForm && (
        <form onSubmit={handlePaymentSubmit} className="mb-8 p-6 bg-secondary-50 dark:bg-secondary-700/30 rounded-xl border border-secondary-200 dark:border-secondary-600 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Card Type</label>
              <select
                value={paymentForm.type}
                onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Card Number (Last 4 Digits)</label>
              <input
                type="text"
                required
                maxLength="4"
                pattern="\d{4}"
                value={paymentForm.last4}
                onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Card Brand</label>
              <select
                value={paymentForm.brand}
                onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Brand</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="Amex">Amex</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Expiry Date</label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={paymentForm.expiryDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="isPaymentDefault"
              checked={paymentForm.isDefault}
              onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
              className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPaymentDefault" className="text-secondary-700 dark:text-secondary-300 font-medium select-none">Set as default payment method</label>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="px-6 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 font-medium"
            >
              Save Card
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.paymentMethods?.length > 0 ? (
          user.paymentMethods.map((method) => (
            <div key={method._id} className="p-6 bg-gradient-to-br from-secondary-800 to-secondary-900 text-white rounded-xl shadow-lg relative group">
              <div className="flex justify-between items-start mb-8">
                <CreditCard size={32} className="opacity-80" />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeletePayment(method._id)}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-mono text-xl tracking-widest">**** **** **** {method.last4}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-wider mb-1">Card Holder</p>
                  <p className="font-medium text-secondary-100">{user?.firstName} {user?.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary-400 uppercase tracking-wider mb-1">Expires</p>
                  <p className="font-medium text-secondary-100">{method.expiryDate}</p>
                </div>
              </div>
              <div className="absolute top-4 right-14">
                {method.brand}
              </div>
              {method.isDefault && (
                <div className="absolute bottom-4 right-4 bg-primary-500 text-white text-xs px-2 py-0.5 rounded">Default</div>
              )}
            </div>
          ))
        ) : !showPaymentForm && (
          <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed border-secondary-200 dark:border-secondary-600 rounded-xl">
            <CreditCard size={40} className="mx-auto text-secondary-300 dark:text-secondary-500 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">No payment methods saved.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 border border-secondary-100 dark:border-secondary-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Notifications</h3>
        {user?.notifications?.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await usersAPI.markAllNotificationsRead();
                await refetchUser();
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Mark all read
            </button>
            <span className="text-secondary-300">|</span>
            <button
              onClick={async () => {
                if (window.confirm("Clear all notifications?")) {
                  await usersAPI.clearNotifications();
                  await refetchUser();
                }
              }}
              className="text-sm text-error-600 dark:text-error-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {user?.notifications?.length > 0 ? (
          user.notifications.slice().reverse().map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-xl border ${notification.read ? 'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700' : 'bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800'} transition-all relative group`}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'order_success' ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400' :
                  notification.type === 'order_cancelled' ? 'bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400' :
                    'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  }`}>
                  {notification.type === 'order_success' ? <Check size={20} /> :
                    notification.type === 'order_cancelled' ? <AlertCircle size={20} /> :
                      <Bell size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold ${notification.read ? 'text-secondary-900 dark:text-secondary-100' : 'text-primary-900 dark:text-primary-100'}`}>{notification.title}</h4>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className={`text-sm mt-1 ${notification.read ? 'text-secondary-600 dark:text-secondary-400' : 'text-secondary-800 dark:text-secondary-200'}`}>{notification.message}</p>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await usersAPI.markNotificationRead(notification._id);
                    await refetchUser();
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-xs bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded transition-opacity"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-secondary-200 dark:border-secondary-600 rounded-xl">
            <Bell size={40} className="mx-auto text-secondary-300 dark:text-secondary-500 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="account-container">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-10 tracking-tight">
            My Account
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 p-6 sticky top-28">
                <div className="flex items-center mb-8 pb-8 border-b border-secondary-100 dark:border-secondary-700">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-700 dark:text-primary-400 flex items-center justify-center mr-4 shadow-inner ring-4 ring-white dark:ring-secondary-800">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-secondary-900 dark:text-secondary-100 leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mt-1 bg-secondary-100 dark:bg-secondary-700 inline-block px-2 py-0.5 rounded">
                      {user?.role === 'admin' ? 'Admin' : 'Member'}
                    </p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'overview'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium'
                      }`}
                  >
                    <User size={20} className={`mr-3 ${activeSection === 'overview' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
                    Overview
                  </button>

                  <button
                    onClick={() => setActiveSection('orders')}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'orders'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium'
                      }`}
                  >
                    <Package size={20} className={`mr-3 ${activeSection === 'orders' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
                    My Orders
                  </button>

                  <button
                    onClick={() => setActiveSection('addresses')}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'addresses'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium'
                      }`}
                  >
                    <MapPin size={20} className={`mr-3 ${activeSection === 'addresses' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
                    Addresses
                  </button>

                  <button
                    onClick={() => setActiveSection('payment')}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'payment'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium'
                      }`}
                  >
                    <CreditCard size={20} className={`mr-3 ${activeSection === 'payment' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
                    Payment Methods
                  </button>

                  <button
                    onClick={() => setActiveSection('notifications')}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${activeSection === 'notifications'
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium'
                      }`}
                  >
                    <div className="relative mr-3">
                      <Bell size={20} className={`${activeSection === 'notifications' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'}`} />
                      {user?.notifications?.some(n => !n.read) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full border border-white dark:border-secondary-800"></span>
                      )}
                    </div>
                    Notifications
                  </button>

                  {(user?.role === 'admin' || user?.role === 'Admin') && (
                    <div className="pt-4 mt-4 border-t border-secondary-100 dark:border-secondary-700">
                      <button
                        onClick={() => navigate('/admin')}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-left text-accent-700 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 font-semibold transition-all"
                      >
                        <LayoutDashboard size={20} className="mr-3 text-accent-600 dark:text-accent-400" />
                        Admin Dashboard
                      </button>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-secondary-100 dark:border-secondary-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-xl text-left text-secondary-600 dark:text-secondary-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-600 dark:hover:text-error-400 font-medium transition-all"
                    >
                      <LogOut size={20} className="mr-3 text-secondary-400 dark:text-secondary-500 group-hover:text-error-500" />
                      Log Out
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div ref={contentRef} className="flex-1">
              {activeSection === 'overview' && renderOverview()}
              {activeSection === 'orders' && renderOrders()}
              {activeSection === 'addresses' && renderAddresses()}
              {activeSection === 'payment' && renderPaymentMethods()}
              {activeSection === 'notifications' && renderNotifications()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;