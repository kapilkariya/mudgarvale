import React, { useEffect, useState } from 'react';import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { API_URL } from '../config/api';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const inputStyle =
    "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B5E3C] placeholder-gray-400 bg-white";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phone) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone,
          subject: 'Website contact form submission',
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
        });
        setPhone('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Contact Info Section */}
          <div className="flex-1">
            <h1 className="text-4xl font-serif text-[#5D3A1A] mb-8">
              Contact Us
            </h1>

            {/* Contact Info */}
            <div className="text-[#5D3A1A] text-sm md:text-base leading-relaxed space-y-4">
              {/* Address */}
              <div>
                <p className="font-semibold tracking-wide">Address</p>
                <p className="text-gray-700">
                  39, Krishna Nagar<br />
                  Near Shanti Nagar, Udhana<br />
                  Surat, Gujarat, India
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="font-semibold tracking-wide">Phone</p>
                <a
                  href="tel:+917016243133"
                  className="underline hover:text-[#8B5E3C] transition"
                >
                  +91 7016243133
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="font-semibold tracking-wide">Email</p>
                <a
                  href="mailto:mudgarvale@gmail.com"
                  className="underline hover:text-[#8B5E3C] transition"
                >
                  mudgarvale@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 w-full max-w-[500px] space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className={inputStyle}
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className={inputStyle}
                disabled={loading}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
              disabled={loading}
            />

            {/* Phone Input */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[#8B5E3C]">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                disabled={loading}
                className="contact-phone-input w-full px-3 py-1"
              />
            </div>

            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
              disabled={loading}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm">
                Thank you for contacting us! We'll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5E3C] text-white py-3 rounded-md font-semibold hover:bg-[#724d31] transition-colors disabled:bg-[#c4a484] disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>

            {/* Disclaimer */}
            <p className="text-[10px] text-gray-600 text-center leading-tight mt-4">
              By signing up, you agree to receive marketing messages at the phone
              number or email provided. Msg and data rates may apply. View our{" "}
              <span className="underline cursor-pointer">privacy policy</span> and{" "}
              <span className="underline cursor-pointer">terms of service</span> for
              more info.
            </p>
          </form>
        </div>
      </div>

      {/* Custom Phone Input Styling */}
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
        .PhoneInputInput {
          background: transparent;
        }
      `}</style>
      
    </>
  );
};

export default ContactPage;
