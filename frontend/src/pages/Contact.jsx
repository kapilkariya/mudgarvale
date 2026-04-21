import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const ContactPage = () => {
  const [phone, setPhone] = useState();

  const inputStyle = "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B5E3C] placeholder-gray-400 bg-white";

  return (
    <div className="min-h-screen bg-[#FDF8EE] flex flex-col items-center py-12 px-4 font-sans">
      {/* Header Section */}
      <div className="text-center mb-10 mt-20 max-w-2xl">
        <h1 className="text-4xl font-serif text-[#5D3A1A] mb-8">Contact Us</h1>
        
        <div className="text-[#5D3A1A] space-y-1 text-sm md:text-base leading-relaxed">
          <p>39 krishna nagar near shanti nagar udhana, Surat
</p>
          <p className="underline pt-2">
            <a href="tel:+918799357438">+91 8799357438</a>
          </p>
          <p className="underline">
            <a href="mailto:support@mudgarclub.com">support@mudgarclub.com</a>
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form className="w-full max-w-[500px] space-y-4">
        <input 
          type="text" 
          placeholder="First name" 
          className={inputStyle}
        />
        
        <input 
          type="text" 
          placeholder="Last name" 
          className={inputStyle}
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          className={inputStyle}
        />

        {/* Phone Input Container */}
        <div className="flex gap-0 border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[#8B5E3C]">
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            className="contact-phone-input w-full px-3 py-1"
          />
        </div>

        <textarea 
          placeholder="Message" 
          rows="5"
          className={`${inputStyle} resize-none`}
        />

        <button 
          type="submit" 
          className="w-full bg-[#8B5E3C] text-white py-3 rounded-md font-semibold hover:bg-[#724d31] transition-colors"
        >
          Submit
        </button>

        {/* Footer Disclaimer */}
        <p className="text-[10px] text-gray-600 text-center leading-tight mt-4">
          By signing up, you agree to receive marketing messages at the phone number or email provided. 
          Msg and data rates may apply. View our <span className="underline cursor-pointer">privacy policy</span> and <span className="underline cursor-pointer">terms of service</span> for more info.
        </p>
      </form>

      {/* Custom CSS to clean up the Phone Input library's default borders */}
      <style>{`
        .contact-phone-input input {
          border: none !important;
          outline: none !important;
          padding: 8px 0;
        }
        .PhoneInputCountry {
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;