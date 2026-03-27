import { CheckCircle, Download, Mail, Home } from 'lucide-react';
import OrderSummary from './OrderSummary';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface PaymentConfirmationProps {
  orderNumber: string;
  transactionId: string;
  paymentMethod: string;
  cart: CartItem[];
  total: number;
  customerEmail: string;
  onReturnHome: () => void;
  discount?: number;
  couponCode?: string;
}

export default function PaymentConfirmation({
  orderNumber,
  transactionId,
  paymentMethod,
  cart,
  total,
  customerEmail,
  onReturnHome,
  discount = 0,
  couponCode
}: PaymentConfirmationProps) {
  const handleDownloadReceipt = () => {
    const receiptContent = generateReceiptText();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReceiptText = () => {
    const date = new Date().toLocaleString('en-PH', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Manila'
    });

    let receipt = `
═══════════════════════════════════════
    BUILD WITH ALDREN - RECEIPT
═══════════════════════════════════════

Order Number: ${orderNumber}
Transaction ID: ${transactionId}
Date: ${date}
Payment Method: ${paymentMethod.toUpperCase()}

───────────────────────────────────────
ORDER DETAILS
───────────────────────────────────────

`;

    cart.forEach(item => {
      receipt += `${item.name}\n`;
      receipt += `  Qty: ${item.quantity} × ₱${item.price.toLocaleString()}\n`;
      receipt += `  Subtotal: ₱${(item.price * item.quantity).toLocaleString()}\n\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    receipt += `───────────────────────────────────────
PAYMENT SUMMARY
───────────────────────────────────────

Subtotal:         ₱${subtotal.toLocaleString()}`;

    if (discount > 0) {
      receipt += `\nDiscount${couponCode ? ` (${couponCode})` : ''}:     -₱${discount.toLocaleString()}`;
    }

    receipt += `
Tax:              ₱0.00
───────────────────────────────────────
TOTAL:            ₱${total.toLocaleString()}
═══════════════════════════════════════

Thank you for your business!

For support, contact us at:
Email: support@buildwithaldren.com
Phone: 09161171825

═══════════════════════════════════════
`;

    return receipt;
  };

  const paymentMethodNames: { [key: string]: string } = {
    'gcash': 'GCash',
    'paymaya': 'Maya (PayMaya)',
    'grab_pay': 'GrabPay',
    'shopeepay': 'ShopeePay',
    'billease': 'BillEase',
    'dob': 'BPI Online Banking',
    'ubp': 'UnionBank Online Banking',
    'card': 'Credit/Debit Card',
    'paypal': 'PayPal'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="inline-block p-4 bg-white rounded-full mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-lg">Your order has been confirmed</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-slate-900">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Transaction ID</p>
                  <p className="text-lg font-mono text-slate-900">{transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {paymentMethodNames[paymentMethod] || paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date & Time</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date().toLocaleString('en-PH', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Asia/Manila'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <OrderSummary
              cart={cart}
              total={total}
              showDetails={true}
              discount={discount}
              couponCode={couponCode}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Email Confirmation Sent</h3>
                  <p className="text-blue-800 text-sm">
                    A confirmation email with your receipt has been sent to <span className="font-semibold">{customerEmail}</span>.
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 bg-slate-700 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <button
                onClick={onReturnHome}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </div>

            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600 mb-2">Need help with your order?</p>
              <p className="text-slate-900">
                Contact us at <a href="mailto:support@buildwithaldren.com" className="text-blue-600 font-semibold hover:underline">support@buildwithaldren.com</a>
                {' '}or call <a href="tel:09161171825" className="text-blue-600 font-semibold hover:underline">09161171825</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Thank you for choosing Build with Aldren! We'll start working on your project shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
