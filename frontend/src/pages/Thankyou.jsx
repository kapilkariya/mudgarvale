import React, { useEffect } from 'react';  
import { Link } from 'react-router-dom';

const Thankyou = () => {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18205627094/8tHjCIueyLscENalj-lD',
        value: 1.0,
        currency: 'INR',
        transaction_id: ''
      });
    }
  }, []);

  return (
    <div className="bg-[#f3eadf] text-[#3a1f0f] min-h-screen">
      {/* Top spacer */}
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      {/* Thank You Content */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-[#3a1f0f]">
          Thank You! 🙏
        </h1>
        
        <p className="text-xl text-[#5C3A21] mb-4">
          Your order has been placed successfully with <span className="font-bold">MudgarVale</span>
        </p>

        <div className="bg-white/50 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <p className="text-[#6b4b3a] mb-2">
            ✅ Order Confirmed
          </p>
          <p className="text-[#6b4b3a] text-sm">
            We've sent a confirmation email with your order details.
          </p>
        </div>

        {/* Tracking Information */}
        <div className="bg-[#e8d9c8] rounded-xl p-6 mb-8 max-w-md mx-auto border-2 border-[#5C3A21]/20">
          <p className="text-[#5C3A21] font-semibold text-lg mb-2">
            📦 Tracking Information
          </p>
          <p className="text-[#6b4b3a] text-sm mb-3">
            Your tracking ID will be shared within <span className="font-bold text-[#5C3A21]">4 days</span>
          </p>
          <div className="h-px bg-[#5C3A21]/20 my-3"></div>
          <p className="text-[#6b4b3a] text-sm">
            For any queries or support, feel free to reach out!
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-[#5C3A21] text-[#f3eadf] rounded-xl p-6 mb-8 max-w-md mx-auto">
          <p className="font-semibold text-lg mb-2">
            📞 Need Help?
          </p>
          <p className="text-sm mb-1">
            Call us at: 
            <a href="tel:7016243133" className="font-bold text-white hover:underline ml-1">
              7016243133
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/my-orders"
            className="px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-1 shadow-md"
            style={{ background: '#5C3A21', color: '#f3eadf' }}
          >
            📦 Track Order
          </Link>
          <Link
            to="/products"
            className="px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-1 shadow-md"
            style={{ background: '#fff', color: '#5C3A21', border: '2px solid #5C3A21' }}
          >
            🛒 Continue Shopping
          </Link>
        </div>

        {/* Support Email */}
        <p className="mt-10 text-sm text-[#8B7355]">
          Need help? <a href="mailto:support@mudgarvale.com" className="text-[#5C3A21] font-semibold underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default Thankyou;