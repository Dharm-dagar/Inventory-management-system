import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ShoppingCart, Package, LogOut, Search, ShoppingBag, Filter, CheckCircle } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'user') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products/available'),
        axios.get('/api/orders')
      ]);

      setProducts(productsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handlePurchaseClick = (product) => {
    if (product.availableStock === 0) {
      alert('This product is out of stock!');
      return;
    }
    setSelectedProduct(product);
    setPurchaseQuantity(1);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedProduct || purchaseQuantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }

    if (purchaseQuantity > selectedProduct.availableStock) {
      alert(`Only ${selectedProduct.availableStock} units available!`);
      return;
    }

    setPurchaseLoading(true);

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.post('/api/orders', {
        productId: selectedProduct.id,
        quantity: purchaseQuantity
      });

      alert('Purchase successful! Thank you for your order.');
      setShowPurchaseModal(false);
      setSelectedProduct(null);
      setPurchaseQuantity(1);
      
      // Refresh data
      fetchData(token);
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.error || 'Purchase failed. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalItems = orders.reduce((sum, o) => sum + o.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              </div>
              <ShoppingBag className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Purchased</p>
                <p className="text-2xl font-bold text-green-600">{totalItems}</p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              </div>
              <ShoppingCart className="text-gray-600" size={32} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Orders
          </button>
        </div>

        {/* Browse Products Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={18} />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {[...new Set(products.map(p => p.category))].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-600">No products found</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {product.category}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900">₹{product.unitPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available Stock:</span>
                          <span className={`font-semibold ${
                            product.availableStock > 50 ? 'text-green-600' :
                            product.availableStock > 20 ? 'text-yellow-600' :
                            product.availableStock > 0 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {product.availableStock} units
                          </span>
                        </div>
                        {product.damagedStock > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Damaged:</span>
                            <span className="text-red-600">{product.damagedStock} units</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handlePurchaseClick(product)}
                        disabled={product.availableStock === 0}
                        className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          product.availableStock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <ShoppingCart size={18} />
                        {product.availableStock === 0 ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.productName}</h4>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                      </div>
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle size={14} />
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-semibold">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Unit Price</p>
                        <p className="font-semibold">₹{order.unitPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-green-600">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Available Stock</p>
                <p className="font-semibold text-gray-900">{selectedProduct.availableStock} units</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Quantity</p>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.availableStock}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-semibold">₹{selectedProduct.unitPrice}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{purchaseQuantity}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">₹{(selectedProduct.unitPrice * purchaseQuantity).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setSelectedProduct(null);
                  setPurchaseQuantity(1);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={purchaseLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchaseLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchaseLoading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}