import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { isUserAdmin, seedDatabaseIfNeeded } from './lib/dbUtils';
import { Language } from './types';

// UI Components
import Header from './components/Header';
import SurveyForm from './components/SurveyForm';
import AdminDashboard from './components/AdminDashboard';
import WelcomeModal from './components/WelcomeModal';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('TH');
  
  // Modals state
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Initialize app, seed if needed, and check welcome popup
  useEffect(() => {
    // 1. Check if user already dismissed welcome popup
    const dismissed = localStorage.getItem('bu_survey_welcome_dismissed');
    if (!dismissed) {
      setIsWelcomeOpen(true);
    }

    // 2. Initial Seeding attempt in background
    async function initApp() {
      try {
        await seedDatabaseIfNeeded();
      } catch (err) {
        console.warn('Initial seed check:', err);
      }
    }
    initApp();

    // 3. Auth listener (asynchronous in background, non-blocking)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        const adminCheck = await isUserAdmin(email);
        
        setIsAdmin(adminCheck);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });

        // If authenticated as admin, allow entering admin view
        if (adminCheck) {
          setIsAdminView(true);
        }
      } else {
        // Unauthenticated guest user: survey is fully available immediately
        // Don't clear user if it's an admin passcode session
        setUser((prev: any) => (prev?.isAdminSession ? prev : null));
        setIsAdmin((prev) => (user?.isAdminSession ? true : false));
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle language switching
  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => (prev === 'TH' ? 'EN' : 'TH'));
  };

  // Welcome modal close
  const handleWelcomeClose = (dontShowAgain: boolean) => {
    setIsWelcomeOpen(false);
    if (dontShowAgain) {
      localStorage.setItem('bu_survey_welcome_dismissed', 'true');
    }
  };

  // Admin login success
  const handleAdminLoginSuccess = (adminUser: any) => {
    setUser(adminUser);
    setIsAdmin(true);
    setIsAdminView(true);
    setIsAdminLoginOpen(false);
  };

  // Sign out admin
  const handleSignOutAdmin = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setIsAdmin(false);
      setIsAdminView(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-sky-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#003399] border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Bangkok University QA Systems
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-sky-50 via-blue-50 to-slate-100 min-h-screen font-sans text-slate-700 pb-16">
      
      {/* Welcome Popup Dialog */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleWelcomeClose}
        currentLanguage={currentLanguage}
      />

      {/* Admin Login Modal (Restricted to pornpun.w@bu.ac.th) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        currentLanguage={currentLanguage}
      />

      {/* Header element */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
        user={user}
        isAdmin={isAdmin}
        isAdminView={isAdminView}
        onToggleAdminView={() => setIsAdminView(prev => !prev)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenWelcomeModal={() => setIsWelcomeOpen(true)}
        onSignOut={handleSignOutAdmin}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto mt-2 px-2 sm:px-4 md:px-6">
        {isAdmin && isAdminView ? (
          /* Admin Executive Dashboard (For pornpun.w@bu.ac.th to present to university leadership) */
          <AdminDashboard
            currentLanguage={currentLanguage}
            adminEmail={user?.email || 'pornpun.w@bu.ac.th'}
          />
        ) : (
          /* Survey Form (Directly open to anyone to complete and submit) */
          <SurveyForm
            currentLanguage={currentLanguage}
            user={user}
            onOpenWelcomeModal={() => setIsWelcomeOpen(true)}
          />
        )}
      </main>
    </div>
  );
}
