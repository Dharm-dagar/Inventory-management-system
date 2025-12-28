import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertTriangle, Plus, Edit2, Trash2, BarChart3 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unitPrice: '',
    damaged: 0
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.category || !formData.currentStock || !formData.minStock || !formData.maxStock || !formData.unitPrice) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const productData = {
        ...formData,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        maxStock: Number(formData.maxStock),
        unitPrice: Number(formData.unitPrice),
        damaged: Number(formData.damaged || 0)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, productData);
        alert('Product updated successfully!');
      } else {
        await axios.post('/api/products', productData);
        alert('Product added successfully!');
      }

      fetchProducts();
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unitPrice: '',
      damaged: 0
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.currentStock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unitPrice: product.unitPrice,
      damaged: product.damaged
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const getStockStatus = (product) => {
    const stockPercent = (product.currentStock / product.maxStock) * 100;
    if (product.currentStock <= product.minStock) return { label: 'Low Stock', color: 'text-red-600 bg-red-50' };
    if (stockPercent > 80) return { label: 'Overstock', color: 'text-orange-600 bg-orange-50' };
    return { label: 'Healthy', color: 'text-green-600 bg-green-50' };
  };

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
  const overstockProducts = products.filter(p => (p.currentStock / p.maxStock) > 0.8);
  const damagedValue = products.reduce((sum, p) => sum + (p.damaged * p.unitPrice), 0);

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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management System</h1>
              <p className="text-gray-600 mt-1">AEC Material Business Solution</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Alerts</p>
                <p className="text-3xl font-bold text-red-600">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="text-red-600" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overstock Items</p>
                <p className="text-3xl font-bold text-orange-600">{overstockProducts.length}</p>
              </div>
              <TrendingUp className="text-orange-600" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Damaged Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{damagedValue.toLocaleString()}</p>
              </div>
              <BarChart3 className="text-gray-600" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-2 border-b-2 font-medium ${
                  activeTab === 'inventory'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All Inventory
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-4 px-2 border-b-2 font-medium ${
                  activeTab === 'alerts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Low Stock Alerts ({lowStockProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-2 border-b-2 font-medium ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Min/Max</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Damaged</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const status = getStockStatus(product);
                      return (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">₹{product.unitPrice}/unit</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                          <td className="py-3 px-4 text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-right font-semibold">{product.currentStock}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-600">
                            {product.minStock}/{product.maxStock}
                          </td>
                          <td className="py-3 px-4 text-right text-red-600">{product.damaged}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800"
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
            )}

            {activeTab === 'alerts' && (
              <div>
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-600">No low stock alerts. All products are well-stocked!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                            <div className="mt-2 flex gap-4 text-sm">
                              <span className="text-red-700 font-medium">
                                Current: {product.currentStock} units
                              </span>
                              <span className="text-gray-600">
                                Min Required: {product.minStock} units
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Restock Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Top Performing SKUs</h3>
                  <div className="space-y-3">
                    {products
                      .sort((a, b) => b.totalSold - a.totalSold)
                      .slice(0, 5)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{product.totalSold} units</p>
                            <p className="text-sm text-gray-600">
                              ₹{(product.totalSold * product.unitPrice).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Inventory Health Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600">Healthy Stock</p>
                      <p className="text-2xl font-bold text-green-700">
                        {products.filter(p => {
                          const status = getStockStatus(p);
                          return status.label === 'Healthy';
                        }).length}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-gray-600">Needs Attention</p>
                      <p className="text-2xl font-bold text-red-700">
                        {products.filter(p => {
                          const status = getStockStatus(p);
                          return status.label !== 'Healthy';
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Flooring">Flooring</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Laminates">Laminates</option>
                    <option value="Tiles">Tiles</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock Level *
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stock Level *
                  </label>
                  <input
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Damaged Units
                  </label>
                  <input
                    type="number"
                    name="damaged"
                    value={formData.damaged}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}