import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import ServiceSelection from './components/ServiceSelection';
import PaymentMethodSelection from './components/PaymentMethodSelection';
import PaymentConfirmation from './components/PaymentConfirmation';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import QRCodeDisplay from './components/QRCodeDisplay';
import type { AppliedCoupon } from './components/CouponInput';

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

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'payment' | 'confirmation' | 'privacy' | 'terms'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '' });
  const [orderNumber, setOrderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState('');
  const [isCheckingPaymentStatus, setIsCheckingPaymentStatus] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShowAdmin(params.get('admin') === 'true');

    const page = params.get('page');
    if (page === 'services') {
      setCurrentPage('services');
    } else if (page === 'privacy') {
      setCurrentPage('privacy');
    } else if (page === 'terms') {
      setCurrentPage('terms');
    } else if (page === 'confirmation') {
      const pendingPayment = sessionStorage.getItem('pendingPayment');
      if (pendingPayment) {
        const paymentData = JSON.parse(pendingPayment);
        setOrderNumber(paymentData.orderNumber);
        setTransactionId(paymentData.transactionId);
        setSelectedPaymentMethod(paymentData.paymentMethod);
        setCart(paymentData.cart);
        setTotal(paymentData.total);
        setCustomerInfo({ ...customerInfo, email: paymentData.customerEmail });
        if (paymentData.discount && paymentData.couponCode) {
          setAppliedCoupon({
            code: paymentData.couponCode,
            discountAmount: paymentData.discount,
            discountType: 'fixed'
          });
        }
        setCurrentPage('confirmation');

        const subtotal = paymentData.cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const discount = paymentData.discount || 0;

        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-receipt`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber: paymentData.orderNumber,
            transactionId: paymentData.transactionId,
            customerName: paymentData.customerName || 'Customer',
            customerEmail: paymentData.customerEmail,
            paymentMethod: paymentData.paymentMethod,
            cart: paymentData.cart,
            subtotal,
            tax: 0,
            total: paymentData.total,
            discount,
            couponCode: paymentData.couponCode
          })
        }).catch(err => console.error('Failed to send receipt:', err));

        sessionStorage.removeItem('pendingPayment');
      }
    }
  }, []);

  const handleProceedToPayment = (cartItems: CartItem[], cartTotal: number, coupon?: AppliedCoupon | null) => {
    setCart(cartItems);
    setTotal(cartTotal);
    setAppliedCoupon(coupon || null);
    setCurrentPage('payment');
    window.history.pushState({}, '', '?page=payment');
  };

  const handleBackToCart = () => {
    setCurrentPage('services');
    window.history.pushState({}, '', '?page=services');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCart([]);
    setTotal(0);
    setOrderNumber('');
    setTransactionId('');
    setShowQRCode(false);
    setQRCodeImage('');
    window.history.pushState({}, '', '/');
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setQRCodeImage('');
    setCurrentPage('payment');
  };

  const handleCheckPaymentStatus = async () => {
    setIsCheckingPaymentStatus(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-receipt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          transactionId,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          paymentMethod: selectedPaymentMethod,
          cart,
          subtotal,
          tax: 0,
          total,
          discount,
          couponCode: appliedCoupon?.code
        })
      }).catch(err => console.error('Failed to send receipt:', err));

      setShowQRCode(false);
      setCurrentPage('confirmation');
      window.history.pushState({}, '', '?page=confirmation');
    } catch (error) {
      console.error('Status check error:', error);
      alert('Unable to verify payment status. Please refresh and try again or contact support.');
    } finally {
      setIsCheckingPaymentStatus(false);
    }
  };

  const handleProceedToPaymentGateway = async (
    paymentMethod: string,
    gateway: string,
    customerData: CustomerInfo
  ) => {
    setSelectedPaymentMethod(paymentMethod);
    setSelectedGateway(gateway);
    setCustomerInfo(customerData);
    setIsProcessingPayment(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          total,
          paymentMethod,
          paymentGateway: gateway,
          customerInfo: customerData,
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.discountAmount || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error occurred' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrderNumber(result.orderNumber);
        setTransactionId(result.transactionId);

        if (result.requiresRedirect && result.paymentUrl) {
          if (result.paymentUrl.startsWith('data:image')) {
            setQRCodeImage(result.paymentUrl);
            setShowQRCode(true);
          } else {
            sessionStorage.setItem('pendingPayment', JSON.stringify({
              orderNumber: result.orderNumber,
              transactionId: result.transactionId,
              paymentMethod,
              cart,
              total,
              customerName: customerData.name,
              customerEmail: customerData.email,
              discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
              couponCode: appliedCoupon?.code
            }));
            window.location.href = result.paymentUrl;
          }
        } else {
          const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-receipt`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderNumber: result.orderNumber,
              transactionId: result.transactionId,
              customerName: customerData.name,
              customerEmail: customerData.email,
              paymentMethod,
              cart,
              subtotal,
              tax: 0,
              total,
              discount,
              couponCode: appliedCoupon?.code
            })
          });

          setCurrentPage('confirmation');
          window.history.pushState({}, '', '?page=confirmation');
        }
      } else {
        throw new Error(result.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      if (errorMessage.includes('API key not configured')) {
        alert('PAYMENT GATEWAY NOT SET UP\n\nThe payment system needs to be configured with API keys.\n\nPlease contact: support@buildwithaldren.com or call 09161171825');
      } else if (errorMessage.includes('Payment method not enabled')) {
        alert('PAYMENT METHOD NOT ENABLED\n\n' + errorMessage);
      } else if (errorMessage.includes('API error') || errorMessage.includes('PayMongo error')) {
        alert('PAYMENT GATEWAY ERROR\n\n' + errorMessage + '\n\nPlease try again or contact support.');
      } else {
        alert('PAYMENT ERROR\n\n' + errorMessage + '\n\nIf this persists, contact: support@buildwithaldren.com or 09161171825');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (showAdmin) {
    return <Admin />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy />;
  }

  if (currentPage === 'terms') {
    return <TermsOfService />;
  }

  if (currentPage === 'confirmation') {
    return (
      <PaymentConfirmation
        orderNumber={orderNumber}
        transactionId={transactionId}
        paymentMethod={selectedPaymentMethod}
        cart={cart}
        total={total}
        customerEmail={customerInfo.email}
        onReturnHome={handleBackToHome}
        discount={appliedCoupon?.discountAmount || 0}
        couponCode={appliedCoupon?.code}
      />
    );
  }

  if (currentPage === 'payment') {
    if (isProcessingPayment) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment...</h2>
            <p className="text-slate-600">Please wait while we process your order</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <PaymentMethodSelection
          cart={cart}
          total={total}
          appliedCoupon={appliedCoupon}
          onBack={handleBackToCart}
          onProceedToPayment={handleProceedToPaymentGateway}
        />
        {showQRCode && (
          <QRCodeDisplay
            qrCodeImage={qrCodeImage}
            orderNumber={orderNumber}
            amount={total}
            paymentMethod={selectedPaymentMethod}
            onClose={handleCloseQRCode}
            onCheckStatus={handleCheckPaymentStatus}
            isCheckingStatus={isCheckingPaymentStatus}
          />
        )}
      </>
    );
  }

  if (currentPage === 'services') {
    return <ServiceSelection onProceedToPayment={handleProceedToPayment} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
      {showQRCode && (
        <QRCodeDisplay
          qrCodeImage={qrCodeImage}
          orderNumber={orderNumber}
          amount={total}
          paymentMethod={selectedPaymentMethod}
          onClose={handleCloseQRCode}
          onCheckStatus={handleCheckPaymentStatus}
          isCheckingStatus={isCheckingPaymentStatus}
        />
      )}
    </div>
  );
}

export default App;
