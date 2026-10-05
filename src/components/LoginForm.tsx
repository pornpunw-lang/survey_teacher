import { useState, useMemo } from 'react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Language } from '../types';
import { uiTranslations } from '../lib/translations';
import { LogIn, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  currentLanguage: Language;
  onSuccess: (user: any) => void;
  onBypass: (email: string) => void;
}

export default function LoginForm({ currentLanguage, onSuccess, onBypass }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const translations = useMemo(() => {
    return {
      title: uiTranslations.loginTitle[currentLanguage],
      subtitle: uiTranslations.loginSubtitle[currentLanguage],
      loginBtn: uiTranslations.loginBtn[currentLanguage],
      unauthorized: uiTranslations.unauthorizedUser[currentLanguage],
      objectiveTitle: uiTranslations.objectiveTitle[currentLanguage],
      objectiveText: uiTranslations.objectiveText[currentLanguage],
      ratingLegendTitle: uiTranslations.ratingLegendTitle[currentLanguage],
      rating5: uiTranslations.rating5[currentLanguage],
      rating4: uiTranslations.rating4[currentLanguage],
      rating3: uiTranslations.rating3[currentLanguage],
      rating2: uiTranslations.rating2[currentLanguage],
      rating1: uiTranslations.rating1[currentLanguage],
    };
  }, [currentLanguage]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      
      // Enforce Bangkok University Domain Validation (@bu.ac.th)
      if (!email.toLowerCase().endsWith('@bu.ac.th')) {
        await auth.signOut();
        setError(translations.unauthorized);
        setLoading(false);
        return;
      }
      
      onSuccess(result.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = (role: 'admin' | 'respondent') => {
    // Easily mock login as desired BU user for review
    const mockEmail = role === 'admin' ? 'pornpun.w@bu.ac.th' : 'ajarn.somsak@bu.ac.th';
    onBypass(mockEmail);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Banner Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#003399] via-blue-700 to-[#003399] p-8 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block bg-amber-400 text-[#003399] font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">
              BU Quality Assurance
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
              {translations.title}
            </h2>
            <p className="text-blue-100 text-xs font-medium leading-relaxed">
              {translations.objectiveText}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-blue-200">
            © 2026 Bangkok University. All rights reserved.
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center bg-slate-50">
          <div className="space-y-6">
            
            {/* Login Greeting */}
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {currentLanguage === 'TH' ? 'ลงชื่อเข้าใช้งาน' : 'Sign In To System'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {translations.subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-lg">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Authentication Button */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.05-6.53-4.82c-0.24-0.72-0.38-1.5-0.38-2.3 c0-0.8,0.14-1.58,0.38-2.3c0.92-2.77,3.5-4.82,6.53-4.82c1.65,0,3.13,0.6,4.3,1.58l2.03-2.03C16.56,2.12,14.43,1.2,12,1.2 C7.02,1.2,2.83,4.08,0.92,8.22c-0.34,0.74-0.54,1.55-0.54,2.4c0,0.85,0.2,1.66,0.54,2.4c1.91,4.14,6.1,7.02,10.98,7.02 c2.7,0,5.13-0.9,6.99-2.45l2.03,2.03C19.3,17.9,21.35,14.65,21.35,11.1z" fill="#4285F4" />
                </g>
              </svg>
              <span>{loading ? translations.submitting : translations.loginBtn}</span>
            </button>

            {/* Educational Rating Reference */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-amber-700" />
                {translations.ratingLegendTitle}
              </h4>
              <ul className="text-[11px] space-y-1 text-slate-600 font-medium">
                <li>{translations.rating5}</li>
                <li>{translations.rating4}</li>
                <li>{translations.rating3}</li>
                <li>{translations.rating2}</li>
                <li>{translations.rating1}</li>
              </ul>
            </div>

            {/* Sandbox Testing Options (Developer Friendly) */}
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider bg-slate-100 px-2.5 py-1 rounded border">
                  ระบบจำลองการเข้าใช้งานสำหรับทดสอบระบบ
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Admin Role */}
                <button
                  id="bypass-admin-btn"
                  onClick={() => handleDemoBypass('admin')}
                  className="flex flex-col items-center justify-center p-3 bg-white hover:bg-amber-50 text-slate-700 border border-amber-200 rounded-xl transition-all shadow-sm hover:shadow hover:border-amber-400 group cursor-pointer"
                >
                  <ShieldCheck size={20} className="text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">ทดสอบในฐานะผู้ดูแลระบบ</span>
                  <span className="text-[10px] text-slate-400">pornpun.w@bu.ac.th</span>
                </button>

                {/* Regular Respondent Role */}
                <button
                  id="bypass-user-btn"
                  onClick={() => handleDemoBypass('respondent')}
                  className="flex flex-col items-center justify-center p-3 bg-white hover:bg-blue-50 text-slate-700 border border-blue-200 rounded-xl transition-all shadow-sm hover:shadow hover:border-blue-400 group cursor-pointer"
                >
                  <LogIn size={20} className="text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">ทดสอบในฐานะอาจารย์</span>
                  <span className="text-[10px] text-slate-400">ajarn.somsak@bu.ac.th</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-normal">
                หมายเหตุ: ปุ่มจำลองเหล่านี้ช่วยให้ท่านสามารถประเมินระบบทั้งในมุมมองของอาจารย์ผู้ตอบแบบสำรวจ และแผงควบคุมผู้ดูแลระบบได้ โดยไม่ต้องใช้บัญชี Google จริง
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
