import { useState } from 'react';
import { Tag, X, CheckCircle, AlertCircle } from 'lucide-react';

interface CouponInputProps {
  orderAmount: number;
  userEmail: string;
  serviceIds?: string[];
  onCouponApplied: (coupon: AppliedCoupon) => void;
  onCouponRemoved: () => void;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discountAmount: number;
  finalAmount: number;
}

export default function CouponInput({
  orderAmount,
  userEmail,
  serviceIds = [],
  onCouponApplied,
  onCouponRemoved
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-coupon`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          userEmail,
          orderAmount,
          serviceIds,
        }),
      });

      const result = await response.json();

      if (result.valid && result.coupon) {
        const appliedCouponData: AppliedCoupon = {
          id: result.coupon.id,
          code: result.coupon.code,
          description: result.coupon.description,
          discount_type: result.coupon.discount_type,
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount,
        };

        setAppliedCoupon(appliedCouponData);
        setSuccess(result.message || 'Coupon applied successfully!');
        onCouponApplied(appliedCouponData);
        setCouponCode('');
      } else {
        setError(result.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError('Failed to apply coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setSuccess('');
    setError('');
    onCouponRemoved();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <div className="space-y-3">
      {!appliedCoupon ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Have a coupon code?
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase disabled:bg-slate-100"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {error && (
            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Coupon Applied</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-900 transition-colors"
              title="Remove coupon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-green-900 bg-green-200 px-2 py-0.5 rounded">
                {appliedCoupon.code}
              </span>
              <span className="text-sm text-green-700">{appliedCoupon.description}</span>
            </div>

            <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-200">
              <span className="text-sm text-green-800">Discount:</span>
              <span className="font-bold text-green-900">
                -₱{appliedCoupon.discountAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-800">New Total:</span>
              <span className="text-lg font-bold text-green-900">
                ₱{appliedCoupon.finalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {success && (
            <div className="mt-2 text-xs text-green-700 ml-7">
              {success}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
