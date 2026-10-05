import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp, 
  writeBatch 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  initialFaculties, 
  initialPrograms, 
  initialMajors, 
  initialQuestions, 
  DEFAULT_ADMINS 
} from '../data/seedData';
import { Faculty, Program, Major, Question, SurveyResponse, AppSettings } from '../types';

// Seeding function to initialize Firestore with master data
export async function seedDatabaseIfNeeded(): Promise<void> {
  // Prevent unauthenticated seeding attempts
  if (!auth.currentUser) {
    console.log('Skipping database verification: No authenticated user session.');
    return;
  }

  try {
    // 1. Seed Settings & Admins
    const settingsRef = doc(db, 'settings', 'config');
    let settingsSnap;
    try {
      settingsSnap = await getDoc(settingsRef);
    } catch (err) {
      console.warn('Could not read settings config for seeding, possibly permission-restricted. Skipping seed config.');
      return;
    }
    
    if (!settingsSnap.exists()) {
      console.log('Seeding settings config...');
      const defaultSettings: AppSettings = {
        id: 'config',
        academicYear: '2568',
        isOpen: true,
        googleAppsScriptUrl: '', // To be filled by user
        admins: DEFAULT_ADMINS
      };
      await setDoc(settingsRef, defaultSettings);
    }

    // 2. Seed/Sync Faculties
    const facultiesSnap = await getDocs(collection(db, 'faculties'));
    const dbFacs = facultiesSnap.docs.map(d => d.data() as Faculty);
    const facultiesNeedSync = facultiesSnap.size !== initialFaculties.length || initialFaculties.some(f => {
      const dbF = dbFacs.find(x => x.id === f.id);
      return !dbF || dbF.nameTH !== f.nameTH || dbF.nameEN !== f.nameEN;
    });
    if (facultiesNeedSync) {
      console.log('Faculties count or values changed. Seeding faculties...');
      const batch = writeBatch(db);
      facultiesSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      initialFaculties.forEach((f) => {
        batch.set(doc(db, 'faculties', f.id), f);
      });
      await batch.commit();
    }

    // 3. Seed/Sync Programs
    const programsSnap = await getDocs(collection(db, 'programs'));
    const dbProgs = programsSnap.docs.map(d => d.data() as Program);
    const programsNeedSync = programsSnap.size !== initialPrograms.length || initialPrograms.some(p => {
      const dbP = dbProgs.find(x => x.id === p.id);
      return !dbP || dbP.nameTH !== p.nameTH || dbP.nameEN !== p.nameEN || dbP.facultyId !== p.facultyId || dbP.educationLevel !== p.educationLevel;
    });
    if (programsNeedSync) {
      console.log('Programs count or values changed. Seeding programs...');
      const batch = writeBatch(db);
      programsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      initialPrograms.forEach((p) => {
        batch.set(doc(db, 'programs', p.id), p);
      });
      await batch.commit();
    }

    // 4. Seed/Sync Majors
    const majorsSnap = await getDocs(collection(db, 'majors'));
    const dbMajs = majorsSnap.docs.map(d => d.data() as Major);
    const majorsNeedSync = majorsSnap.size !== initialMajors.length || initialMajors.some(m => {
      const dbM = dbMajs.find(x => x.id === m.id);
      return !dbM || dbM.nameTH !== m.nameTH || dbM.nameEN !== m.nameEN || dbM.programId !== m.programId;
    });
    if (majorsNeedSync) {
      console.log('Majors count or values changed. Seeding majors...');
      const batch = writeBatch(db);
      majorsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      initialMajors.forEach((m) => {
        batch.set(doc(db, 'majors', m.id), m);
      });
      await batch.commit();
    }

    // 5. Seed Questions
    const questionsSnap = await getDocs(collection(db, 'questions'));
    const hasQ1_4 = questionsSnap.docs.some(doc => doc.id === 'q1_4');
    if (questionsSnap.empty || !hasQ1_4) {
      console.log('Seeding or migrating questions to new version...');
      const batch = writeBatch(db);
      
      // Delete old standard questions first (those starting with 'q')
      questionsSnap.docs.forEach((doc) => {
        if (doc.id.startsWith('q')) {
          batch.delete(doc.ref);
        }
      });
      
      // Add new standard questions
      initialQuestions.forEach((q) => {
        batch.set(doc(db, 'questions', q.id), q);
      });
      await batch.commit();
    }

    console.log('Database verification & seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// In-memory cache for ultra-fast instant UI rendering
let cachedFaculties: Faculty[] | null = null;
let cachedPrograms: Program[] | null = null;
let cachedMajors: Major[] | null = null;
let cachedQuestions: Question[] | null = null;
let cachedSettings: AppSettings | null = null;

// Fetch all faculties with robust fallback to mock data & in-memory cache
export async function getFaculties(): Promise<Faculty[]> {
  if (cachedFaculties && cachedFaculties.length > 0) return cachedFaculties;
  try {
    const snap = await getDocs(collection(db, 'faculties'));
    if (!snap.empty) {
      cachedFaculties = snap.docs.map(doc => doc.data() as Faculty);
      return cachedFaculties;
    }
  } catch (err) {
    console.warn('Failed to fetch faculties from database, falling back to local seed data:', err);
  }
  cachedFaculties = initialFaculties;
  return cachedFaculties;
}

// Fetch all programs with robust fallback to mock data & in-memory cache
export async function getPrograms(): Promise<Program[]> {
  if (cachedPrograms && cachedPrograms.length > 0) return cachedPrograms;
  try {
    const snap = await getDocs(collection(db, 'programs'));
    if (!snap.empty) {
      cachedPrograms = snap.docs.map(doc => doc.data() as Program);
      return cachedPrograms;
    }
  } catch (err) {
    console.warn('Failed to fetch programs from database, falling back to local seed data:', err);
  }
  cachedPrograms = initialPrograms;
  return cachedPrograms;
}

// Fetch all majors with robust fallback to mock data & in-memory cache
export async function getMajors(): Promise<Major[]> {
  if (cachedMajors && cachedMajors.length > 0) return cachedMajors;
  try {
    const snap = await getDocs(collection(db, 'majors'));
    if (!snap.empty) {
      cachedMajors = snap.docs.map(doc => doc.data() as Major);
      return cachedMajors;
    }
  } catch (err) {
    console.warn('Failed to fetch majors from database, falling back to local seed data:', err);
  }
  cachedMajors = initialMajors;
  return cachedMajors;
}

// Fetch all questions with robust fallback to mock data & in-memory cache
export async function getQuestions(): Promise<Question[]> {
  if (cachedQuestions && cachedQuestions.length > 0) return cachedQuestions;
  try {
    const snap = await getDocs(collection(db, 'questions'));
    if (!snap.empty) {
      const list = snap.docs.map(doc => doc.data() as Question);
      cachedQuestions = list.sort((a, b) => {
        if (a.section !== b.section) return a.section - b.section;
        return a.order - b.order;
      });
      return cachedQuestions;
    }
  } catch (err) {
    console.warn('Failed to fetch questions from database, falling back to local seed data:', err);
  }
  cachedQuestions = [...initialQuestions].sort((a, b) => {
    if (a.section !== b.section) return a.section - b.section;
    return a.order - b.order;
  });
  return cachedQuestions;
}

// Fetch current app settings with robust fallback & cache
export async function getAppSettings(): Promise<AppSettings> {
  if (cachedSettings) return cachedSettings;
  const defaultSettings: AppSettings = {
    id: 'config',
    academicYear: '',
    isOpen: true,
    googleAppsScriptUrl: '',
    admins: DEFAULT_ADMINS
  };

  try {
    const docRef = doc(db, 'settings', 'config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      cachedSettings = snap.data() as AppSettings;
      return cachedSettings;
    }
  } catch (err) {
    console.warn('Failed to fetch app settings from database, falling back to default settings:', err);
  }
  cachedSettings = defaultSettings;
  return cachedSettings;
}

// Save app settings
export async function saveAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'config');
  await setDoc(docRef, settings, { merge: true });
  if (cachedSettings) {
    cachedSettings = { ...cachedSettings, ...settings };
  }
}

// Check if email is admin
export async function isUserAdmin(email: string): Promise<boolean> {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'pornpun.w@bu.ac.th') return true;
  try {
    const settings = await getAppSettings();
    return settings.admins.some(adminEmail => adminEmail.toLowerCase() === cleanEmail);
  } catch (err) {
    console.warn('Failed to check admin status, falling back to local DEFAULT_ADMINS:', err);
    return DEFAULT_ADMINS.some(adminEmail => adminEmail.toLowerCase() === cleanEmail);
  }
}

// Submit survey response
export async function submitResponse(response: Omit<SurveyResponse, 'timestamp'>): Promise<string> {
  const responsesCol = collection(db, 'responses');
  const docRef = await addDoc(responsesCol, {
    ...response,
    timestamp: Timestamp.now()
  });
  
  // Try sending email notification via Apps Script if configured
  try {
    const settings = await getAppSettings();
    if (settings.googleAppsScriptUrl) {
      triggerAppsScriptEmail(settings.googleAppsScriptUrl, {
        action: 'SUBMIT_SURVEY',
        email: response.userEmail,
        academicYear: response.academicYear,
        facultyName: response.facultyNameTH,
        programName: response.programNameTH,
        respondentType: response.respondentType
      });
    }
  } catch (e) {
    console.error('Apps Script integration error:', e);
  }

  return docRef.id;
}

// Send Email via Google Apps Script Web App
export async function triggerAppsScriptEmail(url: string, payload: any): Promise<boolean> {
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Essential to bypass CORS since Google Web Apps redirect
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger Apps Script email:', err);
    return false;
  }
}

// Clear all responses in Firebase (Admin Only)
export async function clearAllResponses(adminEmail: string): Promise<void> {
  const snap = await getDocs(collection(db, 'responses'));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.delete(doc(db, 'responses', d.id));
  });
  await batch.commit();

  // Notify via Apps Script
  try {
    const settings = await getAppSettings();
    if (settings.googleAppsScriptUrl) {
      await triggerAppsScriptEmail(settings.googleAppsScriptUrl, {
        action: 'CLEAR_RESPONSES',
        adminEmail,
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {
    console.error(e);
  }
}

// Calculate Mean and Standard Deviation from scores
export function calculateStats(scores: number[]) {
  const n = scores.length;
  if (n === 0) return { mean: 0, sd: 0, count: 0 };
  
  const mean = scores.reduce((sum, val) => sum + val, 0) / n;
  
  const sumOfSquares = scores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  const sd = Math.sqrt(sumOfSquares / n); // Population SD
  
  return {
    mean: Number(mean.toFixed(2)),
    sd: Number(sd.toFixed(2)),
    count: n
  };
}

// Real-time listener for Survey responses
export function listenToResponses(callback: (responses: SurveyResponse[]) => void) {
  const q = collection(db, 'responses');
  return onSnapshot(q, (snapshot) => {
    const responses: SurveyResponse[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      responses.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date()
      } as SurveyResponse);
    });
    callback(responses);
  });
}

// Manually force-reseed/sync Faculties, Programs, Majors and Questions
export async function forceSeedDatabase(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Not authenticated.');
  }
  
  // Force seed settings
  const settingsRef = doc(db, 'settings', 'config');
  const defaultSettings: AppSettings = {
    id: 'config',
    academicYear: '2568',
    isOpen: true,
    googleAppsScriptUrl: '',
    admins: DEFAULT_ADMINS
  };
  await setDoc(settingsRef, defaultSettings);

  // Force seed faculties
  const facultiesSnap = await getDocs(collection(db, 'faculties'));
  let batch = writeBatch(db);
  facultiesSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  initialFaculties.forEach((f) => {
    batch.set(doc(db, 'faculties', f.id), f);
  });
  await batch.commit();

  // Force seed programs
  const programsSnap = await getDocs(collection(db, 'programs'));
  batch = writeBatch(db);
  programsSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  initialPrograms.forEach((p) => {
    batch.set(doc(db, 'programs', p.id), p);
  });
  await batch.commit();

  // Force seed majors
  const majorsSnap = await getDocs(collection(db, 'majors'));
  batch = writeBatch(db);
  majorsSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  initialMajors.forEach((m) => {
    batch.set(doc(db, 'majors', m.id), m);
  });
  await batch.commit();

  // Force seed questions
  const questionsSnap = await getDocs(collection(db, 'questions'));
  batch = writeBatch(db);
  questionsSnap.docs.forEach((doc) => {
    if (doc.id.startsWith('q')) {
      batch.delete(doc.ref);
    }
  });
  initialQuestions.forEach((q) => {
    batch.set(doc(db, 'questions', q.id), q);
  });
  await batch.commit();
}
