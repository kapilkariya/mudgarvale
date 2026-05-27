import React from 'react';

const SepPayment = () => {
  // UPI ID - replace with your actual UPI ID
  const upiId = '7016243133-1@okbizaxis';
  const contactNo = '+91 70162 43133';
  const email = 'mudgarvale@gmail.com';

  // Function to copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  // Generate UPI payment link
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=Mudgarvale&cu=INR`;

  return (<>    
        <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8 md:py-12">
      {/* Main Content */}
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600 text-lg">Scan QR code or use UPI ID to make payment</p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center transform transition-all hover:scale-105 duration-300">
            <div className="mb-4">
              <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">Scan to Pay</span>
            </div>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-lg inline-block">
                <img 
                  src="/qr.jpeg" 
                  alt="UPI QR Code" 
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm">Scan this QR code with any UPI app</p>
            <p className="text-gray-500 text-sm mt-1">(Google Pay, PhonePe, Paytm, etc.)</p>
          </div>

          {/* UPI & Contact Section */}
          <div className="space-y-6">
            {/* UPI ID Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">UPI Payment</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">UPI ID</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-mono font-medium text-gray-800 break-all">{upiId}</p>
                  <button 
                    onClick={copyUpiId}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

             
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                After payment, please share screenshot on WhatsApp or email
              </p>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                    <a href={`tel:${contactNo.replace(/\s/g, '')}`} className="text-lg font-medium text-gray-800 hover:text-amber-600">
                      {contactNo}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-red-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${email}`} className="text-lg font-medium text-gray-800 hover:text-amber-600 break-all">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4">
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">
                  Please mention your <strong>Order ID</strong> or <strong>Name</strong> in payment description for faster confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>

  );
};

export default SepPayment;