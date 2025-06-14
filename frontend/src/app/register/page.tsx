'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function Register() {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: name/password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send OTP');
      setStep(2);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error('Invalid OTP');
      setStep(3);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      alert('Registration successful!');
      // Redirect to login or dashboard
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen text-center flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-2">Register to Get Started</h1>
      
      <div className="border-2 rounded-xl w-max h-max p-6 overflow-hidden relative">
        <AnimatePresence mode='wait'>
          {/* Email Step */}
          {step === 1 && (
            <motion.div
              key="email"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 w-64">
                <div className="flex flex-col gap-2">
                  <label className="text-left">Email</label>
                  <input
                    className="border rounded-md py-2 px-3"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md py-2 px-4 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 border-2 border-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Verify'}
                </button>
              </form>
            </motion.div>
          )}

          {/* OTP Step */}
          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4 w-64">
                <p className="text-sm">We sent a verification code to {email}</p>
                <div className="flex flex-col gap-2">
                  <label className="text-left">Verification Code</label>
                  <input
                    className="border rounded-md py-2 px-3"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md py-2 px-4 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 border-2 border-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Confirm'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Name/Password Step */}
          {step === 3 && (
            <motion.div
              key="final"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4 w-64">
                <div className="flex flex-col gap-2">
                  <label className="text-left">Full Name</label>
                  <input
                    className="border rounded-md py-2 px-3"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-left">Password</label>
                  <input
                    className="border rounded-md py-2 px-3"
                    type="password"
                    placeholder="Set Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md py-2 px-4 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 border-2 border-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Complete Registration'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress indicators (3 dots) */}
      <div className="flex gap-2 mt-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full ${step >= i ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}