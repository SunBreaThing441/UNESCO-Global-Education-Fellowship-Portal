import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      // Provide more helpful error messages
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials or create a new account.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail('demo@scholartrack.com');
    setPassword('demo123456');
  };

  const createDemoAccount = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await signUp('demo@scholartrack.com', 'demo123456');
    
    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Demo account already exists. Try signing in with the demo credentials.');
      } else {
        setError(`Failed to create demo account: ${error.message}`);
      }
    } else {
      setError(null);
      // Auto-fill the form for immediate sign-in
      setEmail('demo@scholartrack.com');
      setPassword('demo123456');
      setIsSignUp(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ScholarTrack</h1>
          <p className="text-gray-600">Track and manage your scholarship applications</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>

          {/* Demo Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">
              <strong>Quick Start Options:</strong>
            </p>
            
            <div className="space-y-2">
              <button
                onClick={createDemoAccount}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition duration-200 disabled:opacity-50"
              >
                Create Demo Account
              </button>
              
              <button
                onClick={handleDemoLogin}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded text-sm font-medium transition duration-200"
              >
                Fill Demo Credentials
              </button>
            </div>
            
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
              <strong>Demo Credentials:</strong><br />
              Email: demo@scholartrack.com<br />
              Password: demo123456
            </div>
            
            <p className="text-xs text-blue-600 mt-2">
              Click "Create Demo Account" first, then use "Fill Demo Credentials" and sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}