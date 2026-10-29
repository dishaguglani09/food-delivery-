// ============================================================================
// CASA TÒPAZ — Authentication Page (Login & Register)
// Luxury split-screen layout with guest demo access, validation,
// and session persistence.
// ============================================================================

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginDemo, isLoading } = useAuth();
  const { showToast } = useToast();

  // Check if route was /register
  const isRegisterRoute = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterRoute);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.password) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      if (success) {
        navigate('/menu');
      }
    } else {
      if (!formData.email || !formData.password) {
        showToast('Please enter your email and password', 'error');
        return;
      }
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/menu');
      }
    }
  };

  const handleDemoSignIn = () => {
    loginDemo();
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-[#0d0c0c] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-stone-200">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-amber-950/40 shadow-2xl bg-[#141211]">
        {/* Left Column: Visual Ambience & Brand Statement */}
        <div className="md:col-span-5 relative bg-stone-900 min-h-[300px] md:min-h-full flex flex-col justify-between p-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
            alt="CASA TÒPAZ Ambience"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top Return link */}
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Middle / Bottom Narrative */}
          <div className="relative z-10 space-y-3 pt-12">
            <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
              T
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              CASA TÒPAZ
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Join the Tòpaz Privilege Club to save delivery addresses, access dining history, and enjoy exclusive member allocations.
            </p>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          {/* Tabs Selector */}
          <div className="flex border-b border-stone-850">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 text-center text-sm font-serif font-medium border-b-2 transition-colors cursor-pointer ${
                !isRegister
                  ? 'border-amber-500 text-white font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 text-center text-sm font-serif font-medium border-b-2 transition-colors cursor-pointer ${
                isRegister
                  ? 'border-amber-500 text-white font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Privilege Demo Account
              </span>
              <p className="text-[11px] text-stone-400">
                Elena Rostova · Grand Cru Club
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow cursor-pointer"
            >
              Instant Demo Sign In
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Clara Renaud"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300 block">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.ch"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 block">
                  Phone Number (for courier contact)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+41 79 000 00 00"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-stone-300">
                  Password *
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => showToast('Please contact our concierge to reset your credentials', 'info')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              <span>{isRegister ? 'Join Club Tòpaz' : 'Sign In to My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500/80" />
              Your personal information remains strictly confidential.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
