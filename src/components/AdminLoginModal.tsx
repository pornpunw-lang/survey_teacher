import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { isUserAdmin } from '../lib/dbUtils';
import { Language } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  X, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: any) => void;
  currentLanguage: Language;
}

const AUTHORIZED_ADMIN_EMAIL = 'pornpun.w@bu.ac.th';
const VALID_PASSCODES = ['bu2569'];

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
  currentLanguage
}: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTH = currentLanguage === 'TH';

  // Google Sign-In with strict admin email restriction
  const handleGoogleAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      
      const adminAuthorized = await isUserAdmin(email);
      
      if (!adminAuthorized && email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        setError(
          isTH
            ? `ขออภัย บัญชี (${email}) ไม่มีสิทธิ์เข้าถึงหน้านี้ สิทธิ์ผู้ดูแลระบบสงวนไว้เฉพาะ ${AUTHORIZED_ADMIN_EMAIL} เท่านั้น`
            : `Access Denied: (${email}) is not authorized. Access is strictly restricted to ${AUTHORIZED_ADMIN_EMAIL}.`
        );
        return;
      }

      onSuccess({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'Pornpun W.'
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isTH ? 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' : 'Sign in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Passcode verification for direct seamless access
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const cleanCode = passcode.trim().toLowerCase();
    if (!cleanCode) {
      setError(isTH ? 'กรุณากรอกรหัสผ่านผู้ดูแลระบบ' : 'Please enter admin passcode');
      return;
    }

    if (VALID_PASSCODES.includes(cleanCode)) {
      onSuccess({
        uid: 'admin_pornpun_session',
        email: AUTHORIZED_ADMIN_EMAIL,
        displayName: 'Pornpun W. (Admin)',
        isAdminSession: true
      });
      onClose();
    } else {
      setError(isTH ? 'รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง' : 'Invalid admin passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#003399] to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles size={11} />
                Executive Access
              </span>
              <h3 className="text-lg font-bold text-white">
                {isTH ? 'เข้าสู่ระบบผู้ดูแลระบบ' : 'Admin & Executive Login'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-200 mt-2 leading-relaxed">
            {isTH 
              ? 'สำหรับจัดทำ Dashboard และนำเสนอผลสรุปแก่ผู้บริหาร' 
              : 'For reviewing aggregate survey summaries and preparing executive reports'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Access Policy Badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <Lock size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">
                {isTH ? 'สิทธิ์การเข้าถึงเฉพาะ:' : 'Restricted Access:'}
              </span>{' '}
              <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                {AUTHORIZED_ADMIN_EMAIL}
              </code>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Method 1: Google Login */}
          <button
            onClick={handleGoogleAdminLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer text-xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.05-6.53-4.82c-0.24-0.72-0.38-1.5-0.38-2.3 c0-0.8,0.14-1.58,0.38-2.3c0.92-2.77,3.5-4.82,6.53-4.82c1.65,0,3.13,0.6,4.3,1.58l2.03-2.03C16.56,2.12,14.43,1.2,12,1.2 C7.02,1.2,2.83,4.08,0.92,8.22c-0.34,0.74-0.54,1.55-0.54,2.4c0,0.85,0.2,1.66,0.54,2.4c1.91,4.14,6.1,7.02,10.98,7.02 c2.7,0,5.13-0.9,6.99-2.45l2.03,2.03C19.3,17.9,21.35,14.65,21.35,11.1z" fill="#4285F4" />
            </svg>
            <span>{isTH ? 'เข้าสู่ระบบด้วย Google (@bu.ac.th)' : 'Sign In with BU Google Account'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider absolute">
              {isTH ? 'หรือ' : 'OR'}
            </span>
          </div>

          {/* Method 2: Admin Passcode / Direct Verification */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound size={13} className="text-slate-500" />
                <span>{isTH ? 'รหัสผ่านผู้ดูแลระบบ (Admin Passcode)' : 'Admin Passcode'}</span>
              </label>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={isTH ? 'ระบุรหัสผ่านผู้ดูแลระบบ' : 'Enter admin passcode'}
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#003399] hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isTH ? 'ยืนยันเข้าสู่ระบบแอดมิน' : 'Authenticate Admin Access'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
