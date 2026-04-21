import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, sendLoginOTP } = useAuth();

  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await sendLoginOTP(email);
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
      await login(email, otp);
      setMessage({ type: 'success', text: 'Login successful!' });
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5C3A21]" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your Mudgarvale account</p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#5C3A21] font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-4 text-center">
              <p className="text-gray-600">Enter the 6-digit OTP sent to</p>
              <p className="font-semibold text-[#5C3A21]">{email}</p>
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
              {loading ? 'Verifying...' : 'Verify & Login'}
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
                ← Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
