import { Faculty, Program, Major, Question } from '../types';

export const DEFAULT_ADMINS = [
  'pornpun.w@bu.ac.th',
  'admin1@bu.ac.th',
  'admin2@bu.ac.th'
];

export const initialFaculties: Faculty[] = [
  { id: 'sem', nameTH: 'คณะการสร้างเจ้าของธุรกิจและการบริหารกิจการ', nameEN: 'School of Entrepreneurship and Management' },
  { id: 'cinema', nameTH: 'คณะดิจิทัลมีเดียและศิลปะภาพยนตร์', nameEN: 'School of Digital Media and Cinematic Arts' },
  { id: 'it', nameTH: 'คณะเทคโนโลยีสารสนเทศและนวัตกรรม', nameEN: 'School of Information Technology and Innovation' },
  { id: 'law', nameTH: 'คณะนิติศาสตร์', nameEN: 'School of Law' },
  { id: 'comarts', nameTH: 'คณะนิเทศศาสตร์', nameEN: 'School of Communication Arts' },
  { id: 'bus', nameTH: 'คณะบริหารธุรกิจ', nameEN: 'School of Business Administration' },
  { id: 'acc', nameTH: 'คณะบัญชี', nameEN: 'School of Accounting' },
  { id: 'human', nameTH: 'คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว', nameEN: 'School of Humanities and Tourism Management' },
  { id: 'eng', nameTH: 'คณะวิศวกรรมศาสตร์', nameEN: 'School of Engineering' },
  { id: 'finearts', nameTH: 'คณะศิลปกรรมศาสตร์', nameEN: 'School of Fine and Applied Arts' },
  { id: 'econ', nameTH: 'คณะเศรษฐศาสตร์และการลงทุน', nameEN: 'School of Economics and Investment' },
  { id: 'arch', nameTH: 'คณะสถาปัตยกรรมศาสตร์', nameEN: 'School of Architecture' },
  { id: 'inter', nameTH: 'วิทยาลัยนานาชาติ', nameEN: 'Bangkok University International' },
  { id: 'china', nameTH: 'วิทยาลัยนานาชาติจีน', nameEN: 'Bangkok University Chinese International' }
];

export const initialPrograms: Program[] = [
  // --- BACHELOR (ระดับปริญญาตรี) ---
  // SEM
  { id: 'b_sem_bba', facultyId: 'sem', educationLevel: 'Bachelor', nameTH: 'หลักสูตรบริหารธุรกิจบัณฑิต', nameEN: 'Bachelor of Business Administration' },

  // Cinema
  { id: 'b_cinema_ca', facultyId: 'cinema', educationLevel: 'Bachelor', nameTH: 'หลักสูตรนิเทศศาสตรบัณฑิต', nameEN: 'Bachelor of Communication Arts' },
  { id: 'b_cinema_ba', facultyId: 'cinema', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปศาสตรบัณฑิต', nameEN: 'Bachelor of Arts' },
  { id: 'b_cinema_bfa', facultyId: 'cinema', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปบัณฑิต', nameEN: 'Bachelor of Fine Arts' },

  // IT
  { id: 'b_it_bsc', facultyId: 'it', educationLevel: 'Bachelor', nameTH: 'หลักสูตรวิทยาศาสตรบัณฑิต', nameEN: 'Bachelor of Science' },

  // Law
  { id: 'b_law_llb', facultyId: 'law', educationLevel: 'Bachelor', nameTH: 'หลักสูตรนิติศาสตรบัณฑิต', nameEN: 'Bachelor of Laws' },

  // Communication Arts
  { id: 'b_comarts_ca', facultyId: 'comarts', educationLevel: 'Bachelor', nameTH: 'หลักสูตรนิเทศศาสตรบัณฑิต', nameEN: 'Bachelor of Communication Arts' },
  { id: 'b_comarts_bfa', facultyId: 'comarts', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปบัณฑิต', nameEN: 'Bachelor of Fine Arts' },
  { id: 'b_comarts_ba', facultyId: 'comarts', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปศาสตรบัณฑิต', nameEN: 'Bachelor of Arts' },

  // Business Administration
  { id: 'b_bus_bba', facultyId: 'bus', educationLevel: 'Bachelor', nameTH: 'หลักสูตรบริหารธุรกิจบัณฑิต', nameEN: 'Bachelor of Business Administration' },

  // Accounting
  { id: 'b_acc_acc', facultyId: 'acc', educationLevel: 'Bachelor', nameTH: 'หลักสูตรบัญชีบัณฑิต', nameEN: 'Bachelor of Accounting' },

  // Humanities & Tourism
  { id: 'b_human_ba', facultyId: 'human', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปศาสตรบัณฑิต', nameEN: 'Bachelor of Arts' },

  // Engineering
  { id: 'b_eng_beng', facultyId: 'eng', educationLevel: 'Bachelor', nameTH: 'หลักสูตรวิศวกรรมศาสตรบัณฑิต', nameEN: 'Bachelor of Engineering' },

  // Fine and Applied Arts
  { id: 'b_finearts_bfa', facultyId: 'finearts', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปกรรมศาสตรบัณฑิต', nameEN: 'Bachelor of Fine and Applied Arts' },

  // Economics & Investment
  { id: 'b_econ_econ', facultyId: 'econ', educationLevel: 'Bachelor', nameTH: 'หลักสูตรเศรษฐศาสตรบัณฑิต', nameEN: 'Bachelor of Economics' },

  // Architecture
  { id: 'b_arch_barch', facultyId: 'arch', educationLevel: 'Bachelor', nameTH: 'หลักสูตรสถาปัตยกรรมศาสตรบัณฑิต', nameEN: 'Bachelor of Architecture' },
  { id: 'b_arch_bfa', facultyId: 'arch', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปบัณฑิต', nameEN: 'Bachelor of Fine Arts' },

  // BU International
  { id: 'b_inter_bba', facultyId: 'inter', educationLevel: 'Bachelor', nameTH: 'หลักสูตรบริหารธุรกิจบัณฑิต', nameEN: 'Bachelor of Business Administration' },
  { id: 'b_inter_bca', facultyId: 'inter', educationLevel: 'Bachelor', nameTH: 'หลักสูตรนิเทศศาสตรบัณฑิต', nameEN: 'Bachelor of Communication Arts' },
  { id: 'b_inter_ba', facultyId: 'inter', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปศาสตรบัณฑิต', nameEN: 'Bachelor of Arts' },
  { id: 'b_inter_bsc', facultyId: 'inter', educationLevel: 'Bachelor', nameTH: 'หลักสูตรวิทยาศาสตรบัณฑิต', nameEN: 'Bachelor of Science' },

  // BU Chinese International
  { id: 'b_china_ba', facultyId: 'china', educationLevel: 'Bachelor', nameTH: 'หลักสูตรศิลปศาสตรบัณฑิต', nameEN: 'Bachelor of Arts' },
  { id: 'b_china_bba', facultyId: 'china', educationLevel: 'Bachelor', nameTH: 'หลักสูตรบริหารธุรกิจบัณฑิต', nameEN: 'Bachelor of Business Administration' },

  // --- MASTER (ระดับปริญญาโท) ---
  // SEM
  { id: 'm_sem_mm', facultyId: 'sem', educationLevel: 'Master', nameTH: 'หลักสูตรการจัดการมหาบัณฑิต', nameEN: 'Master of Management' },

  // IT
  { id: 'm_it_msc', facultyId: 'it', educationLevel: 'Master', nameTH: 'หลักสูตรวิทยาศาสตรมหาบัณฑิต', nameEN: 'Master of Science' },

  // Law
  { id: 'm_law_llm', facultyId: 'law', educationLevel: 'Master', nameTH: 'หลักสูตรนิติศาสตรมหาบัณฑิต', nameEN: 'Master of Laws' },

  // Communication Arts
  { id: 'm_comarts_mca', facultyId: 'comarts', educationLevel: 'Master', nameTH: 'หลักสูตรนิเทศศาสตรมหาบัณฑิต', nameEN: 'Master of Communication Arts' },

  // Business Administration
  { id: 'm_bus_mba', facultyId: 'bus', educationLevel: 'Master', nameTH: 'หลักสูตรบริหารธุรกิจมหาบัณฑิต', nameEN: 'Master of Business Administration' },

  // Humanities & Tourism
  { id: 'm_human_ma', facultyId: 'human', educationLevel: 'Master', nameTH: 'หลักสูตรศิลปศาสตรมหาบัณฑิต', nameEN: 'Master of Arts' },

  // Engineering
  { id: 'm_eng_meng', facultyId: 'eng', educationLevel: 'Master', nameTH: 'หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต', nameEN: 'Master of Engineering' },

  // Architecture
  { id: 'm_arch_march', facultyId: 'arch', educationLevel: 'Master', nameTH: 'หลักสูตรสถาปัตยกรรมศาสตรมหาบัณฑิต', nameEN: 'Master of Architecture' },

  // BU International
  { id: 'm_inter_mba', facultyId: 'inter', educationLevel: 'Master', nameTH: 'หลักสูตรบริหารธุรกิจมหาบัณฑิต', nameEN: 'Master of Business Administration' },

  // --- DOCTORATE (ระดับปริญญาเอก) ---
  // Communication Arts
  { id: 'd_comarts_dca', facultyId: 'comarts', educationLevel: 'Doctorate', nameTH: 'หลักสูตรนิเทศศาสตรดุษฎีบัณฑิต', nameEN: 'Doctor of Communication Arts' },

  // Engineering
  { id: 'd_eng_deng', facultyId: 'eng', educationLevel: 'Doctorate', nameTH: 'หลักสูตรวิศวกรรมศาสตรดุษฎีบัณฑิต', nameEN: 'D.Eng. in Electrical and Computer Engineering' },

  // BU International
  { id: 'd_inter_phd', facultyId: 'inter', educationLevel: 'Doctorate', nameTH: 'หลักสูตรปรัชญาดุษฎีบัณฑิต', nameEN: 'Ph.D. in Knowledge Management and Innovation Management' }
];

export const initialMajors: Major[] = [
  // --- PAGE 1 ---
  // คณะการสร้างเจ้าของธุรกิจและการบริหารกิจการ (Bachelor)
  { id: 'm_sem_bba_ent', programId: 'b_sem_bba', nameTH: 'สาขาวิชาการเป็นเจ้าของธุรกิจ', nameEN: 'Entrepreneurship' },
  { id: 'm_sem_bba_ent_inter', programId: 'b_sem_bba', nameTH: 'สาขาวิชาการเป็นเจ้าของธุรกิจ (หลักสูตรนานาชาติ)', nameEN: 'Entrepreneurship (International Program)' },
  // คณะการสร้างเจ้าของธุรกิจและการบริหารกิจการ (Master)
  { id: 'm_sem_mm_ent', programId: 'm_sem_mm', nameTH: 'สาขาวิชาความเป็นผู้ประกอบการ', nameEN: 'Entrepreneurship and Emerging Enterprises' },

  // คณะดิจิทัลมีเดียและศิลปะภาพยนตร์ (Bachelor)
  { id: 'm_cinema_film', programId: 'b_cinema_ca', nameTH: 'สาขาวิชาภาพยนตร์', nameEN: 'Film' },
  { id: 'm_cinema_dm', programId: 'b_cinema_ba', nameTH: 'สาขาวิชาสื่อดิจิทัล', nameEN: 'Digital Media' },
  { id: 'm_cinema_film_series', programId: 'b_cinema_ba', nameTH: 'สาขาวิชาการผลิตและธุรกิจภาพยนตร์ ซีรีส์ และเนื้อหาสากล (หลักสูตรนานาชาติ)', nameEN: 'Film, Series and Global Content Production and Business (International Program)' },
  { id: 'm_cinema_vp', programId: 'b_cinema_bfa', nameTH: 'สาขาวิชาการผลิตเสมือนและการออกแบบประสบการณ์โลกเสมือนจริง', nameEN: 'Virtual Production and Immersive Experience Design' },

  // คณะเทคโนโลยีสารสนเทศและนวัตกรรม (Bachelor)
  { id: 'm_it_cs', programId: 'b_it_bsc', nameTH: 'สาขาวิชาวิทยาการคอมพิวเตอร์', nameEN: 'Computer Science' },
  { id: 'm_it_it', programId: 'b_it_bsc', nameTH: 'สาขาวิชาเทคโนโลยีสารสนเทศ', nameEN: 'Information Technology' },
  { id: 'm_it_games', programId: 'b_it_bsc', nameTH: 'สาขาวิชาเกมและสื่อเชิงโต้ตอบ', nameEN: 'Games and Interactive Media' },
  // คณะเทคโนโลยีสารสนเทศและนวัตกรรม (Master)
  { id: 'm_it_itds', programId: 'm_it_msc', nameTH: 'สาขาวิชาเทคโนโลยีสารสนเทศและวิทยาการข้อมูล', nameEN: 'Information Technology and Data Science' },

  // คณะนิติศาสตร์ (Bachelor)
  { id: 'm_law_law', programId: 'b_law_llb', nameTH: 'สาขาวิชานิติศาสตร์', nameEN: 'Law Program' },
  // คณะนิติศาสตร์ (Master)
  { id: 'm_law_laws', programId: 'm_law_llm', nameTH: 'สาขาวิชานิติศาสตร์', nameEN: 'Laws Program' },

  // คณะนิเทศศาสตร์ (Bachelor)
  { id: 'm_comarts_cnm', programId: 'b_comarts_ca', nameTH: 'สาขาวิชาการสื่อสารและสื่อใหม่', nameEN: 'Communication and New Media' },
  { id: 'm_comarts_broadcast', programId: 'b_comarts_ca', nameTH: 'สาขาวิชาวิทยุกระจายเสียง วิทยุโทรทัศน์ และ การผลิตสื่อสตรีมมิ่ง', nameEN: 'Broadcasting and Streaming Media Production' },
  { id: 'm_comarts_creative', programId: 'b_comarts_ca', nameTH: 'สาขาวิชาการผลิตเนื้อหาสร้างสรรค์และประสบการณ์ดิจิทัล', nameEN: 'Creative Content Production and Digital Experience' },
  { id: 'm_comarts_perf', programId: 'b_comarts_bfa', nameTH: 'สาขาวิชาศิลปะการแสดง', nameEN: 'Performing Arts' },
  { id: 'm_comarts_event', programId: 'b_comarts_ba', nameTH: 'สาขาวิชาการผลิตอีเว้นท์ และการจัดการนิทรรศการและการประชุม', nameEN: 'Event Production and MICE Management' },
  { id: 'm_comarts_creator', programId: 'b_comarts_ca', nameTH: 'สาขาวิชาการสร้างสรรค์และการสร้างแบรนด์อินฟลูเอนเซอร์ระดับสากล', nameEN: 'Global Creator and Influencer Branding' },
  // คณะนิเทศศาสตร์ (Master)
  { id: 'm_comarts_sbcm_m', programId: 'm_comarts_mca', nameTH: 'สาขาวิชาการบริหารแบรนด์และการสื่อสารเชิงกลยุทธ์', nameEN: 'Strategic Brand and Communication Management' },
  { id: 'm_comarts_gc_inter_m', programId: 'm_comarts_mca', nameTH: 'สาขาวิชาการสื่อสารสากล (หลักสูตรนานาชาติ)', nameEN: 'Global Communication (International Program)' },
  { id: 'm_comarts_dmc_m', programId: 'm_comarts_mca', nameTH: 'สาขาวิชาการสื่อสารการตลาดดิจิทัล', nameEN: 'Digital Marketing Communications' },
  // คณะนิเทศศาสตร์ (Doctorate)
  { id: 'm_comarts_gc_inter_d', programId: 'd_comarts_dca', nameTH: 'สาขาวิชาการสื่อสารสากล (หลักสูตรนานาชาติ)', nameEN: 'Global Communication (International Program)' },
  { id: 'm_comarts_sbcm_d', programId: 'd_comarts_dca', nameTH: 'สาขาวิชาการบริหารแบรนด์และการสื่อสารเชิงกลยุทธ์', nameEN: 'Strategic Brand and Communication Management' },

  // คณะบริหารธุรกิจ (Bachelor)
  { id: 'm_bus_mkt', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการตลาด', nameEN: 'Marketing' },
  { id: 'm_bus_fin', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการเงิน', nameEN: 'Finance' },
  { id: 'm_bus_mgt', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการจัดการ', nameEN: 'Management' },
  { id: 'm_bus_ibm', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการจัดการธุรกิจระหว่างประเทศ', nameEN: 'International Business Management' },
  { id: 'm_bus_logistics', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการจัดการโลจิสติกส์และโซ่อุปทาน', nameEN: 'Logistics and Supply Chain Management' },
  { id: 'm_bus_fip', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการวางแผนการเงินและการลงทุน', nameEN: 'Financial and Investment Planning' },
  { id: 'm_bus_dmkt', programId: 'b_bus_bba', nameTH: 'สาขาวิชาการตลาดดิจิทัล', nameEN: 'Digital Marketing' },
  // คณะบริหารธุรกิจ (Master)
  { id: 'm_bus_mba_th', programId: 'm_bus_mba', nameTH: 'สาขาวิชาบริหารธุรกิจ (หลักสูตรภาษาไทย)', nameEN: 'Business Administration' },
  { id: 'm_bus_mba_en', programId: 'm_bus_mba', nameTH: 'สาขาวิชาบริหารธุรกิจ (หลักสูตรภาษาอังกฤษ)', nameEN: 'Business Administration (English Program)' },
  { id: 'm_bus_mba_innov', programId: 'm_bus_mba', nameTH: 'สาขาวิชาการจัดการนวัตกรรม (หลักสูตรนานาชาติ)', nameEN: 'Innovation Management (International Program)' },
  { id: 'm_bus_mba_edutech', programId: 'm_bus_mba', nameTH: 'สาขาวิชาการจัดการศึกษาผ่านระบบเทคโนโลยีสารสนเทศ', nameEN: 'Educational Management through Information Technology' },

  // --- PAGE 2 ---
  // คณะบัญชี (Bachelor)
  { id: 'm_acc_acc', programId: 'b_acc_acc', nameTH: 'สาขาวิชาบัญชี', nameEN: 'Accounting Program' },

  // คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว (Bachelor)
  { id: 'm_human_eng', programId: 'b_human_ba', nameTH: 'สาขาวิชาภาษาอังกฤษ', nameEN: 'English' },
  { id: 'm_human_tour_cruise', programId: 'b_human_ba', nameTH: 'สาขาวิชาการจัดการการท่องเที่ยวและเรือสำราญ', nameEN: 'Tourism and Cruise Management' },
  { id: 'm_human_hotel', programId: 'b_human_ba', nameTH: 'สาขาวิชาการจัดการการโรงแรม', nameEN: 'Hotel Management' },
  { id: 'm_human_airline', programId: 'b_human_ba', nameTH: 'สาขาวิชาการจัดการธุรกิจสายการบิน', nameEN: 'Airline Business Management' },
  // คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว (Master)
  { id: 'm_human_innov_tour', programId: 'm_human_ma', nameTH: 'สาขาวิชานวัตกรรมการจัดการการท่องเที่ยวและการบริการ', nameEN: 'Tourism and Hospitality Management Innovation (International Program)' },
  // คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว (Bachelor)
  { id: 'm_human_culinary', programId: 'b_human_ba', nameTH: 'สาขาวิชาศิลปะการประกอบอาหารและการจัดการการบริการธุรกิจร้านอาหาร', nameEN: 'Culinary Arts and Restaurant Service Management' },

  // คณะวิศวกรรมศาสตร์ (Bachelor)
  { id: 'm_eng_ee', programId: 'b_eng_beng', nameTH: 'สาขาวิชาวิศวกรรมไฟฟ้า', nameEN: 'Electrical Engineering' },
  { id: 'm_eng_cre', programId: 'b_eng_beng', nameTH: 'สาขาวิชาวิศวกรรมคอมพิวเตอร์และหุ่นยนต์', nameEN: 'Computer and Robotics Engineering' },
  { id: 'm_eng_mee', programId: 'b_eng_beng', nameTH: 'สาขาวิชาวิศวกรรมมัลติมีเดียและเอ็นเตอร์เทนเมนต์', nameEN: 'Multimedia and Entertainment Engineering' },
  { id: 'm_eng_aids', programId: 'b_eng_beng', nameTH: 'สาขาวิชาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล', nameEN: 'Artificial Intelligence Engineering and Data Science' },
  // คณะวิศวกรรมศาสตร์ (Master)
  { id: 'm_eng_ece_inter_m', programId: 'm_eng_meng', nameTH: 'สาขาวิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ (หลักสูตรนานาชาติ)', nameEN: 'Electrical & Computer Engineering (International Program)' },
  // คณะวิศวกรรมศาสตร์ (Doctorate)
  { id: 'm_eng_ece_inter_d', programId: 'd_eng_deng', nameTH: 'สาขาวิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ (หลักสูตรนานาชาติ)', nameEN: 'Electrical and Computer Engineering (International Program)' },

  // คณะศิลปกรรมศาสตร์ (Bachelor)
  { id: 'm_finearts_commdesign', programId: 'b_finearts_bfa', nameTH: 'สาขาวิชาการออกแบบนิเทศศิลป์', nameEN: 'Communication Design' },
  { id: 'm_finearts_fashion', programId: 'b_finearts_bfa', nameTH: 'สาขาวิชาการออกแบบแฟชั่น', nameEN: 'Fashion Design' },
  { id: 'm_finearts_artdesign', programId: 'b_finearts_bfa', nameTH: 'สาขาวิชาศิลปะและการออกแบบ', nameEN: 'Art and Design' },

  // คณะเศรษฐศาสตร์และการลงทุน (Bachelor)
  { id: 'm_econ_econ', programId: 'b_econ_econ', nameTH: 'สาขาวิชาเศรษฐศาสตร์', nameEN: 'Economics Program' },

  // คณะสถาปัตยกรรมศาสตร์ (Bachelor)
  { id: 'm_arch_arch5', programId: 'b_arch_barch', nameTH: 'สาขาวิชาสถาปัตยกรรม (หลักสูตร 5 ปี)', nameEN: 'Architecture Program' },
  { id: 'm_arch_interior', programId: 'b_arch_bfa', nameTH: 'สาขาวิชาสถาปัตยกรรมภายใน', nameEN: 'Interior Architecture' },
  // คณะสถาปัตยกรรมศาสตร์ (Master)
  { id: 'm_arch_march_arch', programId: 'm_arch_march', nameTH: 'สาขาวิชาสถาปัตยกรรม', nameEN: 'Architecture Program' },

  // วิทยาลัยนานาชาติ (Bachelor)
  { id: 'm_inter_mkt', programId: 'b_inter_bba', nameTH: 'สาขาวิชาการตลาด (หลักสูตรนานาชาติ)', nameEN: 'Marketing (International Program)' },
  { id: 'm_inter_ba', programId: 'b_inter_bba', nameTH: 'สาขาวิชาบริหารธุรกิจ (หลักสูตรนานาชาติ)', nameEN: 'Business Administration (International Program)' },
  { id: 'm_inter_imp', programId: 'b_inter_bca', nameTH: 'สาขาวิชาการผลิตสื่อนวัตกรรม (หลักสูตรนานาชาติ)', nameEN: 'Innovative Media Production (International Program)' },
  { id: 'm_inter_mc', programId: 'b_inter_bca', nameTH: 'สาขาวิชาสื่อและการสื่อสาร (หลักสูตรนานาชาติ)', nameEN: 'Media and Communication (International Program)' },
  { id: 'm_inter_be', programId: 'b_inter_ba', nameTH: 'สาขาวิชาภาษาอังกฤษธุรกิจ (หลักสูตรนานาชาติ)', nameEN: 'Business English (International Program)' },
  { id: 'm_inter_ithm', programId: 'b_inter_ba', nameTH: 'สาขาวิชาการจัดการท่องเที่ยวและการบริการนานาชาติ (หลักสูตรนานาชาติ)', nameEN: 'International Tourism and Hospitality Management (International Program)' },
  { id: 'm_inter_cad', programId: 'b_inter_ba', nameTH: 'สาขาวิชาศิลปะการประกอบและออกแบบอาหาร (หลักสูตรนานาชาติ)', nameEN: 'Culinary Arts and Design (International Program)' },
  { id: 'm_inter_ccd', programId: 'b_inter_ba', nameTH: 'สาขาวิชาการออกแบบนิเทศศิลป์เชิงสร้างสรรค์ (หลักสูตรนานาชาติ)', nameEN: 'Creative Communication Design (International Program)' },
  // วิทยาลัยนานาชาติ (Master)
  { id: 'm_inter_kmim_m', programId: 'm_inter_mba', nameTH: 'สาขาวิชาการจัดการความรู้และนวัตกรรม (หลักสูตรนานาชาติ)', nameEN: 'Knowledge Management and Innovation Management (International Program)' },
  // วิทยาลัยนานาชาติ (Doctorate)
  { id: 'm_inter_kmim_d', programId: 'd_inter_phd', nameTH: 'สาขาวิชาการจัดการความรู้และนวัตกรรม (หลักสูตรนานาชาติ)', nameEN: 'Knowledge Management and Innovation Management (International Program)' },
  // วิทยาลัยนานาชาติ (Bachelor)
  { id: 'm_inter_cs', programId: 'b_inter_bsc', nameTH: 'สาขาวิชาวิทยาการคอมพิวเตอร์ (หลักสูตรนานาชาติ)', nameEN: 'Computer Science (International Program)' },

  // วิทยาลัยนานาชาติจีน (Bachelor)
  { id: 'm_china_bc', programId: 'b_china_ba', nameTH: 'สาขาวิชาภาษาจีนธุรกิจ', nameEN: 'Business Chinese' },
  { id: 'm_china_bba_bi', programId: 'b_china_bba', nameTH: 'สาขาวิชาบริหารธุรกิจบัณฑิต (หลักสูตรสองภาษา)', nameEN: 'Business Administration Program (Bilingual Program)' }
];

export const initialQuestions: Question[] = [
  // SECTION 1: ด้านหลักสูตร
  {
    id: 'q1_1',
    section: 1,
    order: 1,
    textTH: 'ด้านคุณภาพหลักสูตร',
    textEN: 'Quality of the curriculum.'
  },
  {
    id: 'q1_2',
    section: 1,
    order: 2,
    textTH: 'ด้านผลการเรียนรู้ตามหลักสูตร/สาขาวิชา',
    textEN: 'Learning outcomes achieved through the curriculum/major.'
  },
  {
    id: 'q1_3',
    section: 1,
    order: 3,
    textTH: 'รายวิชาในหลักสูตรมีความเหมาะสม ทันสมัย และสอดคล้องกับผลลัพธ์การเรียนรู้ของหลักสูตร ความต้องการของผู้เรียน และความต้องการของตลาดแรงงาน',
    textEN: 'Courses in the curriculum are appropriate, up-to-date, and aligned with Program Learning Outcomes (PLOs), students\' needs, and industry demands.'
  },
  {
    id: 'q1_4',
    section: 1,
    order: 4,
    textTH: 'หลักสูตรมีการทบทวนและปรับปรุงหลักสูตรอย่างเป็นระบบ เป็นไปตามขั้นตอนและรอบเวลาโดยใช้ข้อมูลจากผลการดำเนินงาน ความคิดเห็นของผู้มีส่วนได้ส่วนเสีย และการเปลี่ยนแปลงทางวิชาการ/วิชาชีพ',
    textEN: 'The curriculum is systematically reviewed and updated according to established procedures and cycles, utilizing operational data, stakeholder feedback, and academic/professional advancements.'
  },

  // SECTION 2: ด้านการจัดการเรียนการสอนและการประเมินผู้เรียน
  {
    id: 'q2_1',
    section: 2,
    order: 1,
    textTH: 'หลักสูตรมีกระบวนการกำหนดตัวผู้สอนที่เหมาะสมกับคุณวุฒิ ความเชี่ยวชาญ ประสบการณ์ และลักษณะของรายวิชา',
    textEN: 'The program has an appropriate process for assigning instructors based on their qualifications, expertise, experience, and courses.'
  },
  {
    id: 'q2_2',
    section: 2,
    order: 2,
    textTH: 'หลักสูตรมีการกำกับ ติดตาม และตรวจสอบการจัดทำ มคอ.3-6ทุกรายวิชา',
    textEN: 'The program monitors, tracks, and verifies the preparation of Course Specifications and Reports (TQF 3-6 or BOE 3-6) for all courses.'
  },
  {
    id: 'q2_3',
    section: 2,
    order: 3,
    textTH: 'การควบคุมการจัดการเรียนการสอน ครอบคลุมเนื้อหาสาระ หรือคำอธิบายรายละเอียดรายวิชาสอดคล้องกับใน มคอ.2',
    textEN: 'Monitoring of instructional management ensures that the contents and course details cover and align with the Program Specification (TQF 2).'
  },
  {
    id: 'q2_4',
    section: 2,
    order: 4,
    textTH: 'การควบคุมการจัดการเรียนการสอนในรายวิชาที่มีหลายกลุ่มผู้เรียน (Section) ดำเนินการเป็นไปตามมาตรฐาน',
    textEN: 'Instructional management for courses with multiple sections is conducted in compliance with established standards.'
  },
  {
    id: 'q2_5',
    section: 2,
    order: 5,
    textTH: 'หลักสูตรจัดการเรียนการสอนตามอัตลักษณ์ของสถาบัน',
    textEN: 'Instructional management aligns with the university identity.'
  },
  {
    id: 'q2_6',
    section: 2,
    order: 6,
    textTH: 'หลักสูตรจัดการเรียนการสอนตาม BU 5 DNAs',
    textEN: 'Instructional management incorporates the BU 5 DNAs.'
  },
  {
    id: 'q2_7',
    section: 2,
    order: 7,
    textTH: 'วิธีการวัดและประเมินผลผู้เรียนมีความเหมาะสม สอดคล้องกับผลลัพธ์การเรียนรู้ และมีเกณฑ์การประเมินที่ชัดเจน เป็นธรรม และตรวจสอบได้',
    textEN: 'Student measurement and assessment methods are appropriate, aligned with learning outcomes, and have clear, fair, and verifiable criteria.'
  },
  {
    id: 'q2_8',
    section: 2,
    order: 8,
    textTH: 'หลักสูตรส่งเสริมให้อาจารย์ใช้เทคนิคการสอนใหม่ ๆ เช่น Active Learning, Project-based Learning, Problem-based Learning, Digital Learning หรือ AI เพื่อพัฒนาการเรียนรู้ของผู้เรียน',
    textEN: 'The program encourages instructors to utilize innovative teaching techniques (e.g., Active Learning, Project-based Learning, Problem-based Learning, Digital Learning, or AI) to enhance student learning.'
  },

  // SECTION 3: ด้านการจัดการข้อร้องเรียนและการบริการ
  {
    id: 'q3_1',
    section: 3,
    order: 1,
    textTH: 'หลักสูตร/คณะมีช่องทางให้นักศึกษา อาจารย์ และผู้มีส่วนได้ส่วนเสียสามารถเสนอข้อคิดเห็น ข้อเสนอแนะ หรือข้อร้องเรียนได้อย่างสะดวก',
    textEN: 'The program/faculty provides convenient channels for students, instructors, and stakeholders to submit feedback, suggestions, or complaints.'
  },
  {
    id: 'q3_2',
    section: 3,
    order: 2,
    textTH: 'หลักสูตรมีกระบวนการรับเรื่อง ตรวจสอบ ตอบกลับ และแก้ไขข้อร้องเรียนอย่างชัดเจน เป็นธรรม รักษาความลับ และดำเนินการภายในระยะเวลาที่เหมาะสม',
    textEN: 'The program has a clear, fair, confidential, and timely process for receiving, investigating, responding to, and resolving complaints.'
  },
  {
    id: 'q3_3',
    section: 3,
    order: 3,
    textTH: 'หลักสูตรนำข้อมูลข้อร้องเรียน ข้อเสนอแนะ และผลการแก้ไขปัญหามาวิเคราะห์เพื่อปรับปรุงการจัดการเรียนการสอน การบริการ และการบริหารหลักสูตรอย่างต่อเนื่อง',
    textEN: 'Complaint data, suggestions, and resolution results are continuously analyzed to improve instructional management, services, and program administration.'
  },
  {
    id: 'q3_4',
    section: 3,
    order: 4,
    textTH: 'หลักสูตรมีการจัดการบริการให้แก่นักศึกษาด้านวิชาการ (Academic Service) และด้านการใช้ชีวิต (Non-Academic Service)',
    textEN: 'The program provides both Academic Services and Non-Academic Services (campus life support) for students.'
  },

  // SECTION 4: ด้านการบริหารและพัฒนาอาจารย์
  {
    id: 'q4_1',
    section: 4,
    order: 1,
    textTH: 'อาจารย์ผู้รับผิดชอบหลักสูตรและอาจารย์ผู้สอนมีส่วนร่วมในการประชุมเพื่อวางแผน ทบทวน และติดตามการดำเนินงานของหลักสูตรอย่างสม่ำเสมอ',
    textEN: 'Program directors and instructors regularly participate in meetings to plan, review, and monitor program operations.'
  },
  {
    id: 'q4_2',
    section: 4,
    order: 2,
    textTH: 'หลักสูตรมีการประชุมหรือกลไกในการพิจารณาการจัดรายวิชา การกำหนดผู้สอน และการบริหารภาระงานสอนอย่างเหมาะสม',
    textEN: 'The program has meetings or mechanisms to appropriately consider course assignments, instructor allocations, and teaching workload management.'
  },
  {
    id: 'q4_3',
    section: 4,
    order: 3,
    textTH: 'หลักสูตรมีการติดตามผลการจัดการเรียนการสอนและผลการประเมินการสอนของอาจารย์ เพื่อนำไปใช้ในการพัฒนาและส่งเสริมคุณภาพการสอนของอาจารย์',
    textEN: 'The program monitors instructional results and faculty teaching evaluations to develop and enhance teaching quality.'
  },
  {
    id: 'q4_4',
    section: 4,
    order: 4,
    textTH: 'อาจารย์ใหม่ได้รับการปฐมนิเทศ ชี้แจงข้อมูลเกี่ยวกับหลักสูตร ระบบการจัดการเรียนการสอน การประเมินผู้เรียน และแนวทางการประกันคุณภาพการศึกษาอย่างเหมาะสม',
    textEN: 'New faculty members receive appropriate orientation regarding the curriculum, instructional management systems, student assessments, and educational quality assurance guidelines.',
    isNewTeacherOnly: true
  },
  {
    id: 'q4_5',
    section: 4,
    order: 5,
    textTH: 'อาจารย์ประจำหลักสูตรและอาจารย์ผู้สอนได้รับการพัฒนาทางวิชาการและวิชาชีพอย่างต่อเนื่อง เพื่อให้ทันต่อการเปลี่ยนแปลงของศาสตร์ วิชาชีพ เทคโนโลยี และความต้องการของผู้เรียน',
    textEN: 'Full-time faculty members and instructors receive continuous academic and professional development to keep pace with changes in knowledge, professions, technology, and student needs.'
  },
  {
    id: 'q4_6',
    section: 4,
    order: 6,
    textTH: 'หลักสูตร/คณะส่งเสริมให้อาจารย์พัฒนาผลงานทางวิชาการ งานวิจัย งานสร้างสรรค์ หรืองานบริการวิชาการที่สอดคล้องกับความเชี่ยวชาญและทิศทางของหลักสูตร',
    textEN: 'The program/faculty encourages instructors to develop academic work, research, creative work, or academic services aligned with their expertise and the program\'s direction.'
  },
  {
    id: 'q4_7',
    section: 4,
    order: 7,
    textTH: 'หลักสูตร/คณะมีการส่งเสริม สนับสนุน และติดตามให้อาจารย์เข้าสู่ตำแหน่งทางวิชาการตามศักยภาพและความพร้อมของแต่ละบุคคล',
    textEN: 'The program/faculty promotes, supports, and monitors instructors in achieving academic titles according to individual potential and readiness.'
  },

  // SECTION 5: ด้านสิ่งสนับสนุนการเรียนรู้
  {
    id: 'q5_1',
    section: 5,
    order: 1,
    textTH: 'ห้องเรียน ห้องปฏิบัติการ อุปกรณ์ เทคโนโลยี และแหล่งเรียนรู้มีความเพียงพอ ทันสมัย เหมาะสม และพร้อมใช้งานต่อการจัดการเรียนการสอน',
    textEN: 'Classrooms, laboratories, equipment, technology, and learning resources are sufficient, modern, appropriate, and ready for instructional use.'
  },
  {
    id: 'q5_2',
    section: 5,
    order: 2,
    textTH: 'ระบบสารสนเทศ แพลตฟอร์มการเรียนรู้ ฐานข้อมูล ห้องสมุด ตำรา/หนังสือ E-book และสื่อการเรียนรู้สนับสนุนการเรียนรู้ของนักศึกษาและการทำงานของอาจารย์ได้อย่างมีประสิทธิภาพ',
    textEN: 'Information systems, learning platforms, databases, libraries, textbooks, e-books, and learning media effectively support student learning and faculty work.'
  },
  {
    id: 'q5_3',
    section: 5,
    order: 3,
    textTH: 'หลักสูตร/คณะมีการประเมินความเพียงพอและความพึงพอใจต่อสิ่งสนับสนุนการเรียนรู้ และนำผลการประเมินไปใช้ในการปรับปรุงอย่างต่อเนื่อง',
    textEN: 'The program/faculty evaluates the adequacy of and satisfaction with learning support facilities, and continuously uses the results for improvement.'
  },
  {
    id: 'q5_4',
    section: 5,
    order: 4,
    textTH: 'อาคารสถานที่ที่ใช้ในการจัดการเรียนการสอนมีความพร้อมด้านความปลอดภัยและการป้องกันอัคคีภัย เช่น ระบบสัญญาณเตือนภัย อุปกรณ์ดับเพลิง ทางหนีไฟ ป้ายบอกทาง และการซ้อมแผนอพยพอย่างเหมาะสม',
    textEN: 'Buildings and facilities used for teaching and learning are well-equipped for safety and fire prevention, featuring alarm systems, fire extinguishers, fire exits, directional signage, and appropriate evacuation drills.'
  }
];

export const sections = [
  {
    id: 1,
    titleTH: 'ด้านหลักสูตร',
    titleEN: 'Curriculum & Program Structure',
    descriptionTH: 'ระดับความพึงพอใจต่อการพัฒนาโครงสร้างและความทันสมัยของหลักสูตรรายวิชา',
    descriptionEN: 'Level of satisfaction with curriculum structure development and updates'
  },
  {
    id: 2,
    titleTH: 'ด้านการจัดการเรียนการสอนและการประเมินผู้เรียน',
    titleEN: 'Teaching, Learning and Student Assessment',
    descriptionTH: 'ระดับความคิดเห็นต่อคุณภาพผู้สอน เทคนิคการสอน และเกณฑ์การประเมินผล',
    descriptionEN: 'Level of agreement on teacher quality, instruction methods, and evaluation criteria'
  },
  {
    id: 3,
    titleTH: 'ด้านการจัดการข้อร้องเรียนและการบริการ',
    titleEN: 'Complaint Management & Student Services',
    descriptionTH: 'ระดับความคิดเห็นต่อช่องทางและกระบวนการจัดการข้อร้องเรียนและการบริการนักศึกษา',
    descriptionEN: 'Level of agreement on complaint handling channels, procedures, and student support services'
  },
  {
    id: 4,
    titleTH: 'ด้านการบริหารและพัฒนาอาจารย์',
    titleEN: 'Faculty Administration & Development',
    descriptionTH: 'ระดับความคิดเห็นต่อระบบบริหาร สภาพแวดล้อม และสวัสดิการบุคลากรสายวิชาการ',
    descriptionEN: 'Level of agreement on administrative systems, workspace environment, and faculty welfare'
  },
  {
    id: 5,
    titleTH: 'ด้านสิ่งสนับสนุนการเรียนรู้',
    titleEN: 'Facilities and Infrastructures',
    descriptionTH: 'ระดับความพึงพอใจต่อห้องเรียน อุปกรณ์ สื่อการเรียนรู้ และระบบความปลอดภัย',
    descriptionEN: 'Level of satisfaction with classrooms, equipment, library learning resources, and safety systems'
  }
];
