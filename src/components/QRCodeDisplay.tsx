import { X, Smartphone, RefreshCw } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCodeImage: string;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  onClose: () => void;
  onCheckStatus: () => void;
  isCheckingStatus: boolean;
}

export default function QRCodeDisplay({
  qrCodeImage,
  orderNumber,
  amount,
  paymentMethod,
  onClose,
  onCheckStatus,
  isCheckingStatus
}: QRCodeDisplayProps) {
  const paymentMethodNames: { [key: string]: string } = {
    'gcash': 'GCash',
    'paymaya': 'Maya (PayMaya)'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Scan to Pay</h2>
          </div>
          <p className="text-blue-100">
            Use {paymentMethodNames[paymentMethod] || paymentMethod} or any QRPh-enabled app
          </p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Order Number</span>
              <span className="font-bold text-slate-900">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Amount</span>
              <span className="text-2xl font-bold text-blue-600">₱{amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-center bg-white p-4 rounded-xl border-2 border-slate-200">
            <img
              src={qrCodeImage}
              alt="QR Code for Payment"
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 mb-2 text-sm">How to pay:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Open your e-wallet app (GCash, Maya, etc.)</li>
              <li>Select "Scan QR" or "Pay via QR"</li>
              <li>Scan the QR code above</li>
              <li>Confirm the payment in your app</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 text-center">
              <span className="font-bold">Important:</span> This QR code expires in 30 minutes
            </p>
          </div>

          <button
            onClick={onCheckStatus}
            disabled={isCheckingStatus}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCheckingStatus ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Checking Payment Status...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                I've Paid - Check Status
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            After completing payment, click the button above to verify
          </p>
        </div>
      </div>
    </div>
  );
}
