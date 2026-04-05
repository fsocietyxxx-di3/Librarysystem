import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, BookOpen, Users, Library } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = login(email, password);
    if (success) {
      if (email.includes('librarian')) {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      setError('Invalid credentials. Please use the demo accounts below.');
    }
    setLoading(false);
  };

  const fillDemo = (type: 'student' | 'librarian') => {
    setEmail(type === 'student' ? 'student@school.edu' : 'librarian@school.edu');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

        {/* Left: Branding */}
        <div className="text-white hidden lg:flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5">
              <GraduationCap size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">EduLib</h1>
              <p className="text-blue-300 text-sm">Westfield Academy Library</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-snug">
            Your Gateway to<br />Knowledge & Discovery
          </h2>
          <p className="text-blue-200 text-base mb-10 leading-relaxed">
            Access thousands of books, track your borrowings, discover new reads, and manage your academic journey — all in one place.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: '12,000+', sub: 'Books Available', icon: BookOpen },
              { label: '850', sub: 'Active Students', icon: Users },
              { label: '98%', sub: 'Satisfaction Rate', icon: Library },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                  <Icon size={20} className="text-blue-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.label}</div>
                  <div className="text-blue-300 text-xs mt-1">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">New books added every week</div>
              <div className="text-blue-300 text-xs mt-0.5">Stay updated with the latest additions to our collection</div>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="bg-blue-600 rounded-xl p-2.5">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduLib</h1>
              <p className="text-gray-500 text-xs">Westfield Academy Library</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to access your library account</p>

          {/* Demo accounts */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('student')}
                className="flex flex-col items-center gap-1 bg-white border border-blue-200 rounded-xl px-3 py-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors group text-left"
              >
                <div className="text-lg">🎓</div>
                <div className="text-xs font-semibold text-gray-800 group-hover:text-white">Student</div>
                <div className="text-gray-400 group-hover:text-blue-100" style={{ fontSize: '10px' }}>Alex Johnson</div>
              </button>
              <button
                onClick={() => fillDemo('librarian')}
                className="flex flex-col items-center gap-1 bg-white border border-amber-200 rounded-xl px-3 py-3 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors group text-left"
              >
                <div className="text-lg">🔑</div>
                <div className="text-xs font-semibold text-gray-800 group-hover:text-white">Librarian</div>
                <div className="text-gray-400 group-hover:text-amber-100" style={{ fontSize: '10px' }}>Mrs. Sarah Smith</div>
              </button>
            </div>
            <p className="text-gray-400 text-center mt-2" style={{ fontSize: '10px' }}>Password: password123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@school.edu"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In to Library'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6" style={{ fontSize: '11px' }}>
            © 2026 Westfield Academy Library System • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
