import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, AlertTriangle, DollarSign, LogOut, Clock, Plus, Edit2, Trash2, Search, RotateCcw, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lowDemandProducts, setLowDemandProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockingProduct, setRestockingProduct] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    damaged: 0,
    supplier: ''
  });
  
  const [restockQuantity, setRestockQuantity] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/user');
      return;
    }

    setUser(parsedUser);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const [productsRes, ordersRes, lowDemandRes] = await Promise.all([
        axios.get('/api/products/available'),
        axios.get('/api/orders'),
        axios.get('/api/products/alerts/low-demand')
      ]);

      setProducts(productsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setLowDemandProducts(lowDemandRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Add Product
  const handleAddProduct = async () => {
    if (!formData.name || !formData.sku || !formData.category) {
      alert('Please fill in all required fields (Name, SKU, Category)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.post('/api/products', {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        maxStock: Number(formData.maxStock),
        unitPrice: Number(formData.unitPrice),
        damaged: Number(formData.damaged),
        supplier: formData.supplier,
        totalSold: 0
      });

      alert('Product added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchData(token);
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.error || 'Failed to add product');
    }
  };

  // Edit Product
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.currentStock,
      minStock: product.minStock || product.reorderPoint,
      maxStock: product.maxStock,
      unitPrice: product.unitPrice,
      damaged: product.damaged || 0,
      supplier: product.supplier || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.put(`/api/products/${editingProduct.id}`, {
        ...editingProduct,
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        maxStock: Number(formData.maxStock),
        unitPrice: Number(formData.unitPrice),
        damaged: Number(formData.damaged),
        supplier: formData.supplier
      });

      alert('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData(token);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.delete(`/api/products/${id}`);
      alert('Product deleted successfully!');
      fetchData(token);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Restock Product
  const handleRestockClick = (product) => {
    setRestockingProduct(product);
    setRestockQuantity(0);
    setShowRestockModal(true);
  };

  const handleRestock = async () => {
    if (restockQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const newStock = restockingProduct.currentStock + Number(restockQuantity);

      await axios.put(`/api/products/${restockingProduct.id}`, {
        ...restockingProduct,
        currentStock: newStock,
        lastRestocked: new Date().toISOString().split('T')[0]
      });

      alert(`Successfully restocked ${restockQuantity} units!`);
      setShowRestockModal(false);
      setRestockingProduct(null);
      setRestockQuantity(0);
      fetchData(token);
    } catch (error) {
      console.error('Error restocking:', error);
      alert('Failed to restock product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      damaged: 0,
      supplier: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product) => {
    const minStock = product.minStock || product.reorderPoint || 100;
    const maxStock = product.maxStock || 1000;
    if (product.availableStock === 0) return 'Out of Stock';
    if (product.availableStock <= minStock * 0.5) return 'Critical';
    if (product.availableStock <= minStock) return 'Low Stock';
    if (product.availableStock >= maxStock) return 'Over Stock';
    return 'In Stock';
  };

  const getStockStatusColor = (status) => {
    switch(status) {
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Critical': return 'bg-orange-100 text-orange-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Over Stock': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const metrics = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    lowDemand: lowDemandProducts.length,
    lowStock: products.filter(p => getStockStatus(p) === 'Low Stock' || getStockStatus(p) === 'Critical').length
  };

  const categoryData = Object.entries(
    products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + (p.currentStock * p.unitPrice);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const stockStatusData = [
    { status: 'In Stock', count: products.filter(p => getStockStatus(p) === 'In Stock').length },
    { status: 'Low Stock', count: products.filter(p => getStockStatus(p) === 'Low Stock').length },
    { status: 'Critical', count: products.filter(p => getStockStatus(p) === 'Critical').length },
    { status: 'Out of Stock', count: products.filter(p => getStockStatus(p) === 'Out of Stock').length },
    { status: 'Over Stock', count: products.filter(p => getStockStatus(p) === 'Over Stock').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
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
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {['dashboard', 'products', 'orders', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{metrics.totalProducts}</p>
                  </div>
                  <Package className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.lowStock}</p>
                  </div>
                  <AlertTriangle className="text-orange-600" size={32} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{metrics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Demand Items</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.lowDemand}</p>
                  </div>
                  <Clock className="text-orange-600" size={32} />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Inventory Value by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Stock Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stockStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {products.filter(p => getStockStatus(p) === 'Low Stock' || getStockStatus(p) === 'Critical').length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-orange-600" size={20} />
                  Low Stock Alerts
                </h3>
                <div className="space-y-2">
                  {products.filter(p => getStockStatus(p) === 'Low Stock' || getStockStatus(p) === 'Critical').map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                      <div>
                        <p className="font-medium">{product.name} ({product.sku})</p>
                        <p className="text-sm text-gray-600">
                          Available: {product.availableStock} | Min: {product.minStock || product.reorderPoint} | Max: {product.maxStock}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestockClick(product)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <RotateCcw size={16} />
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Product Inventory</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Categories</option>
                  {[...new Set(products.map(p => p.category))].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SKU</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Damaged</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Available</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Min/Max</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map(product => {
                      const status = getStockStatus(product);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-sm">{product.sku}</td>
                          <td className="px-4 py-3 text-sm">{product.category}</td>
                          <td className="px-4 py-3 text-sm">{product.currentStock}</td>
                          <td className="px-4 py-3 text-sm text-red-600">{product.damagedStock || 0}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">{product.availableStock}</td>
                          <td className="px-4 py-3 text-sm">{product.minStock || product.reorderPoint}/{product.maxStock}</td>
                          <td className="px-4 py-3 text-sm">₹{product.unitPrice}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStockStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRestockClick(product)}
                                className="text-green-600 hover:text-green-800"
                                title="Restock"
                              >
                                <RotateCcw size={18} />
                              </button>
                              <button
                                onClick={() => handleEditClick(product)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">All Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">#{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.username}</td>
                        <td className="px-4 py-3 text-sm font-medium">{order.productName}</td>
                        <td className="px-4 py-3 text-sm">{order.quantity}</td>
                        <td className="px-4 py-3 text-sm">₹{order.unitPrice}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">₹{order.totalPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Low Demand Products Report */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                Low Demand Products Report (Not Sold in 30+ Days)
              </h3>
              {lowDemandProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No low demand products. All items are selling well!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SKU</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Inventory Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Sold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {lowDemandProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-sm">{product.sku}</td>
                          <td className="px-4 py-3 text-sm">{product.category}</td>
                          <td className="px-4 py-3 text-sm">{product.currentStock}</td>
                          <td className="px-4 py-3 text-sm font-semibold">₹{(product.currentStock * product.unitPrice).toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-red-600">
                            {product.lastSoldDate ? new Date(product.lastSoldDate).toLocaleDateString() : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Stock Summary Report */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Stock Summary Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0).toLocaleString()}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600">Available Stock Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{products.reduce((sum, p) => sum + (p.availableStock * p.unitPrice), 0).toLocaleString()}
                  </p>
                </div>
          <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Damaged Stock Value</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{products.reduce((sum, p) => sum + ((p.damagedStock || 0) * p.unitPrice), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Category-wise Report */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Category-wise Inventory Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Products</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Inventory Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.entries(
                  products.reduce((acc, p) => {
                    if (!acc[p.category]) {
                      acc[p.category] = { count: 0, stock: 0, value: 0 };
                    }
                    acc[p.category].count++;
                    acc[p.category].stock += p.currentStock;
                    acc[p.category].value += p.currentStock * p.unitPrice;
                    return acc;
                  }, {})
                ).map(([category, data]) => (
                  <tr key={category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{category}</td>
                    <td className="px-4 py-3 text-sm">{data.count}</td>
                    <td className="px-4 py-3 text-sm">{data.stock}</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{data.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Add Product Modal */}
  {showAddModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Cement 50kg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU Code *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CEM-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Cement">Cement</option>
              <option value="Steel">Steel</option>
              <option value="Tiles">Tiles</option>
              <option value="Paint">Paint</option>
              <option value="Wood">Wood</option>
              <option value="Flooring">Flooring</option>
              <option value="Lighting">Lighting</option>
              <option value="Laminates">Laminates</option>
              <option value="Hardware">Hardware</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level</label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock Level</label>
            <input
              type="number"
              name="maxStock"
              value={formData.maxStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹)</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Damaged Units</label>
            <input
              type="number"
              name="damaged"
              value={formData.damaged}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., UltraTech"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProduct}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Edit Product Modal */}
  {showEditModal && editingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU Code *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Cement">Cement</option>
              <option value="Steel">Steel</option>
              <option value="Tiles">Tiles</option>
              <option value="Paint">Paint</option>
              <option value="Wood">Wood</option>
              <option value="Flooring">Flooring</option>
              <option value="Lighting">Lighting</option>
              <option value="Laminates">Laminates</option>
              <option value="Hardware">Hardware</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level</label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock Level</label>
            <input
              type="number"
              name="maxStock"
              value={formData.maxStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹)</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Damaged Units</label>
            <input
              type="number"
              name="damaged"
              value={formData.damaged}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setShowEditModal(false);
              setEditingProduct(null);
              resetForm();
            }}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProduct}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Restock Modal */}
  {showRestockModal && restockingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Restock Product</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Product</p>
            <p className="font-semibold text-gray-900">{restockingProduct.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="font-semibold text-gray-900">{restockingProduct.currentStock} units</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Stock (excluding damaged)</p>
            <p className="font-semibold text-green-600">{restockingProduct.availableStock} units</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Min/Max Stock Levels</p>
            <p className="font-semibold text-gray-900">
              {restockingProduct.minStock || restockingProduct.reorderPoint} / {restockingProduct.maxStock} units
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Add *
            </label>
            <input
              type="number"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              placeholder="Enter quantity to add"
            />
          </div>
          {restockQuantity > 0 && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">New Stock Level</p>
              <p className="text-lg font-bold text-blue-600">
                {restockingProduct.currentStock + restockQuantity} units
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setShowRestockModal(false);
              setRestockingProduct(null);
              setRestockQuantity(0);
            }}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRestock}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
}