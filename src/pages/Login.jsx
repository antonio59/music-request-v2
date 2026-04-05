import { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { Hash, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, showToast } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(username, pin);
    
    if (!result.success) {
      setError(result.error);
      showToast('Login failed', 'error');
    } else {
      showToast('Welcome back! 🎵', 'success');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Music Request
          </h1>
          <p className="text-gray-600 mt-2">Enter your PIN to get started</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="e.g., cristina, isabella, parent"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                required
                autoComplete="current-password"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">4-digit PIN</p>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
          >
            Login
          </motion.button>
        </form>

        {/* Quick reference */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-2 text-center">Demo Accounts:</p>
          <div className="space-y-1 text-xs">
            <p>👧 Cristina (Yoto): <code className="bg-white px-2 py-1 rounded">cristina</code> / <code className="bg-white px-2 py-1 rounded">1234</code></p>
            <p>👩 Isabella (iPod): <code className="bg-white px-2 py-1 rounded">isabella</code> / <code className="bg-white px-2 py-1 rounded">5678</code></p>
            <p>👨‍👩‍👧‍👦 Parent: <code className="bg-white px-2 py-1 rounded">parent</code> / <code className="bg-white px-2 py-1 rounded">9999</code></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
