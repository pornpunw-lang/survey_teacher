import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Lock, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  Award,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { Language } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
  currentLanguage: Language;
}

export default function WelcomeModal({ isOpen, onClose, currentLanguage }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const isTH = currentLanguage === 'TH';

  const handleStart = () => {
    onClose(dontShowAgain);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-2xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#003399] via-blue-700 to-[#002266] p-6 text-white shrink-0">
          <button
            onClick={handleStart}
            className="absolute top-4 right-4 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 font-black text-lg shadow-inner">
              BU
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles size={13} />
                {isTH ? 'มหาวิทยาลัยกรุงเทพ • ระบบประกันคุณภาพ' : 'Bangkok University • Quality Assurance'}
              </span>
              <p className="text-xs text-blue-200 font-medium">
                {isTH ? 'ระบบสำรวจความพึงพอใจอาจารย์' : 'Faculty Satisfaction Survey System'}
              </p>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-snug">
            {isTH 
              ? 'แบบประเมินความพึงพอใจของอาจารย์ผู้รับผิดชอบ/ประจำหลักสูตรและอาจารย์ผู้สอน'
              : 'Faculty Satisfaction Survey for Program Directors, Curriculum Instructors & Instructors'}
          </h2>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-slate-700 text-sm">
          
          {/* Welcome Greeting Banner */}
          <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl">
            <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 shadow-sm">
              <HeartHandshake size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">
                {isTH ? 'ยินดีต้อนรับอาจารย์ทุกท่าน' : 'Welcome All Faculty Members'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTH
                  ? 'ขอขอบคุณที่สละเวลาอันมีค่าในการร่วมตอบแบบประเมินความพึงพอใจ ความคิดเห็นของท่านมีความสำคัญยิ่งในการขับเคลื่อนคุณภาพการศึกษา'
                  : 'Thank you for your valuable time in completing this survey. Your feedback is essential in driving institutional excellence.'}
              </p>
            </div>
          </div>

          {/* Section 1: Objectives (วัตถุประสงค์) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#003399] font-bold text-sm">
              <Target size={18} className="text-blue-600" />
              <h4>{isTH ? 'วัตถุประสงค์ของการสำรวจ' : 'Survey Objectives'}</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc leading-relaxed">
              <li>
                {isTH
                  ? 'เพื่อสำรวจระดับความพึงพอใจและความคิดเห็นของอาจารย์ผู้รับผิดชอบหลักสูตร อาจารย์ประจำหลักสูตร และอาจารย์ผู้สอน ในด้านการบริหารจัดการหลักสูตรและกระบวนการเรียนการสอน'
                  : 'To assess the satisfaction and perspectives of program directors, curriculum faculty, and instructors on curriculum management and instructional processes.'}
              </li>
              <li>
                {isTH
                  ? 'เพื่อนำข้อมูลและข้อเสนอแนะเชิงสร้างสรรค์ไปใช้ในการพัฒนา ปรับปรุงหลักสูตร และส่งเสริมสิ่งสนับสนุนการเรียนรู้ให้มีประสิทธิภาพสูงสุด'
                  : 'To apply constructive feedback toward continuous curriculum development and enhancing teaching/learning support systems.'}
              </li>
              <li>
                {isTH
                  ? 'เพื่อใช้เป็นข้อมูลสารสนเทศเชิงประจักษ์ประกอบการประกันคุณภาพการศึกษาและการนำเสนอผู้บริหารในการกำหนดนโยบาย'
                  : 'To serve as evidence-based insights for educational quality assurance and strategic decision-making by university executives.'}
              </li>
            </ul>
          </div>

          {/* Section 2: Confidentiality & Data Privacy Guarantee (การรักษาความลับในคำตอบ) */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Lock size={18} className="text-emerald-700" />
              <h4>{isTH ? 'การรักษาความลับในคำตอบ (Strictly Confidential)' : 'Confidentiality & Data Privacy Guarantee'}</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-start gap-2 shadow-2xs">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">
                  {isTH 
                    ? 'แบบสอบถามนี้ไม่ระบุตัวตน (Anonymous) ไม่มีการบันทึกหรือเปิดเผยชื่อผู้ตอบ'
                    : 'Survey is strictly anonymous; no personal identity is revealed.'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-start gap-2 shadow-2xs">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">
                  {isTH 
                    ? 'ข้อมูลทั้งหมดจะถูกประมวลผลและนำเสนอในภาพรวม (Aggregate Data) เท่านั้น'
                    : 'Data is aggregated into overall statistical summaries for leadership.'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 font-medium leading-relaxed pl-1">
              {isTH 
                ? 'โปรดตอบแบบสอบถามตามความคิดเห็นและความเป็นจริง เพื่อประโยชน์สูงสุดในการพัฒนามหาวิทยาลัยร่วมกัน'
                : 'Please answer honestly and candidly to ensure the survey best serves university improvement.'}
            </p>
          </div>

          {/* Section 3: Rating Scale Guide (เกณฑ์การให้คะแนน) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HelpCircle size={16} className="text-amber-600" />
              <span>{isTH ? 'เกณฑ์ระดับคะแนนการประเมินความพึงพอใจ (5 ระดับ: 5 → 1)' : '5-Point Rating Scale Criteria (5 → 1)'}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="font-black text-emerald-600 text-base sm:text-lg">5</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">{isTH ? 'มากที่สุด' : 'Highest'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="font-black text-[#003399] text-base sm:text-lg">4</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">{isTH ? 'มาก' : 'High'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="font-black text-amber-600 text-base sm:text-lg">3</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">{isTH ? 'ปานกลาง' : 'Moderate'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="font-black text-orange-600 text-base sm:text-lg">2</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">{isTH ? 'น้อย' : 'Low'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="font-black text-rose-600 text-base sm:text-lg">1</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">{isTH ? 'น้อยที่สุด' : 'Lowest'}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#003399] focus:ring-blue-500 cursor-pointer"
            />
            <span>{isTH ? 'ไม่ต้องแสดงหน้านี้อัตโนมัติอีก' : "Don't show this popup automatically again"}</span>
          </label>

          {/* Primary CTA button */}
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#003399] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{isTH ? 'รับทราบและเริ่มต้นทำแบบประเมิน' : 'Understood & Begin Survey'}</span>
            <CheckCircle2 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
