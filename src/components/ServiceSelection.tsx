import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CouponInput, { AppliedCoupon } from './CouponInput';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface CartItem extends Service {
  quantity: number;
}

interface ServiceSelectionProps {
  onProceedToPayment: (cart: CartItem[], total: number, appliedCoupon?: AppliedCoupon | null) => void;
}

export default function ServiceSelection({ onProceedToPayment }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const addToCart = (service: Service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal() + calculateTax();
    return appliedCoupon ? appliedCoupon.finalAmount : subtotal;
  };

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Please add items to your cart before proceeding.');
      return;
    }
    onProceedToPayment(cart, calculateTotal(), appliedCoupon);
  };

  const handleCouponApplied = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600">Select the services you need and add them to your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              {filteredServices.map(service => (
                <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{service.name}</h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₱{service.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                    <button
                      onClick={() => addToCart(service)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="border-b border-slate-200 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-900 flex-1 pr-2">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-bold text-slate-900">₱{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₱{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span>₱{calculateTax().toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount</span>
                        <span>-₱{getDiscountAmount().toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>₱{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <CouponInput
                      orderAmount={calculateSubtotal() + calculateTax()}
                      userEmail="customer@example.com"
                      serviceIds={cart.map(item => item.id)}
                      onCouponApplied={handleCouponApplied}
                      onCouponRemoved={handleCouponRemoved}
                    />
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
