import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, sendSignupOTP } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Send OTP without password (backend will handle it)
      const response = await sendSignupOTP(formData.name, formData.email, 'temp123');
      if (response.success) {
        setMessage({ type: 'success', text: 'OTP sent to your email!' });
        setStep(2);
        setCountdown(60);
        startCountdown();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await signup(formData.email, otp);
      setMessage({ type: 'success', text: 'Account created successfully!' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5C3A21]" style={{ fontFamily: 'Georgia, serif' }}>
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">Join Mudgarvale with just your email</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#5C3A21] font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-4 text-center">
              <p className="text-gray-600">Enter the 6-digit OTP sent to</p>
              <p className="font-semibold text-[#5C3A21]">{formData.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Create Account'}
            </button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="text-[#5C3A21] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-[#5C3A21] transition"
              >
                ← Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
