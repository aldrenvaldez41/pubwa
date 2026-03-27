import { Receipt } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  cart: CartItem[];
  total: number;
  showDetails?: boolean;
  discount?: number;
  couponCode?: string;
}

export default function OrderSummary({ cart, total, showDetails = true, discount = 0, couponCode }: OrderSummaryProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
      </div>

      {showDetails && (
        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between">
              <div className="flex-1 pr-4">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-900">₱{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>₱{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount{couponCode ? ` (${couponCode})` : ''}</span>
            <span>-₱{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Tax</span>
          <span>₱{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-200">
          <span>Total</span>
          <span>₱{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
