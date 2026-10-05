import React, { useState, useEffect, useMemo } from 'react';
import { 
  listenToResponses, 
  calculateStats, 
  clearAllResponses, 
  getQuestions, 
  saveAppSettings, 
  getAppSettings,
  triggerAppsScriptEmail,
  forceSeedDatabase
} from '../lib/dbUtils';
import { db } from '../lib/firebase';
import { collection, doc, addDoc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { SurveyResponse, Question, AppSettings, Language } from '../types';
import { sections, initialQuestions, initialFaculties } from '../data/seedData';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Layers, Award, ShieldAlert,
  Calendar, CheckCircle, Download, Trash2, 
  Plus, Edit2, Check, X, Mail, Settings, 
  BarChart3, FileSpreadsheet, Eye, Sliders, AlertTriangle,
  Printer, HelpCircle, Sparkles
} from 'lucide-react';

export function getScoreInterpretation(mean: number, isTH: boolean) {
  if (mean >= 4.51) return { label: isTH ? 'มากที่สุด' : 'Highest', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (mean >= 3.51) return { label: isTH ? 'มาก' : 'High', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  if (mean >= 2.51) return { label: isTH ? 'ปานกลาง' : 'Moderate', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (mean >= 1.51) return { label: isTH ? 'น้อย' : 'Low', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  if (mean > 0) return { label: isTH ? 'น้อยที่สุด' : 'Lowest', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  return { label: isTH ? 'ยังไม่มีข้อมูล' : 'No Data', color: 'bg-slate-100 text-slate-600 border-slate-300' };
}

interface AdminDashboardProps {
  currentLanguage: Language;
  adminEmail: string;
}

export default function AdminDashboard({ currentLanguage, adminEmail }: AdminDashboardProps) {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Tabs navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'report' | 'export' | 'questions' | 'settings'>('overview');

  // Question Form State (CRUD)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestionTextTH, setNewQuestionTextTH] = useState('');
  const [newQuestionTextEN, setNewQuestionTextEN] = useState('');
  const [newQuestionSection, setNewQuestionSection] = useState(1);
  const [newQuestionOrder, setNewQuestionOrder] = useState(1);
  const [newQuestionNewOnly, setNewQuestionNewOnly] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Filter States for Export
  const [exportFaculty, setExportFaculty] = useState('all');
  const [exportLevel, setExportLevel] = useState('all');
  const [exportType, setExportType] = useState('all');

  // Confirmation Modals State
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearInputCheck, setClearInputCheck] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load configuration & subscribe to responses
  useEffect(() => {
    async function loadConfig() {
      try {
        const quests = await getQuestions();
        setQuestions(quests);
        
        const config = await getAppSettings();
        setSettings(config);
      } catch (err) {
        console.error(err);
      }
    }
    loadConfig();

    // Subscribe to responses realtime listener
    const unsubscribe = listenToResponses((data) => {
      setResponses(data);
    });

    return () => unsubscribe();
  }, []);

  // Utility toast helper
  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real-time computations
  const totalResponsesCount = responses.length;

  // Breakdown metrics
  const levelStats = useMemo(() => {
    const counts = { Bachelor: 0, Master: 0, Doctorate: 0 };
    responses.forEach(r => {
      if (counts[r.educationLevel] !== undefined) {
        counts[r.educationLevel]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const facultyStats = useMemo(() => {
    const map: Record<string, number> = {};
    responses.forEach(r => {
      const name = currentLanguage === 'TH' ? r.facultyNameTH : r.facultyNameEN;
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [responses, currentLanguage]);

  const teacherTypeStats = useMemo(() => {
    const map = { Leader: 0, Regular: 0, Teacher: 0 };
    responses.forEach(r => {
      if (map[r.respondentType] !== undefined) {
        map[r.respondentType]++;
      }
    });
    return [
      { name: currentLanguage === 'TH' ? 'อาจารย์ผู้รับผิดชอบหลักสูตร' : 'Program Director', value: map.Leader },
      { name: currentLanguage === 'TH' ? 'อาจารย์ประจำหลักสูตร' : 'Curriculum Faculty', value: map.Regular },
      { name: currentLanguage === 'TH' ? 'อาจารย์ผู้สอน' : 'Instructor', value: map.Teacher }
    ];
  }, [responses, currentLanguage]);

  // Daily submissions trend
  const dailyTrendStats = useMemo(() => {
    const map: Record<string, number> = {};
    responses.forEach(r => {
      const dateStr = new Date(r.timestamp).toLocaleDateString(currentLanguage === 'TH' ? 'th-TH' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
      map[dateStr] = (map[dateStr] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count })).slice(-10); // Last 10 days
  }, [responses, currentLanguage]);

  // real-time metrics for every question
  const questionAnalysis = useMemo(() => {
    return questions.map(q => {
      const answers: number[] = [];
      const frequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      responses.forEach(r => {
        const val = r.ratings?.[q.id];
        if (val !== undefined && val >= 1 && val <= 5) {
          answers.push(val);
          frequency[val as 1 | 2 | 3 | 4 | 5]++;
        }
      });

      const { mean, sd } = calculateStats(answers);
      const totalAnswers = answers.length;
      
      const percentages = {
        1: totalAnswers ? Number(((frequency[1] / totalAnswers) * 100).toFixed(1)) : 0,
        2: totalAnswers ? Number(((frequency[2] / totalAnswers) * 100).toFixed(1)) : 0,
        3: totalAnswers ? Number(((frequency[3] / totalAnswers) * 100).toFixed(1)) : 0,
        4: totalAnswers ? Number(((frequency[4] / totalAnswers) * 100).toFixed(1)) : 0,
        5: totalAnswers ? Number(((frequency[5] / totalAnswers) * 100).toFixed(1)) : 0
      };

      return {
        id: q.id,
        section: q.section,
        textTH: q.textTH,
        textEN: q.textEN,
        mean,
        sd,
        count: totalAnswers,
        frequency,
        percentages
      };
    });
  }, [questions, responses]);

  // Section level computed averages
  const sectionAnalysis = useMemo(() => {
    return sections.map(sec => {
      const sectionQuestions = questionAnalysis.filter(q => q.section === sec.id);
      const validMeans = sectionQuestions.map(q => q.mean).filter(m => m > 0);
      const averageMean = validMeans.length > 0 
        ? Number((validMeans.reduce((s, m) => s + m, 0) / validMeans.length).toFixed(2))
        : 0;

      return {
        id: sec.id,
        title: currentLanguage === 'TH' ? sec.titleTH : sec.titleEN,
        mean: averageMean
      };
    });
  }, [questionAnalysis, currentLanguage]);

  // Top Strengths (highest scoring items) and Top Issues (lowest scoring items)
  const topStrengthsAndIssues = useMemo(() => {
    const scoredQuestions = questionAnalysis.filter(q => q.count > 0);
    const sorted = [...scoredQuestions].sort((a, b) => b.mean - a.mean);
    
    return {
      strengths: sorted.slice(0, 3).map(q => ({
        id: q.id,
        text: currentLanguage === 'TH' ? q.textTH : q.textEN,
        mean: q.mean
      })),
      issues: [...sorted].reverse().slice(0, 3).map(q => ({
        id: q.id,
        text: currentLanguage === 'TH' ? q.textTH : q.textEN,
        mean: q.mean
      }))
    };
  }, [questionAnalysis, currentLanguage]);

  // Rankings
  const rankings = useMemo(() => {
    // 1. Program ranking
    const programMap: Record<string, { sum: number; count: number }> = {};
    responses.forEach(r => {
      const pName = currentLanguage === 'TH' ? r.programNameTH : r.programNameEN;
      const ratingsList = Object.values(r.ratings || {}) as number[];
      if (ratingsList.length > 0) {
        const avg = ratingsList.reduce((s, v) => s + v, 0) / ratingsList.length;
        if (!programMap[pName]) programMap[pName] = { sum: 0, count: 0 };
        programMap[pName].sum += avg;
        programMap[pName].count++;
      }
    });
    const programRank = Object.entries(programMap)
      .map(([name, info]) => ({ name, mean: Number((info.sum / info.count).toFixed(2)) }))
      .sort((a, b) => b.mean - a.mean);

    // 2. Faculty ranking
    const facultyMap: Record<string, { sum: number; count: number }> = {};
    responses.forEach(r => {
      const fName = currentLanguage === 'TH' ? r.facultyNameTH : r.facultyNameEN;
      const ratingsList = Object.values(r.ratings || {}) as number[];
      if (ratingsList.length > 0) {
        const avg = ratingsList.reduce((s, v) => s + v, 0) / ratingsList.length;
        if (!facultyMap[fName]) facultyMap[fName] = { sum: 0, count: 0 };
        facultyMap[fName].sum += avg;
        facultyMap[fName].count++;
      }
    });
    const facultyRank = Object.entries(facultyMap)
      .map(([name, info]) => ({ name, mean: Number((info.sum / info.count).toFixed(2)) }))
      .sort((a, b) => b.mean - a.mean);

    return { programRank, facultyRank };
  }, [responses, currentLanguage]);

  // Total answer selections across all questions & rating scale distribution
  const totalRatingChoices = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, sum: 0 };
    questionAnalysis.forEach(q => {
      counts[5] += q.frequency[5] || 0;
      counts[4] += q.frequency[4] || 0;
      counts[3] += q.frequency[3] || 0;
      counts[2] += q.frequency[2] || 0;
      counts[1] += q.frequency[1] || 0;
      counts.sum += q.count;
    });
    return counts;
  }, [questionAnalysis]);

  // Chart colors palette
  const COLORS = ['#003399', '#1E4D8C', '#DD6B20', '#E28743', '#059669', '#7C3AED', '#DB2777'];

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await saveAppSettings({
        academicYear: settings.academicYear,
        isOpen: settings.isOpen,
        googleAppsScriptUrl: settings.googleAppsScriptUrl
      });
      triggerToast(currentLanguage === 'TH' ? 'บันทึกการตั้งค่าเรียบร้อยแล้ว!' : 'Settings updated successfully!');
    } catch (err) {
      console.error(err);
      triggerToast(currentLanguage === 'TH' ? 'เกิดข้อผิดพลาดในการบันทึก' : 'Failed to update settings', 'error');
    }
  };

  const [syncing, setSyncing] = useState(false);
  const handleForceSync = async () => {
    if (!confirm(currentLanguage === 'TH' ? 'คุณต้องการบังคับซิงค์ข้อมูลคณะ หลักสูตร และสาขาวิชาจากไฟล์ต้นแบบใช่หรือไม่? (ข้อมูลประเภทคณะ/หลักสูตร/สาขาในฐานข้อมูลจะถูกปรับปรุงให้ถูกต้องล่าสุด และจะมีการโหลดหน้าเว็บใหม่)' : 'Are you sure you want to force-sync all faculties, programs, and majors from the local seed files? (This will update them to the latest correct structure and reload the page)')) return;
    setSyncing(true);
    try {
      await forceSeedDatabase();
      triggerToast(currentLanguage === 'TH' ? 'ซิงค์ข้อมูลคณะ หลักสูตร และสาขาวิชาสำเร็จแล้ว!' : 'Faculties, programs, and majors synced successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      triggerToast(currentLanguage === 'TH' ? 'เกิดข้อผิดพลาด: ' + err.message : 'Error syncing: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Add/Edit Question handler
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTextTH) {
      triggerToast('กรุณากรอกข้อความคำถามให้ครบถ้วน', 'error');
      return;
    }

    const englishText = newQuestionTextEN || newQuestionTextTH;

    try {
      if (editingQuestionId) {
        // Edit Mode
        const docRef = doc(db, 'questions', editingQuestionId);
        await updateDoc(docRef, {
          textTH: newQuestionTextTH,
          textEN: englishText,
          section: Number(newQuestionSection),
          order: Number(newQuestionOrder),
          isNewTeacherOnly: newQuestionNewOnly
        });
        triggerToast('อัปเดตคำถามเรียบร้อยแล้ว');
      } else {
        // Add Mode
        const newId = `q${newQuestionSection}_custom_${Date.now()}`;
        const docRef = doc(db, 'questions', newId);
        await setDoc(docRef, {
          id: newId,
          textTH: newQuestionTextTH,
          textEN: englishText,
          section: Number(newQuestionSection),
          order: Number(newQuestionOrder),
          isNewTeacherOnly: newQuestionNewOnly
        });
        triggerToast('เพิ่มคำถามใหม่เรียบร้อยแล้ว');
      }

      // Reload list & clean form
      const quests = await getQuestions();
      setQuestions(quests);
      setNewQuestionTextTH('');
      setNewQuestionTextEN('');
      setEditingQuestionId(null);
      setShowQuestionForm(false);
    } catch (err) {
      console.error(err);
      triggerToast('Database error', 'error');
    }
  };

  const startEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setNewQuestionTextTH(q.textTH);
    setNewQuestionTextEN(q.textEN);
    setNewQuestionSection(q.section);
    setNewQuestionOrder(q.order);
    setNewQuestionNewOnly(!!q.isNewTeacherOnly);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm(currentLanguage === 'TH' ? 'คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้?' : 'Are you sure you want to delete this question?')) return;
    try {
      await deleteDoc(doc(db, 'questions', id));
      triggerToast(currentLanguage === 'TH' ? 'ลบคำถามเรียบร้อยแล้ว' : 'Question deleted!');
      const quests = await getQuestions();
      setQuestions(quests);
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting question', 'error');
    }
  };

  // Safe Database Purging (Admin Clear Responses)
  const handleClearDatabase = async () => {
    if (clearInputCheck !== 'CLEAR_2568') {
      triggerToast(currentLanguage === 'TH' ? 'รหัสยืนยันไม่ถูกต้อง' : 'Confirmation text mismatch', 'error');
      return;
    }
    try {
      await clearAllResponses(adminEmail);
      triggerToast(currentLanguage === 'TH' ? 'ล้างฐานข้อมูลแบบสอบถามเรียบร้อยแล้ว!' : 'All survey responses cleared successfully!');
      setShowClearConfirm(false);
      setClearInputCheck('');
      setResponses([]);
    } catch (err) {
      console.error(err);
      triggerToast('Error purging responses', 'error');
    }
  };

  // BOM-enriched UTF-8 Excel-ready CSV Exporter
  const handleExportCSV = () => {
    let filtered = responses;
    if (exportFaculty !== 'all') {
      filtered = filtered.filter(r => r.facultyId === exportFaculty);
    }
    if (exportLevel !== 'all') {
      filtered = filtered.filter(r => r.educationLevel === exportLevel);
    }
    if (exportType !== 'all') {
      filtered = filtered.filter(r => r.respondentType === exportType);
    }

    if (filtered.length === 0) {
      triggerToast(currentLanguage === 'TH' ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : 'No records found matching filters', 'error');
      return;
    }

    // Build CSV Row Headers
    const headers = [
      'Email',
      'Education Level',
      'Faculty',
      'Program',
      'Major',
      'Type',
      'New Teacher?',
      ...questions.map(q => `Q${q.section}.${q.order}`),
      'Strengths',
      'Improvements',
      'Comments',
      'Timestamp'
    ];

    const rows = filtered.map(r => {
      const rowAnswers = questions.map(q => r.ratings?.[q.id] || '');
      return [
        r.userEmail,
        r.educationLevel,
        currentLanguage === 'TH' ? r.facultyNameTH : r.facultyNameEN,
        currentLanguage === 'TH' ? r.programNameTH : r.programNameEN,
        currentLanguage === 'TH' ? r.majorNameTH : r.majorNameEN,
        r.respondentType,
        r.isNewTeacher ? 'YES' : 'NO',
        ...rowAnswers,
        `"${(r.strengths || '').replace(/"/g, '""')}"`,
        `"${(r.improvements || '').replace(/"/g, '""')}"`,
        `"${(r.comments || '').replace(/"/g, '""')}"`,
        r.timestamp ? new Date(r.timestamp).toISOString() : ''
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `survey_responses_${exportFaculty}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger Apps Script notify of Export
    if (settings?.googleAppsScriptUrl) {
      triggerAppsScriptEmail(settings.googleAppsScriptUrl, {
        action: 'EXPORT_DATA',
        adminEmail,
        filters: { faculty: exportFaculty, level: exportLevel, type: exportType },
        timestamp: new Date().toISOString()
      });
    }

    triggerToast(currentLanguage === 'TH' ? 'ส่งออกไฟล์สำรวจสำเร็จ!' : 'Export download initiated!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold transition-all ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert size={14} />
            <span>Bangkok University Admin Console • {adminEmail}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-sans tracking-tight">
            {currentLanguage === 'TH' ? 'แดชบอร์ดสรุปผลและรายงานสำหรับนำเสนอผู้บริหาร' : 'Executive Analytical Dashboard & QA Report'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {currentLanguage === 'TH' ? 'ระบบประมวลผลข้อมูล Real-time เพื่อนำเสนอผู้บริหาร (เฉพาะผู้ดูแลระบบ)' : 'Real-time executive summary data processing (Restricted admin access)'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Print Report Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003399] hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            title="พิมพ์หน้านี้ / บันทึกเป็น PDF"
          >
            <Printer size={14} />
            <span>{currentLanguage === 'TH' ? 'พิมพ์รายงานสำหรับผู้บริหาร' : 'Print Executive Report'}</span>
          </button>

          {/* Navigation Admin Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border overflow-x-auto max-w-full">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#003399] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 size={13} className="inline mr-1" />
              <span>{currentLanguage === 'TH' ? 'แดชบอร์ดภาพรวม' : 'Overview'}</span>
            </button>
            <button
              id="tab-report"
              onClick={() => setActiveTab('report')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'report' ? 'bg-[#003399] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye size={13} className="inline mr-1" />
              <span>{currentLanguage === 'TH' ? 'รายงานสถิติรายข้อ' : 'QA Questions'}</span>
            </button>
            <button
              id="tab-export"
              onClick={() => setActiveTab('export')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'export' ? 'bg-[#003399] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Download size={13} className="inline mr-1" />
              <span>{currentLanguage === 'TH' ? 'ส่งออกข้อมูล' : 'Export Data'}</span>
            </button>
            <button
              id="tab-questions"
              onClick={() => setActiveTab('questions')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'questions' ? 'bg-[#003399] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sliders size={13} className="inline mr-1" />
              <span>{currentLanguage === 'TH' ? 'จัดการข้อคำถาม' : 'Questions'}</span>
            </button>
            <button
              id="tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#003399] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Settings size={13} className="inline mr-1" />
              <span>{currentLanguage === 'TH' ? 'ตั้งค่าระบบ' : 'Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* STATS SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: TOTAL RESPONSES */}
            <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentLanguage === 'TH' ? 'ผู้ตอบแบบสอบถาม' : 'Total Respondents'}</span>
                <h3 className="text-3xl font-black text-[#003399] tabular-nums">{totalResponsesCount}</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold inline-block">Realtime Data</span>
              </div>
              <div className="p-3.5 bg-blue-50 text-[#003399] rounded-2xl">
                <Users size={24} />
              </div>
            </div>

            {/* CARD 2: AVG OVERALL SCORE */}
            <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentLanguage === 'TH' ? 'คะแนนเฉลี่ยรวม' : 'Avg QA Score'}</span>
                <h3 className="text-3xl font-black text-amber-500 tabular-nums">
                  {sectionAnalysis.length > 0 
                    ? Number((sectionAnalysis.reduce((s, x) => s + x.mean, 0) / sectionAnalysis.length).toFixed(2)) 
                    : '0.00'
                  }
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold inline-block">Scale 1.00 - 5.00</span>
              </div>
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                <Award size={24} />
              </div>
            </div>

            {/* CARD 3: TOTAL QUESTIONS */}
            <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentLanguage === 'TH' ? 'จำนวนข้อคำถามทั้งหมด' : 'Total Questions'}</span>
                <h3 className="text-3xl font-black text-indigo-700 tabular-nums">
                  {questions.length} <span className="text-xs font-normal text-slate-400">{currentLanguage === 'TH' ? 'ข้อ' : 'items'}</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold inline-block">
                  {currentLanguage === 'TH' ? 'ครอบคลุม 5 ด้าน' : 'Across 5 Dimensions'}
                </span>
              </div>
              <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Layers size={24} />
              </div>
            </div>

            {/* CARD 4: SURVEY STATUS */}
            <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentLanguage === 'TH' ? 'สถานะแบบสำรวจ' : 'Form Ingress'}</span>
                <h3 className={`text-lg font-black ${settings?.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                  {settings?.isOpen 
                    ? (currentLanguage === 'TH' ? 'เปิดรับข้อมูลปกติ' : 'OPEN & RECEIVING') 
                    : (currentLanguage === 'TH' ? 'ปิดรับข้อมูลชั่วคราว' : 'CLOSED')
                  }
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold inline-block">Survey Status</span>
              </div>
              <div className={`p-3.5 rounded-2xl ${settings?.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <CheckCircle size={24} />
              </div>
            </div>

          </div>

          {/* EXECUTIVE HIGHLIGHTS & QUESTION SELECTION BREAKDOWN */}
          <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#003399] text-white rounded-xl shadow-xs">
                  <Sparkles size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    {currentLanguage === 'TH' ? 'สรุปสาระสำคัญสำหรับนำเสนอผู้บริหาร' : 'Executive Presentation Summary Highlights'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentLanguage === 'TH' 
                      ? 'สรุปจำนวนผู้ตอบแบบสอบถาม และการกระจายตัวของระดับคะแนนที่เลือกตอบทุกข้อคำถาม' 
                      : 'Summary of respondents and answer selection frequencies across all survey questions'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('report')}
                className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-100 text-[#003399] border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Eye size={14} />
                <span>{currentLanguage === 'TH' ? 'ดูรายละเอียดรายข้อคำถาม' : 'View Detailed Questions Table'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Total Respondents breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {currentLanguage === 'TH' ? 'จำแนกตามประเภทอาจารย์' : 'Respondents by Faculty Role'}
                  </span>
                  <span className="text-xs font-bold text-[#003399] bg-blue-50 px-2 py-0.5 rounded-full">
                    {totalResponsesCount} {currentLanguage === 'TH' ? 'คน' : 'respondents'}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {teacherTypeStats.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600 font-medium">{item.name}</span>
                      <span className="font-black text-slate-800 tabular-nums">
                        {item.value} <span className="text-[10px] text-slate-400 font-normal">({totalResponsesCount > 0 ? ((item.value / totalResponsesCount) * 100).toFixed(0) : 0}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Total Question choices breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {currentLanguage === 'TH' ? 'จำนวนข้อที่เลือกตอบ (แยกตามระดับ)' : 'Total Question Ratings Selected'}
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {totalRatingChoices.sum} {currentLanguage === 'TH' ? 'คำตอบ' : 'answers'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {[
                    { score: 5, label: currentLanguage === 'TH' ? '5 = มากที่สุด' : '5 = Highest', count: totalRatingChoices[5], color: 'bg-emerald-500' },
                    { score: 4, label: currentLanguage === 'TH' ? '4 = มาก' : '4 = High', count: totalRatingChoices[4], color: 'bg-blue-500' },
                    { score: 3, label: currentLanguage === 'TH' ? '3 = ปานกลาง' : '3 = Moderate', count: totalRatingChoices[3], color: 'bg-amber-500' },
                    { score: 2, label: currentLanguage === 'TH' ? '2 = น้อย' : '2 = Low', count: totalRatingChoices[2], color: 'bg-orange-500' },
                    { score: 1, label: currentLanguage === 'TH' ? '1 = น้อยที่สุด' : '1 = Lowest', count: totalRatingChoices[1], color: 'bg-rose-500' },
                  ].map(scale => {
                    const pct = totalRatingChoices.sum > 0 ? ((scale.count / totalRatingChoices.sum) * 100).toFixed(1) : '0';
                    return (
                      <div key={scale.score} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-semibold">{scale.label}</span>
                          <span className="font-bold text-slate-800 tabular-nums">
                            {scale.count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${scale.color} transition-all duration-500`} 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 3: Quality Interpretation Criteria */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {currentLanguage === 'TH' ? 'เกณฑ์การแปลผลคะแนนเฉลี่ย' : 'Score Interpretation Criteria'}
                  </span>
                  <Award size={16} className="text-amber-500" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50/60 text-emerald-900 border border-emerald-100">
                    <span className="font-bold">4.51 – 5.00</span>
                    <span className="font-semibold">{currentLanguage === 'TH' ? 'ระดับมากที่สุด' : 'Highest'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-blue-50/60 text-blue-900 border border-blue-100">
                    <span className="font-bold">3.51 – 4.50</span>
                    <span className="font-semibold">{currentLanguage === 'TH' ? 'ระดับมาก' : 'High'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50/60 text-amber-900 border border-amber-100">
                    <span className="font-bold">2.51 – 3.50</span>
                    <span className="font-semibold">{currentLanguage === 'TH' ? 'ระดับปานกลาง' : 'Moderate'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-50/60 text-orange-900 border border-orange-100">
                    <span className="font-bold">1.51 – 2.50</span>
                    <span className="font-semibold">{currentLanguage === 'TH' ? 'ระดับน้อย' : 'Low'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50/60 text-rose-900 border border-rose-100">
                    <span className="font-bold">1.00 – 1.50</span>
                    <span className="font-semibold">{currentLanguage === 'TH' ? 'ระดับน้อยที่สุด' : 'Lowest'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DUAL COLUMN CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Category Average Scores Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-3">
                {currentLanguage === 'TH' ? 'ผลประเมินเฉลี่ยรายด้าน' : 'Average QA Score by Category'}
              </h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="id" tickFormatter={(v) => `ด้าน ${v}`} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => [`${value} / 5.00`, 'คะแนนเฉลี่ย']} />
                    <Bar dataKey="mean" fill="#003399" radius={[4, 4, 0, 0]}>
                      {sectionAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Respondent Distribution (Faculty) */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-3">
                {currentLanguage === 'TH' ? 'สัดส่วนผู้ตอบแบบสำรวจจำแนกตามคณะ' : 'Responses Distribution by Faculty'}
              </h4>
              {facultyStats.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-xs text-slate-400">
                  {currentLanguage === 'TH' ? 'ยังไม่มีข้อมูลผู้ตอบแบบสำรวจ' : 'No data collected yet'}
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facultyStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {facultyStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Daily trend response count */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4 lg:col-span-2">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-3">
                {currentLanguage === 'TH' ? 'แนวโน้มการตอบแบบสอบถามรายวัน' : 'Daily Response Trend'}
              </h4>
              {dailyTrendStats.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  {currentLanguage === 'TH' ? 'ยังไม่มีข้อมูลสำหรับวิเคราะห์รายวัน' : 'No submission timeline collected yet'}
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTrendStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#DD6B20" strokeWidth={3} activeDot={{ r: 8 }} name={currentLanguage === 'TH' ? 'จำนวนผู้ตอบ' : 'Submissions'} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          {/* STRENGTHS AND ISSUES (QA BENTO SUMMARY) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Top Strengths card */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 space-y-4">
              <h4 className="text-sm font-bold text-emerald-900 border-b border-emerald-200 pb-2 flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-600" />
                <span>{currentLanguage === 'TH' ? 'จุดแข็งสูงสุดของหลักสูตร (คะแนนประเมินมากสุด)' : 'QA Strengths (Highest Mean Scores)'}</span>
              </h4>
              {topStrengthsAndIssues.strengths.length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium text-center py-6">ยังไม่มีข้อมูลการประเมิน</p>
              ) : (
                <ul className="space-y-3">
                  {topStrengthsAndIssues.strengths.map((q, i) => (
                    <li key={q.id} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm border border-emerald-100">
                      <span className="h-6 w-6 bg-emerald-100 text-emerald-800 font-bold rounded-full flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </span>
                      <div className="grow space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 leading-normal">{q.text}</p>
                        <span className="text-[10px] text-slate-400">ID: {q.id}</span>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black shrink-0">
                        {q.mean.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Top Issues card */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
              <h4 className="text-sm font-bold text-red-900 border-b border-red-200 pb-2 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-red-600" />
                <span>{currentLanguage === 'TH' ? 'ประเด็นต้องพัฒนาเร่งด่วน (คะแนนประเมินน้อยสุด)' : 'Critical QA Improvement areas (Lowest Mean)'}</span>
              </h4>
              {topStrengthsAndIssues.issues.length === 0 ? (
                <p className="text-xs text-red-700 font-medium text-center py-6">ยังไม่มีข้อมูลการประเมิน</p>
              ) : (
                <ul className="space-y-3">
                  {topStrengthsAndIssues.issues.map((q, i) => (
                    <li key={q.id} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm border border-red-100">
                      <span className="h-6 w-6 bg-red-100 text-red-800 font-bold rounded-full flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </span>
                      <div className="grow space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 leading-normal">{q.text}</p>
                        <span className="text-[10px] text-slate-400">ID: {q.id}</span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-black shrink-0">
                        {q.mean.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          {/* PROGRAM AND FACULTY RANKING TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Faculty Ranking */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-3">
                {currentLanguage === 'TH' ? 'อันดับผลประเมินคณะผู้สอน (Ranking)' : 'QA Faculty Ranking'}
              </h4>
              {rankings.facultyRank.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">ไม่มีข้อมูล</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 border-collapse">
                    <thead>
                      <tr className="border-b text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">อันดับ</th>
                        <th className="py-2.5">คณะ</th>
                        <th className="py-2.5 text-right">คะแนนเฉลี่ย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {rankings.facultyRank.map((fac, idx) => (
                        <tr key={fac.name} className="hover:bg-slate-50">
                          <td className="py-3 tabular-nums font-bold text-[#003399]">#{idx + 1}</td>
                          <td className="py-3 truncate max-w-xs">{fac.name}</td>
                          <td className="py-3 text-right tabular-nums">
                            <span className="bg-blue-50 text-[#003399] font-black px-2 py-0.5 rounded border border-blue-100 font-sans">
                              {fac.mean.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Program Ranking */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-3">
                {currentLanguage === 'TH' ? 'อันดับหลักสูตรที่มีความพึงพอใจสูงสุด' : 'QA Program Ranking'}
              </h4>
              {rankings.programRank.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">ไม่มีข้อมูล</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 border-collapse">
                    <thead>
                      <tr className="border-b text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">อันดับ</th>
                        <th className="py-2.5">ชื่อหลักสูตร</th>
                        <th className="py-2.5 text-right">คะแนนเฉลี่ย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {rankings.programRank.map((prog, idx) => (
                        <tr key={prog.name} className="hover:bg-slate-50">
                          <td className="py-3 tabular-nums font-bold text-[#003399]">#{idx + 1}</td>
                          <td className="py-3 truncate max-w-[200px]" title={prog.name}>{prog.name}</td>
                          <td className="py-3 text-right tabular-nums">
                            <span className="bg-amber-50 text-amber-900 font-black px-2 py-0.5 rounded border border-amber-200">
                              {prog.mean.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ANALYSIS REPORT TABLE (Mean, SD, Frequency & Percentage) */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {currentLanguage === 'TH' ? 'ตารางรายงานสถิติแยกตามข้อคำถาม' : 'Question-by-Question Analytical Statistics'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentLanguage === 'TH' ? 'ค่าเฉลี่ย (Mean) ส่วนเบี่ยงเบนมาตรฐาน (SD) ระดับคุณภาพ และสัดส่วนการเลือกตอบ (ระดับคะแนน 5 - 1)' : 'Evaluating Mean, Standard Deviation (S.D.), Interpretation Level, and distribution percentage per score (5 - 1).'}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 bg-[#003399] hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>{currentLanguage === 'TH' ? 'พิมพ์รายงานนี้' : 'Print Table'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3">ข้อที่</th>
                  <th className="p-3 min-w-[220px]">รายละเอียดข้อคำถาม</th>
                  <th className="p-3 text-center">จำนวนผู้ตอบ</th>
                  <th className="p-3 text-center">ค่าเฉลี่ย (X̄)</th>
                  <th className="p-3 text-center">S.D.</th>
                  <th className="p-3 text-center">การแปลผล</th>
                  <th className="p-3 text-center min-w-[190px]">ความถี่ & ร้อยละ (ระดับคะแนน 5 - 1)</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium text-slate-700">
                {sections.map(sec => {
                  const secQuestions = questionAnalysis.filter(q => q.section === sec.id);
                  const secAvg = sectionAnalysis.find(sa => sa.id === sec.id)?.mean || 0;
                  const secInterp = getScoreInterpretation(secAvg, currentLanguage === 'TH');

                  return (
                    <div key={sec.id} className="contents">
                      {/* Section Header Row */}
                      <tr className="bg-[#003399]/5 font-bold text-[#003399] border-t-2 border-[#003399]/10">
                        <td className="p-3 text-center">{sec.id}</td>
                        <td className="p-3" colSpan={2}>
                          {sec.titleTH} / <span className="text-[10px] text-slate-500 font-normal italic">{sec.titleEN}</span>
                        </td>
                        <td className="p-3 text-center bg-[#003399]/10 font-black">
                          {secAvg.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${secInterp.color}`}>
                            {secInterp.label}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] text-slate-400 font-bold">คะแนนเฉลี่ยรายด้าน</span>
                        </td>
                      </tr>

                      {/* Question Rows */}
                      {secQuestions.map(q => {
                        const qInterp = getScoreInterpretation(q.mean, currentLanguage === 'TH');
                        return (
                          <tr key={q.id} className="hover:bg-slate-50 text-xs">
                            <td className="p-3 text-center text-slate-400 font-bold tabular-nums">{q.section}.{questions.find(x => x.id === q.id)?.order}</td>
                            <td className="p-3 leading-normal text-slate-800">
                              <p className="font-bold">{q.textTH}</p>
                              {q.textEN && <p className="text-[10px] text-slate-400 italic font-medium">{q.textEN}</p>}
                            </td>
                            <td className="p-3 text-center tabular-nums">{q.count}</td>
                            <td className="p-3 text-center font-bold text-[#003399] tabular-nums">{q.mean > 0 ? q.mean.toFixed(2) : '-'}</td>
                            <td className="p-3 text-center tabular-nums text-slate-500">{q.sd > 0 ? q.sd.toFixed(2) : '-'}</td>
                            <td className="p-3 text-center">
                              {q.mean > 0 ? (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${qInterp.color}`}>
                                  {qInterp.label}
                                </span>
                              ) : '-'}
                            </td>
                            
                            {/* Frequency list */}
                            <td className="p-3 text-left">
                              <div className="grid grid-cols-5 gap-1 text-[9px] font-semibold text-slate-600">
                                {[5, 4, 3, 2, 1].map((score) => {
                                  const freq = q.frequency[score as 1 | 2 | 3 | 4 | 5] || 0;
                                  const pct = q.percentages[score as 1 | 2 | 3 | 4 | 5] || 0;
                                  return (
                                    <div key={score} className="flex flex-col items-center bg-slate-50 rounded p-1 border border-slate-100">
                                      <span className="text-slate-400 font-bold">L{score}</span>
                                      <span className="text-[#003399] font-black">{freq}</span>
                                      <span className="text-amber-600 font-medium">{pct}%</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </div>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DATA EXPORT WORKSPACE */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* EXPORT FORM CONTAINER */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6 lg:col-span-2">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="text-amber-500" size={18} />
                <span>{currentLanguage === 'TH' ? 'ส่งออกข้อมูลผลการสำรวจ' : 'Export Survey Database'}</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {currentLanguage === 'TH' ? 'คัดกรองข้อมูลดิบผู้ตอบแบบสำรวจ แยกตามสังกัด เพื่อดาวน์โหลดไฟล์ Excel/CSV ที่สมบูรณ์พร้อมประเมินผล' : 'Filter raw respondent submission logs to fetch Excel-ready CSV sheets with UTF-8 support.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Faculty Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{currentLanguage === 'TH' ? 'ตัวกรองคณะสังกัด' : 'Filter Faculty'}</label>
                <select
                  value={exportFaculty}
                  onChange={(e) => setExportFaculty(e.target.value)}
                  className="w-full text-xs font-medium bg-white text-slate-700 p-2.5 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">{currentLanguage === 'TH' ? 'ทุกคณะ / คณะทั้งหมด' : 'All Faculties'}</option>
                  {initialFaculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {currentLanguage === 'TH' ? `${f.nameTH} / ${f.nameEN}` : f.nameEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education Level Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{currentLanguage === 'TH' ? 'ระดับการศึกษา' : 'Filter Level'}</label>
                <select
                  value={exportLevel}
                  onChange={(e) => setExportLevel(e.target.value)}
                  className="w-full text-xs font-medium bg-white text-slate-700 p-2.5 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">{currentLanguage === 'TH' ? 'ทุกระดับปริญญา' : 'All Degrees'}</option>
                  <option value="Bachelor">{currentLanguage === 'TH' ? 'ปริญญาตรี' : 'Bachelor'}</option>
                  <option value="Master">{currentLanguage === 'TH' ? 'ปริญญาโท' : 'Master'}</option>
                  <option value="Doctorate">{currentLanguage === 'TH' ? 'ปริญญาเอก' : 'Doctorate'}</option>
                </select>
              </div>

              {/* Respondent Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{currentLanguage === 'TH' ? 'ประเภทสายงาน' : 'Filter Role'}</label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-full text-xs font-medium bg-white text-slate-700 p-2.5 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">{currentLanguage === 'TH' ? 'อาจารย์ทุกคน' : 'All Teachers'}</option>
                  <option value="Leader">{currentLanguage === 'TH' ? 'อาจารย์ผู้รับผิดชอบหลักสูตร / Program Director' : 'Program Director'}</option>
                  <option value="Regular">{currentLanguage === 'TH' ? 'อาจารย์ประจำหลักสูตร / Curriculum Faculty' : 'Curriculum Faculty'}</option>
                  <option value="Teacher">{currentLanguage === 'TH' ? 'อาจารย์ผู้สอน / Instructor' : 'Instructor'}</option>
                </select>
              </div>

            </div>

            <div className="flex items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <span className="text-xs font-bold text-amber-900">
                {currentLanguage === 'TH' ? 'ยอดข้อมูลที่คัดกรองได้:' : 'Matched Survey Logs:'} {
                  responses.filter(r => 
                    (exportFaculty === 'all' || r.facultyId === exportFaculty) &&
                    (exportLevel === 'all' || r.educationLevel === exportLevel) &&
                    (exportType === 'all' || r.respondentType === exportType)
                  ).length
                } {currentLanguage === 'TH' ? 'ฉบับ' : 'Responses'}
              </span>

              <button
                id="export-csv-btn"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                <Download size={14} />
                <span>{currentLanguage === 'TH' ? 'ดาวน์โหลดไฟล์ผลสำรวจ (.csv)' : 'Download Excel-ready CSV'}</span>
              </button>
            </div>

          </div>

          {/* DANGEROUS DISK ACTION (Wiping Firestore) */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 space-y-4">
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 size={16} className="text-red-600" />
              <span>{currentLanguage === 'TH' ? 'ล้างทำความสะอาดฐานข้อมูล (Dangerous)' : 'Purge All Database Records'}</span>
            </h4>
            <p className="text-[11px] text-red-700 leading-normal font-medium">
              {currentLanguage === 'TH' 
                ? 'คำสั่งนี้จะลบระเบียนแบบจำลองความคิดเห็นทั้งหมดออกจากคลังเก็บข้อมูล Firestore อย่างถาวร ไม่สามารถย้อนกลับหรือกู้คืนได้!'
                : 'This operation will permanently purge all survey respondent profiles and score logs from Cloud Firestore database. Irreversible action!'
              }
            </p>

            {showClearConfirm ? (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-red-200">
                <label className="text-[10px] font-bold text-red-800">
                  {currentLanguage === 'TH' ? 'เพื่อยืนยัน พิมพ์ "CLEAR_2568" ลงด้านล่าง:' : 'To confirm, type "CLEAR_2568" below:'}
                </label>
                <input
                  id="confirm-purge-input"
                  type="text"
                  value={clearInputCheck}
                  onChange={(e) => setClearInputCheck(e.target.value)}
                  placeholder="CLEAR_2568"
                  className="w-full text-xs font-bold uppercase p-2 border border-red-300 rounded focus:ring-1 focus:ring-red-500 outline-none text-red-600 bg-red-50/20"
                />
                <div className="flex gap-2">
                  <button
                    id="execute-purge-btn"
                    onClick={handleClearDatabase}
                    className="grow py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs transition-all cursor-pointer"
                  >
                    {currentLanguage === 'TH' ? 'ยืนยันการลบถาวร' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setShowClearConfirm(false);
                      setClearInputCheck('');
                    }}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="trigger-purge-modal-btn"
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-sm text-xs transition-all cursor-pointer"
              >
                Clear All Responses
              </button>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: MANAGE QUESTIONS (CRUD Builders) */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Question List Column */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {currentLanguage === 'TH' ? 'รายการข้อคำถามทั้งหมด' : 'Survey Questionnaire Elements'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {currentLanguage === 'TH' ? 'จำนวนข้อสอบถามทั้งหมดที่เปิดทำงานอยู่' : 'Manage academic questionnaire blocks active in respondents form.'}
                </p>
              </div>
              
              {!showQuestionForm && (
                <button
                  id="add-question-btn"
                  onClick={() => {
                    setEditingQuestionId(null);
                    setNewQuestionTextTH('');
                    setNewQuestionTextEN('');
                    setNewQuestionSection(1);
                    setNewQuestionOrder(questions.length + 1);
                    setNewQuestionNewOnly(false);
                    setShowQuestionForm(true);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-[#0F2C59] hover:bg-[#1E4D8C] text-white font-bold rounded-lg transition-all text-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{currentLanguage === 'TH' ? 'เพิ่มข้อใหม่' : 'Add Question'}</span>
                </button>
              )}
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 divide-y divide-slate-100">
              {sections.map(sec => {
                const secQuests = questions.filter(q => q.section === sec.id);
                return (
                  <div key={sec.id} className="pt-4 first:pt-0">
                    <span className="text-[10px] font-extrabold text-[#0F2C59] bg-blue-50 px-2.5 py-1 rounded border inline-block mb-3">
                      ด้านที่ {sec.id}: {sec.titleTH} / <span className="font-normal italic text-slate-500">{sec.titleEN}</span>
                    </span>
                    
                    <ul className="space-y-3">
                      {secQuests.map(q => (
                        <li key={q.id} className="flex items-start justify-between gap-4 p-3 hover:bg-slate-50 rounded-xl border border-dashed transition-colors">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 tabular-nums">{q.section}.{q.order}</span>
                            <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.textTH}</p>
                            {q.textEN && <p className="text-[11px] text-slate-400 italic leading-relaxed">{q.textEN}</p>}
                            {q.isNewTeacherOnly && (
                              <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">เฉพาะอาจารย์ใหม่</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditQuestion(q)}
                              className="p-1.5 hover:bg-blue-50 text-[#0F2C59] rounded border transition-colors cursor-pointer"
                              title="แก้ไขคำถาม"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded border border-red-100 transition-colors cursor-pointer"
                              title="ลบคำถาม"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Form Editor Column */}
          <div>
            {showQuestionForm ? (
              <form onSubmit={handleSaveQuestion} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-xs font-extrabold text-[#003399] uppercase tracking-wider">
                    {editingQuestionId ? 'Edit Question Detail' : 'Create New Question Block'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowQuestionForm(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Section selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Number (ด้านที่)</label>
                  <select
                    value={newQuestionSection}
                    onChange={(e) => setNewQuestionSection(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-white text-slate-700 p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>ด้านที่ {s.id} - {currentLanguage === 'TH' ? s.titleTH : s.titleEN}</option>
                    ))}
                  </select>
                </div>

                {/* Question text Thai */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">เนื้อหาข้อคำถาม (ภาษาไทย)</label>
                  <textarea
                    rows={3}
                    value={newQuestionTextTH}
                    onChange={(e) => setNewQuestionTextTH(e.target.value)}
                    placeholder="กรอกเนื้อหาคำถามประเมิน..."
                    className="w-full text-xs font-medium bg-white text-slate-700 p-2.5 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>

                {/* Order field */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Order (ข้อที่)</label>
                    <input
                      type="number"
                      value={newQuestionOrder}
                      onChange={(e) => setNewQuestionOrder(Number(e.target.value))}
                      className="w-full text-xs font-bold p-2.5 bg-white border rounded-lg outline-none"
                    />
                  </div>

                  {/* Orientation only */}
                  <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newQuestionNewOnly}
                        onChange={(e) => setNewQuestionNewOnly(e.target.checked)}
                        className="h-4 w-4 text-[#003399]"
                      />
                      <span>New Teacher Only?</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003399] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  <span>{editingQuestionId ? 'Update Question' : 'Save Question'}</span>
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-400 text-xs">
                Select a question on the left to edit, or click "Add Question" to append a brand-new evaluation query blocks.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 5: SYSTEM SETTINGS AND NOTIFICATION SERVICES */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GENERAL CONFIG FORM */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Settings size={18} className="text-amber-500" />
                <span>{currentLanguage === 'TH' ? 'ตั้งค่าระบบประกันคุณภาพและแบบสำรวจ' : 'QA Survey Term Configuration'}</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentLanguage === 'TH' ? 'ตั้งค่าคำตอบการเปิดรับข้อมูลระบบจำลองสำหรับเจ้าหน้าที่ประกันคุณภาพ' : 'Manage academic terms, form gates status, and security limits.'}
              </p>
            </div>

            {settings ? (
              <div className="space-y-4 text-xs font-medium">
                
                {/* Academic Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{currentLanguage === 'TH' ? 'ปีการศึกษาประเมิน' : 'Academic Year'}</label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    className="w-full text-xs font-bold p-2.5 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="2568"
                  />
                </div>

                {/* Survey open/closed toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">{currentLanguage === 'TH' ? 'การเปิดรับความคิดเห็นของอาจารย์' : 'Survey Ingress status'}</label>
                  <div className="flex gap-4 p-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={settings.isOpen === true}
                        onChange={() => setSettings({ ...settings, isOpen: true })}
                        className="h-4 w-4 text-[#003399]"
                      />
                      <span className="text-emerald-600">{currentLanguage === 'TH' ? 'เปิดระบบรับข้อมูลปกติ' : 'Open Survey'}</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={settings.isOpen === false}
                        onChange={() => setSettings({ ...settings, isOpen: false })}
                        className="h-4 w-4 text-[#003399]"
                      />
                      <span className="text-red-600">{currentLanguage === 'TH' ? 'ปิดระบบรับข้อมูลชั่วคราว' : 'Close Survey'}</span>
                    </label>
                  </div>
                </div>

                {/* Google Apps Script Endpoint URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Google Apps Script Email Web App URL</span>
                    <Mail size={12} className="text-[#003399]" />
                  </label>
                  <input
                    id="apps-script-url-input"
                    type="url"
                    value={settings.googleAppsScriptUrl}
                    onChange={(e) => setSettings({ ...settings, googleAppsScriptUrl: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 bg-white border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-[#003399]"
                    placeholder="https://script.google.com/macros/s/.../exec"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    {currentLanguage === 'TH' 
                      ? 'เมื่อกรอก URL นี้ ระบบจะยิงข้อความแจ้งเตือนทางอีเมลไปหาผู้ดูแลและอาจารย์ผู้ส่งโดยอัตโนมัติเมื่อมีการกรอกและส่งข้อมูล'
                      : 'When configured, the application triggers POST requests to this Google Web App to send real automated emails on Survey completion.'
                    }
                  </p>
                </div>

                <button
                  id="save-settings-btn"
                  type="submit"
                  className="w-full py-2.5 bg-[#003399] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs transition-all cursor-pointer mb-2"
                >
                  Save Configuration
                </button>

                <div className="border-t pt-4 mt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {currentLanguage === 'TH' ? 'จัดการฐานข้อมูลและซิงค์ข้อมูลหลัก' : 'Database Seeding Maintenance'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    {currentLanguage === 'TH' 
                      ? 'ปุ่มนี้ใช้สำหรับแก้ไขปัญหาที่คณะ หลักสูตร หรือสาขาวิชาไม่แสดง หรือเมื่อมีการอัปเดตไฟล์ข้อมูลหลักต้นแบบ เพื่อบังคับให้ระบบเขียนทับและบันทึกข้อมูลคณะ-หลักสูตร-สาขาวิชาทั้งหมดในฐานข้อมูลใหม่ให้ถูกต้องสมบูรณ์'
                      : 'If majors or programs are not showing correctly in the dropdown list, click below to force-reseed and overwrite database collections from the updated master seed data.'
                    }
                  </p>
                  <button
                    type="button"
                    onClick={handleForceSync}
                    disabled={syncing}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold rounded-xl shadow-sm text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {syncing ? (
                      <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : null}
                    <span>
                      {currentLanguage === 'TH' ? 'บังคับซิงค์ข้อมูล คณะ / หลักสูตร / สาขาวิชา' : 'Force Re-Sync Master Data Now'}
                    </span>
                  </button>
                </div>

              </div>
            ) : null}
          </form>

          {/* EMAIL SYSTEM AND GOOGLE APPS SCRIPT TUTORIAL GUIDE */}
          <div className="bg-gradient-to-br from-[#003399] to-blue-800 text-white rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Mail size={16} />
              <span>Google Apps Script Integration (Notification Service)</span>
            </h4>
            <div className="text-[11px] leading-relaxed text-blue-100 space-y-3 font-medium">
              <p>
                Because Firebase Auth / Firestore Spark plan is serverless, you can deploy a lightweight Google Apps Script as a Web App to handle direct emails securely.
              </p>
              
              <div className="bg-white/10 p-3 rounded-lg text-[10px] space-y-2 border border-white/10 font-mono text-white max-h-48 overflow-y-auto">
                <span className="text-amber-300 font-bold block">// Google Apps Script (Code.gs)</span>
                <span>{`function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var recipient = "pornpun.w@bu.ac.th";
  var subject = "";
  var body = "";
  
  if (data.action === "SUBMIT_SURVEY") {
    subject = "BU QA Survey: " + data.email + " Submitted";
    body = "Academic Year: " + data.academicYear + "\\n" +
           "Faculty: " + data.facultyName + "\\n" +
           "Role: " + data.respondentType;
    MailApp.sendEmail(data.email, subject, body); // To User
    MailApp.sendEmail(recipient, subject, body); // To Admin
  }
  
  return ContentService.createTextOutput("OK");
}`}</span>
              </div>

              <ol className="list-decimal pl-4 space-y-1.5">
                <li>Create a script at <a href="https://script.google.com" target="_blank" className="text-amber-300 hover:underline">script.google.com</a></li>
                <li>Paste code and click <strong>Deploy &gt; New Deployment</strong></li>
                <li>Set Execute as <strong>"Me"</strong> and Who has access to <strong>"Anyone"</strong></li>
                <li>Authorize permissions, copy the generated Web App URL and paste it in General Config on the left!</li>
              </ol>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
