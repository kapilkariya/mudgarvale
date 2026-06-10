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
        // new_customer: true
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
        
        <p className="text-xl text-[#5C3A21] mb-6">
          Your order has been placed successfully
        </p>

        <p className="text-[#6b4b3a] mb-10">
          We've sent a confirmation email with your order details.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/orders"
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

        {/* Support Link */}
        <p className="mt-10 text-sm text-[#8B7355]">
          Need help? <a href="mailto:support@mudgarvale.com" className="text-[#5C3A21] font-semibold underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default Thankyou;