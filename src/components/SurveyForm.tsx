import React, { useState, useEffect, useMemo } from 'react';
import { 
  getFaculties, 
  getPrograms, 
  getMajors, 
  getQuestions, 
  submitResponse,
  getAppSettings 
} from '../lib/dbUtils';
import { Faculty, Program, Major, Question, SurveyResponse, Language } from '../types';
import { uiTranslations } from '../lib/translations';
import { 
  sections, 
  initialFaculties, 
  initialPrograms, 
  initialMajors, 
  initialQuestions 
} from '../data/seedData';
import { 
  CheckCircle, 
  HelpCircle, 
  User, 
  ChevronRight, 
  Award, 
  Info,
  AlertTriangle,
  ClipboardList,
  Sparkles
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SurveyFormProps {
  currentLanguage: Language;
  user?: any;
  onOpenWelcomeModal?: () => void;
}

const RATING_CONFIG: Record<number, {
  labelTH: string;
  labelEN: string;
  subTH: string;
  subEN: string;
  numberColor: string;
  textColor: string;
  unselectedClass: string;
  selectedClass: string;
}> = {
  5: {
    labelTH: 'มากที่สุด',
    labelEN: 'Highest',
    subTH: 'มากที่สุด',
    subEN: 'Highest',
    numberColor: 'text-emerald-700',
    textColor: 'text-emerald-800',
    unselectedClass: 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-200/90 hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5',
    selectedClass: 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white border-emerald-600 shadow-xl shadow-emerald-600/35 ring-4 ring-emerald-300/80 scale-105 -translate-y-1'
  },
  4: {
    labelTH: 'มาก',
    labelEN: 'High',
    subTH: 'มาก',
    subEN: 'High',
    numberColor: 'text-[#003399]',
    textColor: 'text-blue-800',
    unselectedClass: 'bg-white hover:bg-blue-50 text-blue-950 border-blue-200/90 hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5',
    selectedClass: 'bg-gradient-to-b from-[#003399] via-blue-700 to-indigo-800 text-white border-blue-700 shadow-xl shadow-blue-700/35 ring-4 ring-blue-300/80 scale-105 -translate-y-1'
  },
  3: {
    labelTH: 'ปานกลาง',
    labelEN: 'Moderate',
    subTH: 'ปานกลาง',
    subEN: 'Moderate',
    numberColor: 'text-amber-600',
    textColor: 'text-amber-800',
    unselectedClass: 'bg-white hover:bg-amber-50 text-amber-950 border-amber-200/90 hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5',
    selectedClass: 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-500 shadow-xl shadow-amber-500/35 ring-4 ring-amber-300/80 scale-105 -translate-y-1'
  },
  2: {
    labelTH: 'น้อย',
    labelEN: 'Low',
    subTH: 'น้อย',
    subEN: 'Low',
    numberColor: 'text-orange-600',
    textColor: 'text-orange-800',
    unselectedClass: 'bg-white hover:bg-orange-50 text-orange-950 border-orange-200/90 hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5',
    selectedClass: 'bg-gradient-to-b from-orange-500 via-orange-600 to-amber-700 text-white border-orange-600 shadow-xl shadow-orange-600/35 ring-4 ring-orange-300/80 scale-105 -translate-y-1'
  },
  1: {
    labelTH: 'น้อยที่สุด',
    labelEN: 'Lowest',
    subTH: 'น้อยที่สุด',
    subEN: 'Lowest',
    numberColor: 'text-rose-600',
    textColor: 'text-rose-800',
    unselectedClass: 'bg-white hover:bg-rose-50 text-rose-950 border-rose-200/90 hover:border-rose-500 hover:shadow-md hover:-translate-y-0.5',
    selectedClass: 'bg-gradient-to-b from-rose-500 via-rose-600 to-red-700 text-white border-rose-600 shadow-xl shadow-rose-600/35 ring-4 ring-rose-300/80 scale-105 -translate-y-1'
  }
};

export default function SurveyForm({ currentLanguage, user, onOpenWelcomeModal }: SurveyFormProps) {
  const isTH = currentLanguage === 'TH';

  // Master data state - pre-populated with master data for instant 0ms load
  const [faculties, setFaculties] = useState<Faculty[]>(initialFaculties);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [majors, setMajors] = useState<Major[]>(initialMajors);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [academicYear, setAcademicYear] = useState('');
  const [isSurveyOpen, setIsSurveyOpen] = useState(true);

  // Respondent Profile state
  const [educationLevel, setEducationLevel] = useState<'Bachelor' | 'Master' | 'Doctorate'>('Bachelor');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [respondentType, setRespondentType] = useState<'Leader' | 'Regular' | 'Teacher'>('Leader');
  const [isNewTeacher, setIsNewTeacher] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Survey Answers state
  // Key: questionId, Value: rating (1-5)
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  // Open ended state
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [comments, setComments] = useState('');

  // App & loading state (non-blocking for ultra-fast startup)
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingResponseId, setExistingResponseId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load master data and existing responses in background
  useEffect(() => {
    async function loadData() {
      try {
        const [facs, progs, majs, quests, settings] = await Promise.all([
          getFaculties(),
          getPrograms(),
          getMajors(),
          getQuestions(),
          getAppSettings()
        ]);

        if (facs && facs.length > 0) setFaculties(facs);
        if (progs && progs.length > 0) setPrograms(progs);
        if (majs && majs.length > 0) setMajors(majs);
        if (quests && quests.length > 0) setQuestions(quests);
        if (settings) {
          setAcademicYear(settings.academicYear || '');
          setIsSurveyOpen(settings.isOpen !== false);
        }

        // Check for existing response by current user if logged in
        if (user && user.email) {
          const q = query(
            collection(db, 'responses'),
            where('userEmail', '==', user.email)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            // Pre-populate with previous response to support Editing (แก้ไขคำตอบตนเอง)
            const docData = snap.docs[0].data() as SurveyResponse;
            setExistingResponseId(snap.docs[0].id);
            setEducationLevel(docData.educationLevel);
            setSelectedFaculty(docData.facultyId);
            setSelectedProgram(docData.programId);
            setSelectedMajor(docData.majorId);
            setRespondentType(docData.respondentType);
            setIsNewTeacher(docData.isNewTeacher);
            setRatings(docData.ratings || {});
            setStrengths(docData.strengths || '');
            setImprovements(docData.improvements || '');
            setComments(docData.comments || '');
          }
        }
      } catch (err) {
        console.error('Error loading survey setup:', err);
      }
    }
    
    loadData();
  }, [user]);

  // Handle cascading dropdown state resets
  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaculty(e.target.value);
    setSelectedProgram('');
    setSelectedMajor('');
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgram(e.target.value);
    setSelectedMajor('');
  };

  // Available faculties for the currently selected education level
  const availableFaculties = useMemo(() => {
    const validFacultyIds = new Set(programs.filter(p => p.educationLevel === educationLevel).map(p => p.facultyId));
    return faculties.filter(f => validFacultyIds.has(f.id));
  }, [faculties, programs, educationLevel]);

  // Filtered Programs list
  const filteredPrograms = useMemo(() => {
    if (!selectedFaculty) return [];
    return programs.filter(p => p.facultyId === selectedFaculty && p.educationLevel === educationLevel);
  }, [selectedFaculty, programs, educationLevel]);

  // Filtered Majors list
  const filteredMajors = useMemo(() => {
    if (!selectedProgram) return [];
    return majors.filter(m => m.programId === selectedProgram);
  }, [selectedProgram, majors]);

  // Auto-select program if there's only 1 option available
  useEffect(() => {
    if (filteredPrograms.length === 1 && selectedProgram !== filteredPrograms[0].id) {
      setSelectedProgram(filteredPrograms[0].id);
    }
  }, [filteredPrograms, selectedProgram]);

  // Auto-select major if there's only 1 option available
  useEffect(() => {
    if (filteredMajors.length === 1 && selectedMajor !== filteredMajors[0].id) {
      setSelectedMajor(filteredMajors[0].id);
    }
  }, [filteredMajors, selectedMajor]);

  // Questions applicable based on isNewTeacher selection
  const activeQuestions = useMemo(() => {
    return questions.filter(q => {
      // If it's q4_7 (orientation), only show if isNewTeacher is true
      if (q.isNewTeacherOnly) {
        return isNewTeacher;
      }
      return true;
    });
  }, [questions, isNewTeacher]);

  // Progress metrics calculation
  const totalQuestionsCount = activeQuestions.length;
  const answeredQuestionsCount = useMemo(() => {
    return activeQuestions.filter(q => ratings[q.id] !== undefined).length;
  }, [activeQuestions, ratings]);

  const progressPercent = useMemo(() => {
    if (totalQuestionsCount === 0) return 0;
    return Math.round((answeredQuestionsCount / totalQuestionsCount) * 100);
  }, [answeredQuestionsCount, totalQuestionsCount]);

  // Check translation labels
  const trans = useMemo(() => {
    return {
      profileHeader: uiTranslations.profileSection[currentLanguage],
      eduLevelLabel: uiTranslations.eduLevel[currentLanguage],
      bachelor: uiTranslations.bachelor[currentLanguage],
      master: uiTranslations.master[currentLanguage],
      doctorate: uiTranslations.doctorate[currentLanguage],
      facultyLabel: uiTranslations.faculty[currentLanguage],
      selectFaculty: uiTranslations.selectFaculty[currentLanguage],
      programLabel: uiTranslations.program[currentLanguage],
      selectProgram: uiTranslations.selectProgram[currentLanguage],
      majorLabel: uiTranslations.major[currentLanguage],
      selectMajor: uiTranslations.selectMajor[currentLanguage],
      typeLabel: uiTranslations.respondentType[currentLanguage],
      isNewTeacher: uiTranslations.isNewTeacher[currentLanguage],
      yes: uiTranslations.yes[currentLanguage],
      no: uiTranslations.no[currentLanguage],
      openHeader: uiTranslations.openEndedSection[currentLanguage],
      strengths: uiTranslations.strengthsLabel[currentLanguage],
      strengthsPl: uiTranslations.strengthsPlaceholder[currentLanguage],
      improvements: uiTranslations.improvementsLabel[currentLanguage],
      improvementsPl: uiTranslations.improvementsPlaceholder[currentLanguage],
      comments: uiTranslations.commentsLabel[currentLanguage],
      commentsPl: uiTranslations.commentsPlaceholder[currentLanguage],
      submitBtn: uiTranslations.submitBtn[currentLanguage],
      submitting: uiTranslations.submitting[currentLanguage],
      successMessage: uiTranslations.successMessage[currentLanguage]
    };
  }, [currentLanguage]);

  // Handle score button click
  const handleRatingChange = (qId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  // Function to validate profile (Step 0)
  const validateProfile = (): boolean => {
    if (!selectedFaculty) {
      setValidationError(currentLanguage === 'TH' ? 'กรุณาเลือกคณะสังกัด' : 'Please select your Faculty');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!selectedProgram) {
      setValidationError(currentLanguage === 'TH' ? 'กรุณาเลือกหลักสูตรที่เกี่ยวข้อง' : 'Please select your Program');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!selectedMajor) {
      setValidationError(currentLanguage === 'TH' ? 'กรุณาเลือกสาขาวิชา' : 'Please select your Major');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Function to validate questions in a specific section
  const validateSection = (sectionId: number): boolean => {
    const sectionQuestions = activeQuestions.filter(q => q.section === sectionId);
    const unanswered = sectionQuestions.filter(q => ratings[q.id] === undefined);
    if (unanswered.length > 0) {
      const qNum = unanswered[0];
      setValidationError(
        currentLanguage === 'TH' 
          ? `กรุณาตอบคำถามในด้านนี้ให้ครบถ้วนทุกข้อ (ยังไม่ได้ตอบข้อ ${qNum.section}.${qNum.order})` 
          : `Please answer all questions in this section. (Unanswered in ${qNum.section}.${qNum.order})`
      );
      
      // Smooth scroll to the unanswered element
      const element = document.getElementById(`q-container-${qNum.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Survey Form Submission Validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Profile
    if (!validateProfile()) {
      setCurrentStep(0);
      return;
    }

    // Validate all sections 1 to 5
    for (let s = 1; s <= 5; s++) {
      if (!validateSection(s)) {
        setCurrentStep(s);
        return;
      }
    }

    // Prepare complete data payload
    setSubmitting(true);
    try {
      const fac = faculties.find(f => f.id === selectedFaculty)!;
      const prog = programs.find(p => p.id === selectedProgram)!;
      const maj = majors.find(m => m.id === selectedMajor)!;

      // Clean answers - if not new teacher, remove orientation question if present
      const submissionRatings = { ...ratings };
      if (!isNewTeacher) {
        delete submissionRatings['q4_7'];
      }

      const respondentId = user?.uid || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const respondentEmail = user?.email || 'anonymous.faculty@bu.ac.th';

      const payload: Omit<SurveyResponse, 'timestamp'> = {
        userId: respondentId,
        userEmail: respondentEmail,
        academicYear,
        educationLevel,
        facultyId: selectedFaculty,
        facultyNameTH: fac.nameTH,
        facultyNameEN: fac.nameEN,
        programId: selectedProgram,
        programNameTH: prog.nameTH,
        programNameEN: prog.nameEN,
        majorId: selectedMajor,
        majorNameTH: maj.nameTH,
        majorNameEN: maj.nameEN,
        respondentType,
        isNewTeacher,
        ratings: submissionRatings,
        strengths,
        improvements,
        comments
      };

      // Submit or update
      await submitResponse(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting survey responses:', err);
      setValidationError(currentLanguage === 'TH' ? 'เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง' : 'Database error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSurveyOpen) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 max-w-lg mx-auto shadow-sm">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-900 font-sans">
            {currentLanguage === 'TH' ? 'ระบบปิดรับคำตอบ' : 'Survey System Closed'}
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {currentLanguage === 'TH' 
              ? `ระบบแบบสำรวจปิดรับการตอบแบบสอบถามชั่วคราวแล้ว หากมีข้อสอบถามกรุณาติดต่อผู้รับผิดชอบระบบประกันคุณภาพ`
              : `The survey system is currently closed. Please contact the Quality Assurance unit if you have any questions.`
            }
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 md:p-12 space-y-6">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800 font-sans">
              {currentLanguage === 'TH' ? 'บันทึกคำตอบเรียบร้อยแล้ว' : 'Response Recorded Successfully'}
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-md mx-auto">
              {trans.successMessage}
            </p>
          </div>
          
          <div className="bg-slate-50 border rounded-xl p-4 text-slate-500 text-xs text-left space-y-2 font-medium">
            <div className="flex items-center gap-2 text-slate-700 font-bold border-b pb-1.5">
              <Info size={14} className="text-[#003399]" />
              <span>{currentLanguage === 'TH' ? 'สรุปข้อมูลการส่ง' : 'Submission Summary'}</span>
            </div>
            <p><strong>{trans.facultyLabel}:</strong> {currentLanguage === 'TH' ? faculties.find(f => f.id === selectedFaculty)?.nameTH : faculties.find(f => f.id === selectedFaculty)?.nameEN}</p>
            <p><strong>{trans.programLabel}:</strong> {currentLanguage === 'TH' ? programs.find(p => p.id === selectedProgram)?.nameTH : programs.find(p => p.id === selectedProgram)?.nameEN}</p>
            <p><strong>{trans.typeLabel}:</strong> {respondentType === 'Leader' ? uiTranslations.typeLeader[currentLanguage] : respondentType === 'Regular' ? uiTranslations.typeRegular[currentLanguage] : uiTranslations.typeTeacher[currentLanguage]}</p>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#003399] hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer"
          >
            {currentLanguage === 'TH' ? 'แก้ไขคำตอบเพิ่มเติม' : 'Edit My Answers'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 md:px-6 py-4 sm:py-8">
      
      {/* Edit existing response banner */}
      {existingResponseId && (
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-amber-950 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ClipboardList className="text-amber-600 shrink-0" size={18} />
            <span className="leading-snug">
              {currentLanguage === 'TH' 
                ? `คุณมีประวัติการบันทึกแบบสำรวจอยู่แล้ว คุณสามารถแก้ไขและกดส่งเพื่ออัปเดตข้อมูลได้`
                : `You have already submitted a response. You can edit and re-submit to update your record.`
              }
            </span>
          </div>
          <span className="bg-amber-600 text-white font-bold px-2.5 py-1 rounded text-[11px] shrink-0">
            แก้ไขคำตอบเดิม
          </span>
        </div>
      )}

      {/* Objective & Privacy Assurance Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 sm:p-4 md:p-5 mb-5 sm:mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-[#003399] rounded-xl shrink-0 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center border border-blue-100/60 shadow-2xs mt-0.5">
              <ClipboardList size={18} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-800 leading-snug">
                <span>{trans.profileHeader}</span>
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-3xl">
                {uiTranslations.objectiveText[currentLanguage]}
              </p>
            </div>
          </div>

          {onOpenWelcomeModal && (
            <button
              type="button"
              onClick={onOpenWelcomeModal}
              className="self-start sm:self-center shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-blue-50 hover:bg-blue-100 text-[#003399] border border-blue-200/80 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs touch-manipulation"
            >
              <Info size={14} className="text-blue-600 shrink-0" />
              <span>{currentLanguage === 'TH' ? 'อ่านวัตถุประสงค์ & การรักษาความลับ' : 'Objectives & Privacy Notice'}</span>
            </button>
          )}
        </div>

        {/* Reassurance Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 text-[11px] sm:text-xs text-emerald-950 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></div>
          <span className="font-medium leading-relaxed">
            {currentLanguage === 'TH'
              ? 'การประเมินนี้ไม่ระบุตัวตน (Strictly Anonymous) ข้อมูลจะถูกเก็บเป็นความลับและประมวลผลเป็นภาพรวมเพื่อเสนอผู้บริหารเท่านั้น'
              : 'This survey is strictly anonymous. Responses are confidential and analyzed only in aggregate for leadership reports.'}
          </span>
        </div>
      </div>

      {/* STEP TRACKER - HIGHLY RESPONSIVE FOR MOBILE, TABLET & DESKTOP */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-6 sm:mb-8">
        {/* Mobile View with Quick Jump Indicators */}
        <div className="md:hidden space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {currentLanguage === 'TH' ? 'ขั้นตอนที่' : 'Step'} {currentStep + 1} / 6:{' '}
              <span className="text-[#003399] font-black">
                {currentStep === 0 
                  ? (currentLanguage === 'TH' ? 'ข้อมูลทั่วไป' : 'General Info') 
                  : (currentLanguage === 'TH' ? `ด้านที่ ${currentStep}` : `Section ${currentStep}`)
                }
              </span>
            </span>
            <span className="text-xs font-black bg-blue-50 text-[#003399] px-2.5 py-0.5 rounded-lg border border-blue-200 tabular-nums">
              {Math.round(((currentStep + 1) / 6) * 100)}%
            </span>
          </div>

          {/* Mobile Tap-friendly Step Dots */}
          <div className="grid grid-cols-6 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx < currentStep) {
                      setCurrentStep(idx);
                      setValidationError(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (idx > currentStep) {
                      let valid = true;
                      for (let s = currentStep; s < idx; s++) {
                        if (s === 0) valid = validateProfile();
                        else valid = validateSection(s);
                        if (!valid) { setCurrentStep(s); break; }
                      }
                      if (valid) {
                        setCurrentStep(idx);
                        setValidationError(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 touch-manipulation cursor-pointer ${
                    isActive ? 'bg-[#003399] ring-2 ring-blue-300' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                  title={`Step ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Tablet & Desktop View */}
        <div className="hidden md:flex items-center justify-between relative px-2">
          {[
            { id: 0, labelTH: 'ข้อมูลทั่วไป', labelEN: 'General Info' },
            { id: 1, labelTH: '1. ด้านหลักสูตร', labelEN: '1. Curriculum' },
            { id: 2, labelTH: '2. การเรียนสอน', labelEN: '2. Instruction' },
            { id: 3, labelTH: '3. ร้องเรียน/บริการ', labelEN: '3. Support' },
            { id: 4, labelTH: '4. บริหารอาจารย์', labelEN: '4. Faculty Mgt' },
            { id: 5, labelTH: '5. สิ่งสนับสนุน', labelEN: '5. Facilities' }
          ].map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;
            return (
              <React.Fragment key={st.id}>
                {/* Connecting Line */}
                {st.id > 0 && (
                  <div className={`grow h-0.5 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                )}
                
                {/* Step button */}
                <button
                  type="button"
                  onClick={() => {
                    // Jumping back is always allowed
                    if (st.id < currentStep) {
                      setCurrentStep(st.id);
                      setValidationError(null);
                    } else if (st.id > currentStep) {
                      // Validate sequentially up to the target step
                      let valid = true;
                      for (let stepToCheck = currentStep; stepToCheck < st.id; stepToCheck++) {
                        if (stepToCheck === 0) {
                          valid = validateProfile();
                        } else {
                          valid = validateSection(stepToCheck);
                        }
                        if (!valid) {
                          setCurrentStep(stepToCheck);
                          break;
                        }
                      }
                      if (valid) {
                        setCurrentStep(st.id);
                        setValidationError(null);
                      }
                    }
                  }}
                  className="flex flex-col items-center focus:outline-none group cursor-pointer touch-manipulation"
                >
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#003399] text-white ring-4 ring-blue-100 scale-110 shadow-md' 
                      : isCompleted 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200 group-hover:bg-slate-200'
                  }`}>
                    {isCompleted ? '✓' : st.id + 1}
                  </div>
                  <span className={`text-xs sm:text-sm font-bold mt-2 transition-colors duration-300 text-center ${
                    isActive ? 'text-[#003399] font-black' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    {currentLanguage === 'TH' ? st.labelTH : st.labelEN}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* FORM WRAPPER */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* VALIDATION ERROR DISPLAY (SHOW IF PRESENT ON ANY STEP) */}
        {validationError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-2xl shadow-xs">
            <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={18} />
            <div className="space-y-1">
              <span className="font-bold">{currentLanguage === 'TH' ? 'ข้อผิดพลาดในการตรวจสอบข้อมูล' : 'Validation Error'}</span>
              <p className="leading-relaxed">{validationError}</p>
            </div>
          </div>
        )}

        {/* STEP 0: RESPONDENT PROFILE SECTION CARD */}
        {currentStep === 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <div className="border-b border-slate-100 pb-3 sm:pb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 flex items-center gap-2.5">
                <User size={20} className="text-amber-500 shrink-0" />
                <span>{trans.profileHeader}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              
              {/* Education level */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.eduLevelLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {(['Bachelor', 'Master', 'Doctorate'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setEducationLevel(level);
                        setSelectedFaculty('');
                        setSelectedProgram('');
                        setSelectedMajor('');
                      }}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 border rounded-xl text-xs sm:text-sm font-bold text-center transition-all cursor-pointer touch-manipulation truncate ${
                        educationLevel === level
                          ? 'bg-[#003399] text-white border-[#003399] shadow-sm ring-2 ring-blue-100'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
                      }`}
                    >
                      {level === 'Bachelor' ? trans.bachelor : level === 'Master' ? trans.master : trans.doctorate}
                    </button>
                  ))}
                </div>
              </div>

              {/* Respondent Type */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.typeLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-type-select"
                  value={respondentType}
                  onChange={(e) => setRespondentType(e.target.value as any)}
                  className="w-full text-base font-medium bg-white text-slate-800 p-3 sm:p-3.5 border border-slate-200/90 rounded-xl focus:ring-2 focus:ring-[#003399] outline-none shadow-2xs cursor-pointer"
                >
                  <option value="Leader">{uiTranslations.typeLeader[currentLanguage]}</option>
                  <option value="Regular">{uiTranslations.typeRegular[currentLanguage]}</option>
                  <option value="Teacher">{uiTranslations.typeTeacher[currentLanguage]}</option>
                </select>
              </div>

              {/* Faculty Dropdown */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.facultyLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-faculty-select"
                  value={selectedFaculty}
                  onChange={handleFacultyChange}
                  className="w-full text-base font-medium bg-white text-slate-800 p-3 sm:p-3.5 border border-slate-200/90 rounded-xl focus:ring-2 focus:ring-[#003399] outline-none shadow-2xs cursor-pointer"
                >
                  <option value="">{trans.selectFaculty}</option>
                  {availableFaculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {currentLanguage === 'TH' ? `${f.nameTH} / ${f.nameEN}` : f.nameEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program Dropdown (Cascaded) */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.programLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-program-select"
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  disabled={!selectedFaculty}
                  className="w-full text-base font-medium bg-white text-slate-800 p-3 sm:p-3.5 border border-slate-200/90 rounded-xl focus:ring-2 focus:ring-[#003399] outline-none shadow-2xs disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">{trans.selectProgram}</option>
                  {filteredPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {currentLanguage === 'TH' ? `${p.nameTH} / ${p.nameEN}` : p.nameEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major Dropdown (Cascaded) */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.majorLabel}</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-major-select"
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  disabled={!selectedProgram}
                  className="w-full text-base font-medium bg-white text-slate-800 p-3 sm:p-3.5 border border-slate-200/90 rounded-xl focus:ring-2 focus:ring-[#003399] outline-none shadow-2xs disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">{trans.selectMajor}</option>
                  {filteredMajors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {currentLanguage === 'TH' ? `${m.nameTH} / ${m.nameEN}` : m.nameEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Teacher Toggle */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{trans.isNewTeacher}</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewTeacher(true)}
                    className={`py-3 px-4 rounded-xl border text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer touch-manipulation ${
                      isNewTeacher === true
                        ? 'bg-blue-50 border-[#003399] text-[#003399] ring-2 ring-blue-200 font-black shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isNewTeacher === true ? 'border-[#003399] bg-[#003399]' : 'border-slate-300'
                    }`}>
                      {isNewTeacher === true && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>{trans.yes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewTeacher(false);
                      const newRatings = { ...ratings };
                      delete newRatings['q4_7'];
                      setRatings(newRatings);
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer touch-manipulation ${
                      isNewTeacher === false
                        ? 'bg-blue-50 border-[#003399] text-[#003399] ring-2 ring-blue-200 font-black shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isNewTeacher === false ? 'border-[#003399] bg-[#003399]' : 'border-slate-300'
                    }`}>
                      {isNewTeacher === false && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>{trans.no}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEPS 1-5: SURVEY QUESTIONS SECTIONS */}
        {sections.map((sec) => {
          // Only show the active section step
          if (currentStep !== sec.id) return null;

          const sectionQuestions = activeQuestions.filter(q => q.section === sec.id);
          if (sectionQuestions.length === 0) return null;

          return (
            <div key={sec.id} className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">
              
              {/* Section Header */}
              <div className="border-b border-slate-100 pb-3 sm:pb-4 flex items-start gap-3 sm:gap-3.5">
                <span className="h-8 w-8 sm:h-9 sm:w-9 bg-blue-50 text-[#003399] border border-blue-200/80 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-2xs">
                  {sec.id}
                </span>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-[#003399] leading-snug">
                    {sec.titleTH} / <span className="text-xs sm:text-sm text-slate-500 font-medium italic">{sec.titleEN}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    {sec.descriptionTH}
                    {sec.descriptionEN && <span className="block text-xs text-slate-500 italic mt-0.5">{sec.descriptionEN}</span>}
                  </p>
                </div>
              </div>

              {/* Rating Scale Legend Bar */}
              <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-xl bg-[#003399]/10 text-[#003399] flex items-center justify-center font-black text-sm shrink-0">
                    ★
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {isTH ? 'เกณฑ์ระดับคะแนนความพึงพอใจ (5 → 1):' : 'Satisfaction Rating Scale (5 → 1):'}
                    </span>
                    <p className="text-xs text-slate-500 font-medium hidden sm:block">
                      {isTH ? 'เลือกระดับคะแนน 5 (มากที่สุด) ถึง 1 (น้อยที่สุด) ในแต่ละประเด็น' : 'Rate from 5 (Highest) to 1 (Lowest) for each statement'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 text-xs sm:text-sm shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <strong className="text-emerald-700 text-sm">5</strong> = {isTH ? 'มากที่สุด' : 'Highest'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 font-bold border border-blue-200 text-xs sm:text-sm shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <strong className="text-[#003399] text-sm">4</strong> = {isTH ? 'มาก' : 'High'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200 text-xs sm:text-sm shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <strong className="text-amber-700 text-sm">3</strong> = {isTH ? 'ปานกลาง' : 'Moderate'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-50 text-orange-900 font-bold border border-orange-200 text-xs sm:text-sm shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <strong className="text-orange-700 text-sm">2</strong> = {isTH ? 'น้อย' : 'Low'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 font-bold border border-rose-200 text-xs sm:text-sm shadow-2xs col-span-2 sm:col-span-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <strong className="text-rose-700 text-sm">1</strong> = {isTH ? 'น้อยที่สุด' : 'Lowest'}
                  </span>
                </div>
              </div>

              {/* Questions Checklist */}
              <div className="divide-y divide-slate-100">
                {sectionQuestions.map((quest) => {
                  const currentScore = ratings[quest.id];
                  
                  return (
                    <div 
                      key={quest.id} 
                      id={`q-container-${quest.id}`}
                      className="py-4 sm:py-5 px-1 sm:px-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 group transition-all duration-150 hover:bg-blue-50/20 rounded-2xl border border-transparent hover:border-blue-100/60"
                    >
                      {/* Question Label */}
                      <div className="space-y-1.5 max-w-2xl grow">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <span className="text-xs sm:text-sm font-bold text-[#003399] bg-blue-50 border border-blue-200/80 px-2 sm:px-2.5 py-0.5 rounded-lg shrink-0 mt-0.5 tabular-nums">
                            {sec.id}.{quest.order}
                          </span>
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-900 text-[15px] sm:text-base leading-relaxed">
                              {quest.textTH}
                            </p>
                            {quest.textEN && (
                              <p className="text-xs sm:text-sm text-slate-500 italic font-medium leading-normal">
                                {quest.textEN}
                              </p>
                            )}
                          </div>
                        </div>
                        {quest.isNewTeacherOnly && (
                          <div className="pl-9 sm:pl-11">
                            <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-md tracking-wide">
                              เฉพาะอาจารย์ใหม่ / New Teacher Only
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Score Selector (Rating 5 -> 1 with rich vibrant color styling and comfortable size across devices) */}
                      <div className="w-full lg:w-auto flex items-center justify-between sm:justify-end gap-1 sm:gap-2 shrink-0 self-stretch lg:self-center pt-2 lg:pt-0">
                        {[5, 4, 3, 2, 1].map((score) => {
                          const isSelected = currentScore === score;
                          const config = RATING_CONFIG[score];
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleRatingChange(quest.id, score)}
                              className={`h-13 sm:h-15 md:h-16 flex-1 sm:flex-initial sm:w-16 md:w-18 min-w-0 px-0.5 sm:px-1 rounded-xl sm:rounded-2xl font-bold flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer select-none active:scale-95 touch-manipulation ${
                                isSelected ? config.selectedClass : config.unselectedClass
                              }`}
                              title={`${isTH ? 'ระดับ' : 'Rating'} ${score}: ${isTH ? config.labelTH : config.labelEN}`}
                            >
                              <span className={`text-lg sm:text-xl md:text-2xl font-black leading-none tabular-nums ${
                                isSelected ? (score === 3 ? 'text-slate-950 font-black' : 'text-white') : config.numberColor
                              }`}>
                                {score}
                              </span>
                              <span className={`text-[9.5px] sm:text-[10.5px] md:text-[11px] leading-tight font-bold mt-0.5 sm:mt-1 tracking-tight truncate max-w-full text-center ${
                                isSelected ? (score === 3 ? 'text-slate-900 font-extrabold' : 'text-white/95') : config.textColor
                              }`}>
                                {isTH ? config.subTH : config.subEN}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Section 5 Open-Ended Feedback Boxes */}
              {sec.id === 5 && (
                <div className="pt-6 border-t border-slate-200/80 space-y-6">
                  <div className="flex items-center gap-2 text-[#003399] font-bold text-sm sm:text-base border-b border-slate-100 pb-2">
                    <Sparkles size={18} className="text-amber-500" />
                    <span>{isTH ? 'ข้อคิดเห็นและข้อเสนอแนะเพิ่มเติม (Optional Feedback)' : 'Additional Comments & Suggestions'}</span>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>{isTH ? '1. จุดเด่น / ข้อดีในการดำเนินงานของหลักสูตร (Strengths)' : '1. Strengths of Curriculum Operations'}</span>
                    </label>
                    <textarea
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                      rows={3}
                      placeholder={isTH ? 'ระบุจุดแข็ง ข้อดี หรือสิ่งที่หลักสูตรดำเนินการได้ดีเด่น...' : 'Enter key strengths of the program...'}
                      className="w-full text-sm sm:text-base p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:bg-white outline-none transition-all resize-y shadow-2xs font-normal"
                    ></textarea>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span>{isTH ? '2. ข้อที่ควรพัฒนา / สิ่งที่ควรปรับปรุง (Areas for Improvement)' : '2. Areas for Improvement'}</span>
                    </label>
                    <textarea
                      value={improvements}
                      onChange={(e) => setImprovements(e.target.value)}
                      rows={3}
                      placeholder={isTH ? 'ระบุประเด็นที่ควรได้รับการพัฒนาหรือปรับปรุงแก้ไข...' : 'Enter areas that need development or improvement...'}
                      className="w-full text-sm sm:text-base p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:bg-white outline-none transition-all resize-y shadow-2xs font-normal"
                    ></textarea>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>{isTH ? '3. ข้อเสนอแนะอื่นๆ เพื่อการพัฒนามหาวิทยาลัย (General Suggestions)' : '3. Other Feedback or Suggestions'}</span>
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      placeholder={isTH ? 'ระบุข้อเสนอแนะเพิ่มเติมอื่นๆ...' : 'Any other suggestions for university development...'}
                      className="w-full text-sm sm:text-base p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:bg-white outline-none transition-all resize-y shadow-2xs font-normal"
                    ></textarea>
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {/* OVERALL COMPLETED METRIC / PROGRESS BANNER */}
        <div className="bg-gradient-to-r from-[#003399] via-blue-800 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ClipboardList className="text-amber-400" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold">
                {currentLanguage === 'TH' ? 'ความคืบหน้าการกรอกข้อมูลรวม' : 'Overall Survey Completion'}
              </span>
              <span className="text-xs sm:text-sm text-blue-200 font-medium">
                {currentLanguage === 'TH' 
                  ? `ตอบแล้ว ${answeredQuestionsCount} จากทั้งหมด ${totalQuestionsCount} ข้อ` 
                  : `Answered ${answeredQuestionsCount} of ${totalQuestionsCount} questions`
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="grow bg-blue-950/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-blue-700/50">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm font-black text-amber-300 shrink-0 w-10 text-right tabular-nums">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* NAVIGATION & SUBMIT BUTTON SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed hidden sm:block">
            * {currentLanguage === 'TH' 
              ? 'คำตอบของคุณจะถูกนำไปวิเคราะห์เพื่อการพัฒนาคุณภาพการศึกษาอย่างเป็นความลับ ไม่มีการระบุตัวตนในรายงานรวม'
              : 'Your responses will be securely stored and analyzed. Reports are purely aggregated, maintaining individual privacy.'
            }
          </p>
          
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Prev Button */}
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  setValidationError(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-xs hover:shadow transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <span>&larr;</span>
                <span>{currentLanguage === 'TH' ? 'ย้อนกลับ' : 'Previous'}</span>
              </button>
            )}

            {/* Next Button */}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 0) {
                    if (validateProfile()) {
                      setCurrentStep(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    if (validateSection(currentStep)) {
                      setCurrentStep(currentStep + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className="flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 bg-[#003399] hover:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <span>{currentLanguage === 'TH' ? 'ขั้นตอนถัดไป' : 'Next Step'}</span>
                <span>&rarr;</span>
              </button>
            ) : (
              /* Submit Button on the very last step */
              <button
                id="survey-submit-btn"
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base touch-manipulation"
              >
                {submitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{trans.submitting}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>{trans.submitBtn}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
