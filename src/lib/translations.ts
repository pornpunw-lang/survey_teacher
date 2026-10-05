import { Translation } from '../types';

export const uiTranslations: Record<string, Translation> = {
  appTitle: {
    TH: 'แบบประเมินความพึงพอใจของอาจารย์ผู้รับผิดชอบ/ประจำหลักสูตรและอาจารย์ผู้สอน / Faculty Satisfaction Survey for Program Directors, Curriculum Instructors, and Instructors',
    EN: 'Faculty Satisfaction Survey for Program Directors, Curriculum Instructors, and Instructors'
  },
  objectiveTitle: {
    TH: 'วัตถุประสงค์และคำชี้แจง',
    EN: 'Objectives & Instructions'
  },
  objectiveText: {
    TH: 'โปรดแสดงความคิดเห็นต่อการดำเนินงานของหลักสูตรตามประเด็นต่างๆ เพื่อนำผลการสำรวจไปใช้ในการพัฒนาระบบการบริหารการประกันคุณภาพการศึกษาและกระบวนการเรียนการสอนของมหาวิทยาลัยกรุงเทพต่อไป',
    EN: 'Please provide your feedback on the curriculum operations across various aspects. Survey results will be used to improve educational quality assurance administration and teaching-learning processes at Bangkok University.'
  },
  ratingLegendTitle: {
    TH: 'เกณฑ์ระดับความคิดเห็น / ระดับความพึงพอใจ',
    EN: 'Rating Scale Criteria'
  },
  rating5: {
    TH: '5 = เห็นด้วยมากที่สุด / มีการดำเนินการชัดเจนมาก',
    EN: '5 = Strongly Agree / Very Clear Implementation'
  },
  rating4: {
    TH: '4 = เห็นด้วยมาก',
    EN: '4 = Agree'
  },
  rating3: {
    TH: '3 = ปานกลาง',
    EN: '3 = Neutral / Moderate'
  },
  rating2: {
    TH: '2 = เห็นด้วยน้อย',
    EN: '2 = Disagree'
  },
  rating1: {
    TH: '1 = เห็นด้วยน้อยที่สุด / ยังไม่ชัดเจน',
    EN: '1 = Strongly Disagree / Unclear Implementation'
  },
  profileSection: {
    TH: 'ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม / Respondent Profile',
    EN: 'Respondent Profile Information'
  },
  eduLevel: {
    TH: 'ระดับการศึกษา / Education Level',
    EN: 'Education Level'
  },
  bachelor: {
    TH: 'ปริญญาตรี / Bachelor',
    EN: 'Bachelor\'s Degree'
  },
  master: {
    TH: 'ปริญญาโท / Master',
    EN: 'Master\'s Degree'
  },
  doctorate: {
    TH: 'ปริญญาเอก / Doctorate',
    EN: 'Doctorate\'s Degree'
  },
  faculty: {
    TH: 'คณะสังกัด / Faculty',
    EN: 'Faculty / School'
  },
  selectFaculty: {
    TH: '--- เลือกคณะสังกัด / Select Faculty ---',
    EN: '--- Select Faculty ---'
  },
  program: {
    TH: 'หลักสูตร / Program',
    EN: 'Program / Curriculum'
  },
  selectProgram: {
    TH: '--- เลือกหลักสูตร / Select Program ---',
    EN: '--- Select Program ---'
  },
  major: {
    TH: 'สาขาวิชา / Major',
    EN: 'Major / Field of Study'
  },
  selectMajor: {
    TH: '--- เลือกสาขาวิชา / Select Major ---',
    EN: '--- Select Major ---'
  },
  respondentType: {
    TH: 'ประเภทผู้ตอบแบบสอบถาม / Respondent Type',
    EN: 'Type of Respondent'
  },
  typeLeader: {
    TH: 'อาจารย์ผู้รับผิดชอบหลักสูตร / Program Director',
    EN: 'Program Director'
  },
  typeRegular: {
    TH: 'อาจารย์ประจำหลักสูตร / Curriculum Faculty',
    EN: 'Curriculum Faculty'
  },
  typeTeacher: {
    TH: 'อาจารย์ผู้สอน / Instructor',
    EN: 'Instructor'
  },
  isNewTeacher: {
    TH: 'คุณเป็นอาจารย์ใหม่ (อายุงานน้อยกว่า 1 ปีในหลักสูตรนี้) ใช่หรือไม่? / Are you a new instructor (less than 1 year in this program)?',
    EN: 'Are you a new teacher? (Less than 1 year working in this program)'
  },
  yes: {
    TH: 'ใช่ / Yes',
    EN: 'Yes'
  },
  no: {
    TH: 'ไม่ใช่ / No',
    EN: 'No'
  },
  openEndedSection: {
    TH: 'คำถามข้อแนะนำปลายเปิด',
    EN: 'Open-Ended Comments & Suggestions'
  },
  strengthsLabel: {
    TH: '1. จุดแข็งของหลักสูตร',
    EN: '1. Strengths of the Curriculum'
  },
  strengthsPlaceholder: {
    TH: 'กรุณาระบุจุดเด่น กระบวนการที่ดี หรือปัจจัยที่ทำให้หลักสูตรประสบความสำเร็จ...',
    EN: 'Please specify key strengths, good processes, or success factors...'
  },
  improvementsLabel: {
    TH: '2. สิ่งที่ควรปรับปรุง',
    EN: '2. Areas for Improvement'
  },
  improvementsPlaceholder: {
    TH: 'กรุณาระบุจุดที่ควรแก้ไขปรับปรุง แนวทางที่ควรดำเนินงานเพิ่ม...',
    EN: 'Please specify areas that need corrections or enhancement...'
  },
  commentsLabel: {
    TH: '3. ข้อเสนอแนะเพิ่มเติม',
    EN: '3. Additional Comments / Suggestions'
  },
  commentsPlaceholder: {
    TH: 'กรุณาระบุข้อเสนอแนะอื่นๆ เพื่อการปรับปรุงอย่างบูรณาการ...',
    EN: 'Please provide any other constructive feedback for integration...'
  },
  submitBtn: {
    TH: 'ส่งแบบสอบถาม',
    EN: 'Submit Survey'
  },
  submitting: {
    TH: 'กำลังบันทึกข้อมูล...',
    EN: 'Submitting Response...'
  },
  successMessage: {
    TH: 'ส่งแบบสอบถามสำเร็จแล้ว! มหาวิทยาลัยขอขอบพระคุณในความร่วมมือของท่าน',
    EN: 'Survey submitted successfully! The university highly appreciates your valuable feedback.'
  },
  loginTitle: {
    TH: 'ระบบแบบสำรวจความคิดเห็นอาจารย์',
    EN: 'Faculty Survey System'
  },
  loginSubtitle: {
    TH: 'กรุณาลงชื่อเข้าใช้ด้วยบัญชี Google ของมหาวิทยาลัยกรุงเทพเพื่อเริ่มทำแบบสำรวจ',
    EN: 'Please log in with your Bangkok University Google Account to start the survey.'
  },
  loginBtn: {
    TH: 'ลงชื่อเข้าใช้ด้วย Google (@bu.ac.th)',
    EN: 'Sign In with Google (@bu.ac.th)'
  },
  unauthorizedUser: {
    TH: 'ระบบนี้สำหรับบุคลากรมหาวิทยาลัยกรุงเทพเท่านั้น (@bu.ac.th)',
    EN: 'This system is restricted to Bangkok University personnel only (@bu.ac.th).'
  },
  adminSection: {
    TH: 'แผงควบคุมระบบ (สำหรับผู้ดูแลระบบ)',
    EN: 'Admin Control Panel'
  },
  backToSurvey: {
    TH: 'กลับหน้าแบบสำรวจ',
    EN: 'Back to Survey'
  },
  signOut: {
    TH: 'ออกจากระบบ',
    EN: 'Sign Out'
  },
  navSurvey: {
    TH: 'แบบสำรวจ',
    EN: 'Survey'
  },
  navDashboard: {
    TH: 'แดชบอร์ดรายงาน',
    EN: 'Dashboard Report'
  },
  navAdminSettings: {
    TH: 'ตั้งค่าระบบ',
    EN: 'Settings'
  },
  navManageQuestions: {
    TH: 'จัดการคำถาม',
    EN: 'Manage Questions'
  }
};
