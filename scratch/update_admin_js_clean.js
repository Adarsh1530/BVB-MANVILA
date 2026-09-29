const fs = require('fs');
const path = require('path');

const adminJsPath = 'c:\\xampp\\htdocs\\BVB MANVILA\\admin\\js\\admin.js';
let content = fs.readFileSync(adminJsPath, 'utf8');

// 1. Replace BVB_DEFAULT_SEED_DATA definition
const cleanSeedData = `const BVB_DEFAULT_SEED_DATA = {
  status: "success",
  users: [
    { id: 1, username: "superadmin", password: "superadmin123", name: "Principal / Director", role: "super admin" },
    { id: 2, username: "admin", password: "admin123", name: "Administrative Officer", role: "admin" },
    { id: 3, username: "school", password: "school123", name: "School Office Staff", role: "school" }
  ],
  popup: {
    id: 1,
    title: "",
    message: "",
    image_url: "",
    button_text: "ADMISSION INFO",
    button_url: "admissions.html",
    is_active: 0
  },
  popup_history: [],
  auto_slides: [],
  notices: [],
  ticker: [],
  mandatory_disclosures: [
    { id: 1, sl_no: "1", category_code: "A", category_name: "General Information", title: "NAME OF THE SCHOOL", details: "", file_link: "" },
    { id: 2, sl_no: "2", category_code: "A", category_name: "General Information", title: "AFFILIATION NO. (IF APPLICABLE)", details: "", file_link: "" },
    { id: 3, sl_no: "3", category_code: "A", category_name: "General Information", title: "SCHOOL CODE (IF APPLICABLE)", details: "", file_link: "" },
    { id: 4, sl_no: "4", category_code: "A", category_name: "General Information", title: "COMPLETE ADDRESS WITH PIN CODE", details: "", file_link: "" },
    { id: 5, sl_no: "5", category_code: "A", category_name: "General Information", title: "PRINCIPAL NAME & QUALIFICATION", details: "", file_link: "" },
    { id: 6, sl_no: "6", category_code: "A", category_name: "General Information", title: "SCHOOL EMAIL ID", details: "", file_link: "" },
    { id: 7, sl_no: "7", category_code: "A", category_name: "General Information", title: "CONTACT DETAILS (LANDLINE/MOBILE)", details: "", file_link: "" },
    { id: 8, sl_no: "1", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION", details: "", file_link: "" },
    { id: 9, sl_no: "2", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE", details: "", file_link: "" },
    { id: 10, sl_no: "3", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT", details: "", file_link: "" },
    { id: 11, sl_no: "4", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'S RENEWAL IF APPLICABLE", details: "", file_link: "" },
    { id: 12, sl_no: "5", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE", details: "", file_link: "" },
    { id: 13, sl_no: "6", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY", details: "", file_link: "" },
    { id: 14, sl_no: "7", category_code: "B", category_name: "Documents & Compliance", title: "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION", details: "", file_link: "" },
    { id: 15, sl_no: "8", category_code: "B", category_name: "Documents & Compliance", title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES", details: "", file_link: "" },
    { id: 16, sl_no: "11", category_code: "B", category_name: "Documents & Compliance", title: "COMPLETE MANDATORY DISCLOSURE (CBSE SARAS 5.0)", details: "", file_link: "" },
    { id: 17, sl_no: "1", category_code: "C", category_name: "Result & Academics", title: "FEE STRUCTURE OF THE SCHOOL", details: "", file_link: "" },
    { id: 18, sl_no: "2", category_code: "C", category_name: "Result & Academics", title: "ANNUAL ACADEMIC CALENDER", details: "", file_link: "" }
  ],
  image_packages: []
};`;

content = content.replace(/const BVB_DEFAULT_SEED_DATA = \{[\s\S]*?\n\};/, cleanSeedData);

// 2. Fix isValidData function in loadData
const oldIsValidData = `const isValidData = (d) => {
      return d && typeof d === 'object' && (
        (Array.isArray(d.notices) && d.notices.length > 0) ||
        (Array.isArray(d.mandatory_disclosures) && d.mandatory_disclosures.length > 0) ||
        (Array.isArray(d.image_packages) && d.image_packages.length > 0)
      );
    };`;

const newIsValidData = `const isValidData = (d) => {
      return d && typeof d === 'object' && Array.isArray(d.mandatory_disclosures);
    };`;

content = content.replace(oldIsValidData, newIsValidData);

// 3. Fix auto-fallback assignment in loadData
const oldFallbackAssign = `    if (!this.siteData.notices || this.siteData.notices.length === 0) this.siteData.notices = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.notices));
    if (!this.siteData.mandatory_disclosures || this.siteData.mandatory_disclosures.length === 0) this.siteData.mandatory_disclosures = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.mandatory_disclosures));
    if (!this.siteData.image_packages || this.siteData.image_packages.length === 0) this.siteData.image_packages = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.image_packages));
    if (!this.siteData.auto_slides || this.siteData.auto_slides.length === 0) this.siteData.auto_slides = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.auto_slides));`;

const newFallbackAssign = `    if (!this.siteData.notices) this.siteData.notices = [];
    if (!this.siteData.mandatory_disclosures) this.siteData.mandatory_disclosures = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.mandatory_disclosures));
    if (!this.siteData.image_packages) this.siteData.image_packages = [];
    if (!this.siteData.auto_slides) this.siteData.auto_slides = [];`;

content = content.replace(oldFallbackAssign, newFallbackAssign);

fs.writeFileSync(adminJsPath, content, 'utf8');
console.log('✅ Updated admin/js/admin.js with clean seed data and empty state array handlers');
