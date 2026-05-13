import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import { Plus, Edit, Trash2, X, Search, Image as ImageIcon, Star } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        featured: false,
        rating: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image,
            featured: product.featured || false,
            rating: product.rating || 0
        });
        setIsEditing(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
        }
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: '',
            featured: false,
            rating: 0
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('featured', formData.featured);
            data.append('rating', formData.rating);
            data.append('image', formData.image);

            if (currentProduct) {
                await productsAPI.update(currentProduct._id, data);
            } else {
                await productsAPI.create(data);
            }
            setIsEditing(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.message || 'Failed to save product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputClasses = "w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 transition-all";

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
                <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">Products</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 text-sm"
                >
                    <Plus size={18} className="mr-2" />
                    Add Product
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white dark:bg-secondary-800 p-5 sm:p-8 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white">{currentProduct ? 'Edit Product' : 'New Product'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-secondary-400 dark:text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 p-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                            <X size={22} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={inputClasses}
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className={inputClasses}
                                required min="0" step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className={inputClasses}
                                required min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Rating</label>
                            <div className="flex gap-1 py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={24}
                                            className={`${star <= formData.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-secondary-300 dark:text-secondary-600'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-secondary-500 dark:text-secondary-400 flex items-center">
                                    ({formData.rating} stars)
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={inputClasses}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Hot Drinks">Hot Drinks</option>
                                <option value="Cold Drinks">Cold Drinks</option>
                                <option value="Pastries & Treats">Pastries & Treats</option>
                                <option value="Light Bites">Light Bites</option>
                                <option value="Desserts & Sweet Treats">Desserts & Sweet Treats</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">Product Image</label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={inputClasses}
                                    required={!currentProduct && !formData.image}
                                />
                                {formData.image && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-600">
                                        <img
                                            src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl border border-secondary-100 dark:border-secondary-600">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded bg-white dark:bg-secondary-800"
                            />
                            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Featured Product</label>
                        </div>
                        <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold shadow-lg shadow-primary-500/25 transition-all"
                            >
                                {currentProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 transition-all"
                        />
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {product.image ? (
                                                            <img className="h-10 w-10 rounded-lg object-cover border border-secondary-100 dark:border-secondary-600" src={getImageUrl(product.image)} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                                                                <ImageIcon size={20} className="text-secondary-400 dark:text-secondary-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{product.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-secondary-600 dark:text-secondary-400 capitalize bg-secondary-50 dark:bg-secondary-700/50 px-2 py-1 rounded-md">{product.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-secondary-900 dark:text-secondary-100">₹{product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-error-600 dark:text-error-400' : 'text-secondary-600 dark:text-secondary-400'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                                                    <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{product.rating || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleEdit(product)} className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors mr-1">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="text-error-500 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 p-1.5 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-3">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-secondary-100 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50">
                                        {product.image ? (
                                            <img className="h-full w-full object-cover" src={getImageUrl(product.image)} alt="" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <ImageIcon size={24} className="text-secondary-300 dark:text-secondary-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 truncate">{product.name}</h3>
                                        <span className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">{product.category}</span>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm font-bold text-secondary-900 dark:text-secondary-100">₹{product.price.toFixed(2)}</span>
                                            <span className={`text-xs font-medium ${product.stock <= 5 ? 'text-error-600 dark:text-error-400' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                                Stock: {product.stock}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-medium text-secondary-900 dark:text-secondary-100">{product.rating || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => handleEdit(product)} className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 text-error-500 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {
                        filteredProducts.length === 0 && (
                            <div className="text-center py-16 text-secondary-500 dark:text-secondary-400">
                                <ImageIcon size={48} className="mx-auto mb-4 text-secondary-300 dark:text-secondary-500" />
                                <p className="font-medium">No products found</p>
                            </div>
                        )
                    }
                </>
            )}
        </div >
    );
};

export default AdminProducts;
