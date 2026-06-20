import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuthStore from '../store/authStore';
import useTheme from '../hooks/useTheme';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Register() {
  const { user, register, loginWithGoogle } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.match(/[0-9]/) || pass.match(/[A-Z]/)) score += 1;
    if (pass.length >= 8 && pass.match(/[^a-zA-Z0-9]/)) score += 1;
    return Math.min(3, score);
  };

  const strength = getPasswordStrength(password);

  const getStrengthConfig = () => {
    if (strength === 1) return { color: 'bg-danger', text: 'Weak password' };
    if (strength === 2) return { color: 'bg-warning', text: 'Medium strength' };
    if (strength === 3) return { color: 'bg-success', text: 'Strong password' };
    return { color: 'bg-border-default', text: '' };
  };

  const strengthConfig = getStrengthConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms of Service');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
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
    <div className="min-h-screen bg-bg-app flex flex-col md:flex-row text-text-primary">
      {/* Left Branding Side (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-bg-surface border-r border-border-default flex-col justify-center px-12 lg:px-24 select-none animate-slide-in">
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-2">
            <span className="w-3.5 h-7 bg-accent rounded-[4px] inline-block"></span>
            <span>JEE Sheet</span>
          </div>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-8">
            The structured study sheet for serious JEE aspirants.
          </p>
          <div className="flex flex-col gap-3.5 text-text-secondary text-[13.5px] font-medium">
            <div className="flex items-center gap-3">
              <span className="text-accent text-sm">✦</span>
              <span>2000+ handpicked questions</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent text-sm">✦</span>
              <span>AI-powered progressive hints</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent text-sm">✦</span>
              <span>Timed chapter & subject mock tests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-bg-app">
        <div className="w-full max-w-[400px] bg-bg-surface border border-border-default rounded-lg p-8 shadow-xs animate-slide-in flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-1">Create your account</h2>
            <p className="text-[12.5px] text-text-secondary">
              Start tracking your JEE preparation journey
            </p>
          </div>

          {error && (
            <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12px] rounded-md flex items-start gap-2 animate-slide-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <Input
                type="email"
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  size="large"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted hover:text-text-primary p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 flex flex-col gap-1.5 animate-slide-in">
                  <div className="flex gap-1 h-[3px]">
                    <div className={`h-full flex-1 rounded-full ${strength >= 1 ? strengthConfig.color : 'bg-bg-subtle'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength >= 2 ? strengthConfig.color : 'bg-bg-subtle'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength >= 3 ? strengthConfig.color : 'bg-bg-subtle'}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-text-secondary">
                    {strengthConfig.text}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  size="large"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-text-muted hover:text-text-primary p-1 cursor-pointer transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                id="agree"
                required
                disabled={loading}
              />
              <label htmlFor="agree" className="text-[12px] text-text-secondary cursor-pointer select-none">
                I agree to the Terms of Service
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full h-10 mt-2 font-medium"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-between text-[11px] text-text-disabled uppercase font-semibold">
            <span className="w-[42%] border-b border-border-default"></span>
            <span>or</span>
            <span className="w-[42%] border-b border-border-default"></span>
          </div>

          {/* Google signup container */}
          <div className="flex justify-center select-none">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed. Try again.')}
              theme={theme === 'dark' ? 'filled_dark' : 'outline'}
              shape="rectangular"
              width="336"
            />
          </div>

          {/* Footer links */}
          <div className="text-center pt-4 border-t border-border-default/60">
            <p className="text-[12.5px] text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
