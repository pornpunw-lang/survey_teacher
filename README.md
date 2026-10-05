# แบบสำรวจความคิดเห็นอาจารย์ผู้รับผิดชอบหลักสูตรและอาจารย์ผู้สอน ปีการศึกษา 2568 (BU Faculty Survey 2568)

ระบบสตรีมข้อมูลประกันคุณภาพการศึกษารูปแบบดิจิทัล (QA Digitization Program) ของมหาวิทยาลัยกรุงเทพ พัฒนาขึ้นมาเพื่อให้การสำรวจความพึงพอใจต่อหลักสูตร การเรียนการสอน และสิ่งสนับสนุนการเรียนรู้ มีประสิทธิภาพสูงสุด วิเคราะห์สถิติจำนวนจริงแบบ Real-time และส่งออกรายงานสำหรับการทำเอกสารรับรองมาตรฐานได้ทันที

---

## 🎨 การออกแบบหลักสูตรและอินเตอร์เฟส (UI/UX Design)
- **BU Blue Theme**: โทนสีน้ำเงินสถาบันที่เป็นทางการ `#0F2C59` เสริมด้วยสีเหลืองทองและส้มสะท้อนความทันสมัย (Aesthetic Contrast)
- **Modern Typography**: ใช้แบบอักษร **Sarabun** (TH Sarabun New Web Fallback) สำหรับภาษาไทย และ **Inter** สำหรับสถิติและเมนูภาษาอังกฤษ
- **Mobile First / Touch Target**: ปุ่มเลือกระดับคะแนน 1-5 ออกแบบขนาด 44px+ ตอบสนองสัมผัสได้รวดเร็วและเป็นมิตรกับผู้ใช้งานผ่านหน้าจอมือถือ
- **Multi-lingual Toggle**: สลับภาษาของข้อความคำถามและฉลากหัวข้อภาษาไทย (TH) และอังกฤษ (EN) ได้โดยไม่มีอาการหน่วงของระบบ
- **Dynamic Cascade Dropdown**: คัดกรอง คณะ &gt; หลักสูตร &gt; สาขาวิชา แบบลำดับชั้นอัตโนมัติ (Cascade Option) ป้องกันการสับสนกรอกผิดสาขา

---

## ⚙️ โครงสร้างโครงการ (Project Structure)
```text
/
├── firebase-applet-config.json   # ข้อมูลการตั้งค่าความเชื่อมโยงกับโปรเจกต์ Firebase
├── firestore.rules               # กฎความปลอดภัยของฐานข้อมูล Cloud Firestore
├── index.html                    # ไฟล์โฮสต์ HTML ส่วนหน้า
├── metadata.json                 # ข้อมูลเมตาของแอปพริเคชันสำหรับ AI Studio
├── package.json                  # การประกาศพึ่งพาระบบและแพ็กเกจ (React + Vite + Tailwind 4)
├── tsconfig.json                 # การตั้งค่าความปลอดภัยของ TypeScript
├── vite.config.ts                # การตั้งค่าพอร์ตและโครงสร้าง Vite
└── src/
    ├── App.tsx                   # จุดรวมและสลับโครงสร้างหน้าต่างระบบ (Login vs Survey vs Admin Dashboard)
    ├── main.tsx                  # จุดเริ่มต้นการเรนเดอร์ React DOM
    ├── index.css                 # นำเข้า Tailwind CSS v4 และการผูกฟอนต์เว็บบางกอก
    ├── types.ts                  # โครงสร้างชนิดข้อมูลอินเตอร์เฟสผู้ใช้ แบบคำถาม และประเมิน
    ├── data/
    │   └── seedData.ts           # ข้อมูลดิบสำหรับประเดิมระบบ (คณะ, หลักสูตร, สาขา, แบบประเมิน 1-5 ด้าน)
    └── lib/
        ├── firebase.ts           # เชื่อมต่อ Firebase Auth & Cloud Firestore
        ├── dbUtils.ts            # ชุดบริการ CRUD ข้อคำถาม, การคำนวณสูตรสถิติวิเคราะห์ และเชื่อม API GAS
        └── translations.ts       # บันทึกพจนานุกรมการแปลข้อความสองภาษา (Thai / English)
```

---

## 🗄️ โครงสร้างข้อมูลคลังโปรแกรม (Firestore Collections Schema)

ระบบจะเตรียมสร้างระเบียนข้อมูลพื้นฐานนี้ให้โดยอัตโนมัติในครั้งแรกที่เปิดใช้งานแอปพลิเคชัน (Self-bootstrapping Seeds) ป้องกันข้อผิดพลาดฐานข้อมูลว่างเปล่า:

1. **`users`**: จัดเก็บบัญชีอาจารย์ที่เข้ามาลงทะเบียนหรือสถิติการใช้งานระบบ
2. **`settings/config`**: เก็บการตั้งค่าส่วนกลางของระบบประกันคุณภาพ เช่น ปีการศึกษาปัจจัย, สถานะ เปิด/ปิด ระบบ, และรายชื่ออีเมลผู้ดูแลระบบ (Admin Whitelist)
3. **`faculties`**: รหัสและชื่อคณะต่างๆ เช่น คณะเทคโนโลยีสารสนเทศและนวัตกรรม, คณะบริหารธุรกิจ
4. **`programs`**: รหัสและชื่อหลักสูตรที่สัมพันธ์กับคณะ (Cascade Step 1)
5. **`majors`**: รหัสสาขาวิชาที่สัมพันธ์กับหลักสูตร (Cascade Step 2)
6. **`questions`**: ชุดคำถามแบบ 5 ระดับประเมิน และคำถามเฉพาะสำหรับอาจารย์ใหม่
7. **`responses`**: บันทึกคำตอบแบบสอบถาม, ข้อมูลคณะสังกัด, คำแนะนำเปิดปลาย (Strengths, Improvements, Comments) และแสตมป์วันเวลาส่งจริง

---

## 🛡️ กฎความปลอดภัย (Firestore Security Rules)
รันและผูกไฟล์กฎความปลอดภัย `firestore.rules` ใน Firebase Console:
- **Respondent (อาจารย์ผู้ส่ง)**: อนุญาตให้อ่านและสร้างเอกสารคำตอบแบบสอบถามเฉพาะที่เป็นของตนเองเท่านั้น โดยตรวจจับจาก Token `request.auth.token.email`
- **Admin (ผู้ประกันคุณภาพ)**: สิทธิ์เข้าถึงอ่าน, ตรวจสอบ, แก้ไข และเคลียร์ข้อมูลการส่งได้ทั้งหมดหลังจากเทียบผ่านอีเมลผู้ดูแลระบบสำเร็จ

---

## 👥 คู่มือผู้เขียนระบบผู้ดูแล (Admin Setup & Whitelist)
ระบบกำหนดสิทธิ์การตรวจสอบแผงควบคุมตามรายชื่ออีเมลที่ผูกไว้ในคอลเลกชัน `settings/config` ในฟิลด์ `admins`:
- **อีเมลค่าเริ่มต้น**:
  1. `pornpun.w@bu.ac.th` (ผู้ใช้หลักสิทธิ์ผู้ตรวจระบบ)
  2. `admin1@bu.ac.th`
  3. `admin2@bu.ac.th`
- หากต้องการเพิ่มหรือเปลี่ยนแปลงรายชื่อ แอดมินหลักสามารถเปิดแผงควบคุมระบบ แท็บ **"ตั้งค่าระบบ" (Settings)** และระบุอีเมลใหม่ หรือกรอกเพิ่มตรงๆ ผ่านหน้าจัดการข้อมูล Firestore ในคอลเลกชัน `settings/config` ฟิลด์ `admins` ได้ทันที

---

## 📧 ระบบอีเมลแจ้งเตือน (Google Apps Script Setup Guide)
เพื่อไม่ให้กระทบต่อค่าบริการคลาวด์ Spark Plan (Free) ระบบได้ผูกบริการเชื่อมต่อภายนอกเข้ากับ Google Apps Script Web App ให้แอดมินรับ-ส่งอีเมลได้ทันทีเมื่ออาจารย์กดยืนยันส่งแบบประเมิน:

### ขั้นตอนติดตั้ง Google Apps Script:
1. เปิดเว็บไซต์ [script.google.com](https://script.google.com) และเข้าสู่ระบบด้วยบัญชีมหาวิทยาลัยกรุงเทพ
2. กดสร้าง **"โปรเจกต์ใหม่" (New Project)** และเขียนสคริปต์นี้ลงในหน้าจัดการโค้ด:
```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = "pornpun.w@bu.ac.th"; // เมลผู้ดูแลโครงการ
    var subject = "";
    var body = "";
    
    if (data.action === "SUBMIT_SURVEY") {
      subject = "🌟 มีผู้ส่งแบบประเมินหลักสูตรใหม่เข้ามา: " + data.email;
      body = "ปีการศึกษา: " + data.academicYear + "\n" +
             "คณะสังกัด: " + data.facultyName + "\n" +
             "หลักสูตร: " + data.programName + "\n" +
             "ประเภทผู้ตอบ: " + data.respondentType + "\n\n" +
             "ระบบได้รับการบันทึกข้อมูลเรียบร้อยแล้ว";
      
      MailApp.sendEmail(data.email, "📚 บันทึกผลสำรวจของท่านเรียบร้อยแล้ว (BU QA)", body);
      MailApp.sendEmail(recipient, subject, body);
    } else if (data.action === "CLEAR_RESPONSES") {
      subject = "⚠️ มีการล้างฐานข้อมูลประเมินผล: " + data.adminEmail;
      body = "ผู้ดำเนินการ: " + data.adminEmail + "\n" +
             "เวลาบันทึก: " + data.timestamp;
      MailApp.sendEmail(recipient, subject, body);
    } else if (data.action === "EXPORT_DATA") {
      subject = "📥 มีการส่งออกรายงานแบบประเมินหลักสูตร: " + data.adminEmail;
      body = "ผู้ดาวน์โหลด: " + data.adminEmail + "\n" +
             "ตัวกรองเงื่อนไข: " + JSON.stringify(data.filters);
      MailApp.sendEmail(recipient, subject, body);
    }
    
    return ContentService.createTextOutput("SUCCESS");
  } catch(err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}
```
3. กดปุ่ม **Deploy &gt; New Deployment**
4. ในช่อง "Select type" เลือก **"Web App"**
5. ตั้งค่าการเรียกใช้งาน:
   - **Execute as**: เลือก **"Me"** (เพื่อให้ใช้สิทธิ์บัญชีคุณในการส่งเมล)
   - **Who has access**: เลือก **"Anyone"** (จำเป็นสำหรับการส่งแบบเชื่อมโยงข้ามไซต์)
6. กด Deploy จากนั้นคัดลอก **Web App URL** ที่ได้ และนำไปกรอกลงในส่วนการตั้งค่าระบบประกันคุณภาพใน แดชบอร์ดแอดมิน เพื่อเปิดระบบแจ้งเตือนเมลจริงแบบอัตโนมัติ!

---

## 🚀 คู่มือการ Deploy ผ่าน GitHub และ Netlify

### วิธีการนำโค้ดไปติดตั้งจริง (Production Deployment Guide)

1. **สร้างคลังจัดเก็บส่วนตัว (Create GitHub Repository)**:
   - อัปโหลดไฟล์โครงการทั้งหมดขึ้นคลังจัดเก็บส่วนตัวของคุณบน GitHub
2. **ตั้งค่าแอปพริเคชันบน Netlify (Netlify Setup)**:
   - ลงทะเบียนและกดสร้างไซต์ใหม่ผ่าน **Import from git** เลือกที่เก็บประวัติโครงการ
   - Netlify จะตรวจจับแบบฟอร์มและการสร้างอัตโนมัติ (Vite App):
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
3. **ระบุตัวแปรสภาพแวดล้อม (Environment Variables)**:
   - ไม่ต้องระบุข้อมูลลับในซอร์สโค้ด ให้แอดฟอร์มตั้งค่าใน Netlify Console ภายใต้หัวข้อ **Site settings &gt; Environment variables**:
     - `GEMINI_API_KEY`: *(ใส่คีย์ API หากเปิดใช้งานฟังก์ชันการวิเคราะห์อัตโนมัติ)*
     - `APP_URL`: *(ใส่ URL โดเมนของ Netlify ที่ได้รับการแจกจ่าย)*
4. **เสร็จสิ้นการทำงาน (Auto-Deploy Enabled)**:
   - เมื่อมีโค้ดถูกอัปเดตบนสาขา `main`, Netlify จะทำการบิวด์และเผยแพร่ให้อาจารย์ใช้งานจริงได้ทันทีแบบอัตโนมัติ!
