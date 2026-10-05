export type Language = 'TH' | 'EN';

export interface Translation {
  TH: string;
  EN: string;
}

export interface Faculty {
  id: string;
  nameTH: string;
  nameEN: string;
}

export interface Program {
  id: string;
  facultyId: string;
  nameTH: string;
  nameEN: string;
  educationLevel?: 'Bachelor' | 'Master' | 'Doctorate';
}

export interface Major {
  id: string;
  programId: string;
  nameTH: string;
  nameEN: string;
}

export interface Question {
  id: string;
  section: number;
  order: number;
  textTH: string;
  textEN: string;
  isNewTeacherOnly?: boolean;
}

export interface SurveyResponse {
  id?: string;
  userId: string;
  userEmail: string;
  timestamp: any; // Firestore Timestamp
  academicYear: string;
  
  // Respondent profile
  educationLevel: 'Bachelor' | 'Master' | 'Doctorate';
  facultyId: string;
  facultyNameTH: string;
  facultyNameEN: string;
  programId: string;
  programNameTH: string;
  programNameEN: string;
  majorId: string;
  majorNameTH: string;
  majorNameEN: string;
  respondentType: 'Leader' | 'Regular' | 'Teacher'; // อาจารย์ผู้รับผิดชอบหลักสูตร, อาจารย์ประจำหลักสูตร, อาจารย์ผู้สอน
  isNewTeacher: boolean;

  // Answers: Key is questionId, value is rating (1-5)
  ratings: Record<string, number>;
  
  // Open ended answers
  strengths: string;
  improvements: string;
  comments: string;
}

export interface AppSettings {
  id: string;
  academicYear: string;
  isOpen: boolean;
  googleAppsScriptUrl: string;
  admins: string[]; // List of admin emails
}

export interface SectionDetails {
  id: number;
  titleTH: string;
  titleEN: string;
  descriptionTH: string;
  descriptionEN: string;
}
