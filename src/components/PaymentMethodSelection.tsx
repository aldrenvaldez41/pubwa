import { useState } from 'react';
import { Smartphone, Building2, CreditCard, Store, Wallet, ArrowLeft, ArrowRight, CheckCircle, Lock, Sparkles } from 'lucide-react';
import OrderSummary from './OrderSummary';
import type { AppliedCoupon } from './CouponInput';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface PaymentMethodSelectionProps {
  cart: CartItem[];
  total: number;
  appliedCoupon?: AppliedCoupon | null;
  onBack: () => void;
  onProceedToPayment: (paymentMethod: string, gateway: string, customerInfo: CustomerInfo) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  gateway: string;
  category: string;
  fees?: string;
  available: boolean;
  comingSoon?: boolean;
}

export default function PaymentMethodSelection({
  cart,
  total,
  appliedCoupon,
  onBack,
  onProceedToPayment
}: PaymentMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gcash',
      name: 'GCash',
      description: 'Scan QR code with your GCash app - Fast & Secure',
      icon: Smartphone,
      gateway: 'paymongo',
      category: 'Available Now - QR Code Payment',
      fees: 'No additional fees',
      available: true
    },
    {
      id: 'paymaya',
      name: 'Maya (PayMaya)',
      description: 'Scan QR code with your Maya app - Fast & Secure',
      icon: Smartphone,
      gateway: 'paymongo',
      category: 'Available Now - QR Code Payment',
      fees: 'No additional fees',
      available: true
    },
    {
      id: 'grab_pay',
      name: 'GrabPay',
      description: 'Pay using your GrabPay wallet',
      icon: Smartphone,
      gateway: 'paymongo',
      category: 'Coming Soon',
      fees: 'No additional fees',
      available: false,
      comingSoon: true
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      description: 'Pay using your ShopeePay wallet',
      icon: Smartphone,
      gateway: 'xendit',
      category: 'Coming Soon',
      fees: 'No additional fees',
      available: false,
      comingSoon: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay using Visa, Mastercard, or JCB',
      icon: CreditCard,
      gateway: 'paymongo',
      category: 'Coming Soon',
      fees: 'Processing fee: 3.5%',
      available: false,
      comingSoon: true
    },
    {
      id: 'dob',
      name: 'BPI Online',
      description: 'Pay using BPI online banking',
      icon: Building2,
      gateway: 'paymongo',
      category: 'Coming Soon',
      fees: 'No additional fees',
      available: false,
      comingSoon: true
    },
    {
      id: 'ubp',
      name: 'UnionBank Online',
      description: 'Pay using UnionBank online banking',
      icon: Building2,
      gateway: 'paymongo',
      category: 'Coming Soon',
      fees: 'No additional fees',
      available: false,
      comingSoon: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay using your PayPal account',
      icon: Wallet,
      gateway: 'paypal',
      category: 'Coming Soon',
      fees: 'Processing fee: 4.4% + ₱15',
      available: false,
      comingSoon: true
    }
  ];

  const categories = Array.from(new Set(paymentMethods.map(m => m.category)));

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(09|\+639)\d{9}$/.test(customerInfo.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid Philippine phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (method) {
      onProceedToPayment(method.id, method.gateway, customerInfo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Select Payment Method</h1>
          <p className="text-xl text-slate-600">Choose how you'd like to pay</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Juan Dela Cruz"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="juan@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="09171234567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {categories.map(category => {
              const methodsInCategory = paymentMethods.filter(m => m.category === category);
              const isComingSoonCategory = category === 'Coming Soon';
              return (
                <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold ${isComingSoonCategory ? 'text-slate-500' : 'text-slate-900'}`}>
                      {category}
                    </h2>
                    {!isComingSoonCategory && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        <Sparkles className="w-4 h-4" />
                        Available
                      </div>
                    )}
                  </div>

                  {isComingSoonCategory && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>More payment options coming soon!</strong> We're working to add these methods to give you more flexibility.
                      </p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {methodsInCategory.map(method => {
                      const Icon = method.icon;
                      const isSelected = selectedMethod === method.id;
                      const isDisabled = !method.available;
                      return (
                        <button
                          key={method.id}
                          onClick={() => !isDisabled && setSelectedMethod(method.id)}
                          disabled={isDisabled}
                          className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                            isDisabled
                              ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'border-blue-600 bg-blue-50 shadow-md hover:shadow-lg'
                              : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          {isDisabled && (
                            <div className="absolute top-2 right-2 bg-slate-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Soon
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg ${
                              isDisabled ? 'bg-slate-200' : isSelected ? 'bg-blue-100' : 'bg-slate-100'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                isDisabled ? 'text-slate-400' : isSelected ? 'text-blue-600' : 'text-slate-600'
                              }`} />
                            </div>
                            {isSelected && !isDisabled && <CheckCircle className="w-6 h-6 text-blue-600" />}
                          </div>
                          <h3 className={`font-bold mb-1 ${isDisabled ? 'text-slate-500' : 'text-slate-900'}`}>
                            {method.name}
                          </h3>
                          <p className={`text-sm mb-2 ${isDisabled ? 'text-slate-400' : 'text-slate-600'}`}>
                            {method.description}
                          </p>
                          {method.fees && (
                            <p className={`text-xs italic ${isDisabled ? 'text-slate-400' : 'text-slate-500'}`}>
                              {method.fees}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                How QR Code Payment Works
              </h3>
              <ol className="space-y-2 text-sm text-blue-900 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">1.</span>
                  <span>Select GCash or Maya as your payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">2.</span>
                  <span>You'll see a QR code on the payment page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">3.</span>
                  <span>Open your GCash/Maya app and scan the QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">4.</span>
                  <span>Confirm the payment in your app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">5.</span>
                  <span>You'll be redirected back automatically once paid</span>
                </li>
              </ol>
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-blue-300">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Secure & Fast:</strong> All payments are processed securely through PayMongo.
                  Your payment is encrypted and we never store your wallet credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <OrderSummary
                cart={cart}
                total={total}
                discount={appliedCoupon?.discountAmount || 0}
                couponCode={appliedCoupon?.code}
              />

              <button
                onClick={handleProceed}
                disabled={!selectedMethod}
                className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedMethod
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
                <p className="font-semibold mb-2">Need help?</p>
                <p>Contact us at support@buildwithaldren.com or call 09161171825</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
