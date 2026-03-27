import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Tag, TrendingUp, Calendar, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'bogo';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  start_date: string;
  expiration_date?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
  is_active: boolean;
  is_single_use: boolean;
  user_specific?: string;
  applicable_services?: string[];
  created_at: string;
}

interface CouponAnalytics {
  code: string;
  description: string;
  usage_count: number;
  total_discount: number;
  is_active: boolean;
}

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [analytics, setAnalytics] = useState<CouponAnalytics[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as const,
    discount_value: 0,
    min_purchase_amount: 0,
    max_discount_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    usage_limit: 0,
    usage_limit_per_user: 0,
    is_active: true,
    is_single_use: false,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-coupons?action=list`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        setCoupons(result.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-coupons?action=analytics`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        setAnalytics(result.analytics);
        setShowAnalytics(true);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = editingCoupon ? 'update' : 'create';
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-coupons?action=${action}`;

      const payload = editingCoupon
        ? { id: editingCoupon.id, ...formData }
        : formData;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        resetForm();
        fetchCoupons();
      } else {
        alert(`Failed to save coupon: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-coupons?action=delete&id=${id}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon.');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_amount: coupon.min_purchase_amount || 0,
      max_discount_amount: coupon.max_discount_amount || 0,
      start_date: coupon.start_date.split('T')[0],
      expiration_date: coupon.expiration_date ? coupon.expiration_date.split('T')[0] : '',
      usage_limit: coupon.usage_limit || 0,
      usage_limit_per_user: coupon.usage_limit_per_user || 0,
      is_active: coupon.is_active,
      is_single_use: coupon.is_single_use,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase_amount: 0,
      max_discount_amount: 0,
      start_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      usage_limit: 0,
      usage_limit_per_user: 0,
      is_active: true,
      is_single_use: false,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const getDiscountLabel = (coupon: Coupon) => {
    switch (coupon.discount_type) {
      case 'percentage':
        return `${coupon.discount_value}% OFF`;
      case 'fixed_amount':
        return `₱${coupon.discount_value} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      case 'bogo':
        return 'BUY 1 GET 1';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Coupon Management</h2>
          <p className="text-sm text-slate-600 mt-1">Create and manage discount codes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g., SAVE20"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="e.g., 20% off for new customers"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₱)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Min Purchase (₱)</label>
                  <input
                    type="number"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {formData.discount_type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Discount Cap (₱)</label>
                  <input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    placeholder="Leave 0 for no cap"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                    min="0"
                    placeholder="0 = unlimited"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Per User Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit_per_user}
                    onChange={(e) => setFormData({ ...formData, usage_limit_per_user: parseInt(e.target.value) })}
                    min="0"
                    placeholder="0 = unlimited"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_single_use}
                    onChange={(e) => setFormData({ ...formData, is_single_use: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Single Use Only</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnalytics && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Coupon Analytics</h3>
              <button onClick={() => setShowAnalytics(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Code</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Uses</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Total Discount</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {analytics.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.code}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">{item.usage_count}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          ₱{item.total_discount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              item.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
              coupon.is_active ? 'border-blue-200' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-lg text-slate-900">{coupon.code}</span>
              </div>
              {coupon.is_active ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                  Active
                </span>
              ) : (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">
                  Inactive
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 mb-4">{coupon.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Discount:</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  {getDiscountLabel(coupon)}
                </span>
              </div>

              {coupon.min_purchase_amount && coupon.min_purchase_amount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Min. Purchase:</span>
                  <span className="font-semibold text-slate-900">
                    ₱{coupon.min_purchase_amount.toLocaleString()}
                  </span>
                </div>
              )}

              {coupon.expiration_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Expires:</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(coupon.expiration_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {coupon.usage_limit && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Usage Limit:</span>
                  <span className="font-semibold text-slate-900">{coupon.usage_limit} times</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleEdit(coupon)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <Tag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No coupons yet</h3>
          <p className="text-slate-600 mb-4">Create your first coupon to start offering discounts</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      )}
    </div>
  );
}
