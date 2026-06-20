import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/authStore';

export default function Login() {
  const { user, login, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 flex items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-md bg-navy-800 border border-navy-700 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-navy-400 text-sm mt-2">Sign in to resume tracking your JEE preparation</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-500/50 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white text-sm focus:border-brand-red focus:outline-none transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white text-sm focus:border-brand-red focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-red hover:bg-brand-red-hover disabled:bg-brand-red/50 text-white font-bold rounded-lg transition-all focus:outline-none cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="w-1/4 border-b border-navy-700"></span>
          <span className="text-[10px] uppercase text-navy-500 font-bold">Or continue with</span>
          <span className="w-1/4 border-b border-navy-700"></span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In was unsuccessful. Try again.')}
          />
        </div>

        <div className="mt-8 text-center border-t border-navy-700 pt-6">
          <p className="text-sm text-navy-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-red font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
