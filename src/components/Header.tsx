import { useMemo } from 'react';
import { 
  LogOut, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Info,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { Language } from '../types';
import { uiTranslations } from '../lib/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageToggle: () => void;
  user: any;
  isAdmin: boolean;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  onOpenAdminLogin: () => void;
  onOpenWelcomeModal: () => void;
  onSignOut: () => void;
}

export default function Header({
  currentLanguage,
  onLanguageToggle,
  user,
  isAdmin,
  isAdminView,
  onToggleAdminView,
  onOpenAdminLogin,
  onOpenWelcomeModal,
  onSignOut
}: HeaderProps) {
  
  const text = useMemo(() => {
    return {
      title: uiTranslations.appTitle[currentLanguage],
      signOut: uiTranslations.signOut[currentLanguage],
      survey: uiTranslations.navSurvey[currentLanguage],
      adminPanel: uiTranslations.adminSection[currentLanguage]
    };
  }, [currentLanguage]);

  const isTH = currentLanguage === 'TH';

  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-40 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        
        {/* Logo & School Branding */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#003399] to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-sm shrink-0 border border-blue-300/30">
              BU
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#003399] leading-snug">
                <span className="sm:hidden">{isTH ? 'แบบประเมินความพึงพอใจอาจารย์' : 'Faculty Satisfaction Survey'}</span>
                <span className="hidden sm:inline">{text.title}</span>
              </h1>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 tracking-wide font-medium mt-0.5">
                มหาวิทยาลัยกรุงเทพ • Bangkok University QA
              </p>
            </div>
          </div>

          {/* Mobile-only quick language toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <Globe size={13} />
              <span>{currentLanguage === 'TH' ? 'EN' : 'TH'}</span>
            </button>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center justify-end w-full md:w-auto flex-wrap gap-2 sm:gap-2.5">
          
          {/* Welcome Info & Privacy button (Always available) */}
          <button
            onClick={onOpenWelcomeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer touch-manipulation"
            title={isTH ? 'ดูวัตถุประสงค์และการรักษาความลับ' : 'View Purpose & Confidentiality'}
          >
            <Info size={15} className="text-blue-600 shrink-0" />
            <span className="hidden sm:inline">
              {isTH ? 'วัตถุประสงค์ & การรักษาความลับ' : 'Objectives & Privacy'}
            </span>
            <span className="sm:hidden">{isTH ? 'คำชี้แจง & วัตถุประสงค์' : 'Info'}</span>
          </button>

          {/* Desktop Language Switcher */}
          <button
            onClick={onLanguageToggle}
            className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer touch-manipulation"
            title="Toggle Language (TH / EN)"
          >
            <Globe size={15} />
            <span>{currentLanguage === 'TH' ? 'EN' : 'TH'}</span>
          </button>

          {/* ADMIN NOT LOGGED IN -> Show Admin Login Button */}
          {!isAdmin && (
            <button
              id="admin-login-entry-btn"
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-[#003399] text-white shadow-xs hover:shadow transition-all cursor-pointer touch-manipulation"
              title={isTH ? 'สำหรับผู้ดูแลระบบ (นำเสนอผู้บริหาร)' : 'Admin Login for Executive Dashboard'}
            >
              <ShieldCheck size={15} className="text-amber-400 shrink-0" />
              <span>{isTH ? 'สำหรับผู้ดูแลระบบ' : 'Admin'}</span>
            </button>
          )}

          {/* ADMIN LOGGED IN -> Show Admin Controls & Status */}
          {user && isAdmin && (
            <>
              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

              {/* Admin identity pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border border-amber-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl">
                <ShieldCheck size={15} className="text-amber-600 shrink-0" />
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-amber-950 truncate max-w-[100px] sm:max-w-[150px]" title={user.email}>
                    {user.email || 'Admin'}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-amber-700 font-semibold">
                    Admin
                  </div>
                </div>
              </div>

              {/* Toggle Admin Dashboard vs Survey View */}
              <button
                id="header-admin-toggle"
                onClick={onToggleAdminView}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all border cursor-pointer touch-manipulation ${
                  isAdminView
                    ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                    : 'bg-[#003399] text-white border-[#003399] hover:bg-blue-800'
                }`}
              >
                {isAdminView ? <FileText size={14} /> : <BarChart3 size={14} />}
                <span>
                  {isAdminView 
                    ? (isTH ? 'หน้าแบบประเมิน' : 'Survey') 
                    : (isTH ? 'Dashboard' : 'Dashboard')}
                </span>
              </button>

              {/* Sign Out Button */}
              <button
                id="header-signout-btn"
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-all text-xs sm:text-sm font-bold cursor-pointer touch-manipulation"
                title="ออกจากระบบแอดมิน / Sign Out Admin"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{text.signOut}</span>
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
