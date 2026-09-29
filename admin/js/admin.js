const BVB_DEFAULT_SEED_DATA = {
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
};

class AdminApp {
  constructor() {
    this.siteData = null;
    this.currentUser = null;
    this.currentDisclosureFilter = 'ALL';
    this.init();
  }

  getAdminPath(file) {
    const pathname = window.location.pathname;
    if (pathname.includes('/admin/')) {
      return pathname.substring(0, pathname.indexOf('/admin/') + 7) + file;
    } else if (pathname.endsWith('/admin')) {
      return pathname + '/' + file;
    }
    return file;
  }

  async init() {
    try {
      // 1. Check Authentication State
      this.currentUser = JSON.parse(sessionStorage.getItem('bvb_active_user') || localStorage.getItem('bvb_active_user') || 'null');

      const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('login');

      if (!this.currentUser && !isLoginPage) {
        window.location.href = this.getAdminPath('login.html');
        return;
      }

      if (this.currentUser && isLoginPage) {
        window.location.href = this.getAdminPath('index.html');
        return;
      }

      // 2. Bind event listeners IMMEDIATELY so buttons and forms respond without network delay
      if (!isLoginPage) {
        this.setupDashboardUI();
        this.bindEvents();
      } else {
        this.bindLoginEvents();
      }

      // 3. Load Site Data State
      await this.loadData();

      // 4. Render UI Tables
      if (!isLoginPage) {
        this.renderAll();
      }
    } catch (err) {
      console.error('AdminApp initialization notice:', err);
    }
  }

  async loadData() {
    let data = null;

    const isValidData = (d) => {
      return d && typeof d === 'object' && Array.isArray(d.mandatory_disclosures);
    };

    // 1. Try fetching live PHP API endpoints first (relative and root)
    try {
      let res = await fetch('../api/get_site_data.php?t=' + Date.now()).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('api/get_site_data.php?t=' + Date.now()).catch(() => null);
      }
      if (!res || !res.ok) {
        res = await fetch('/api/get_site_data.php?t=' + Date.now()).catch(() => null);
      }
      if (res && res.ok) {
        const json = await res.json();
        if (isValidData(json)) {
          data = json;
        }
      }
    } catch (e) {
      console.log('PHP API fetch notice:', e);
    }

    // 2. Try fetching static JSON endpoint (relative and root)
    if (!data) {
      try {
        let res = await fetch('../api/get_site_data.json?t=' + Date.now()).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('api/get_site_data.json?t=' + Date.now()).catch(() => null);
        }
        if (!res || !res.ok) {
          res = await fetch('/api/get_site_data.json?t=' + Date.now()).catch(() => null);
        }
        if (res && res.ok) {
          const json = await res.json();
          if (isValidData(json)) {
            data = json;
          }
        }
      } catch (e) {
        console.log('JSON fetch notice:', e);
      }
    }

    // 3. Check LocalStorage fallback only if live server data was not retrieved
    if (!data) {
      const existingLocal = localStorage.getItem('bvb_site_data');
      if (existingLocal) {
        try {
          const parsedLocal = JSON.parse(existingLocal);
          if (isValidData(parsedLocal)) {
            data = parsedLocal;
          }
        } catch (e) {
          console.error('Local state parse error:', e);
        }
      }
    }

    // 4. Fallback to hardcoded default seed data if no valid data is available
    if (!isValidData(data)) {
      localStorage.removeItem('bvb_site_data');
      data = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA));
    }

    this.siteData = data;
    if (!this.siteData.notices) this.siteData.notices = [];
    if (!this.siteData.mandatory_disclosures) this.siteData.mandatory_disclosures = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.mandatory_disclosures));
    if (!this.siteData.image_packages) this.siteData.image_packages = [];
    if (!this.siteData.auto_slides) this.siteData.auto_slides = [];
    if (!this.siteData.users || this.siteData.users.length === 0) this.siteData.users = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.users));
    if (!this.siteData.popup) this.siteData.popup = JSON.parse(JSON.stringify(BVB_DEFAULT_SEED_DATA.popup));

    // Auto-fix any stale broken image paths in site data
    const fixBrokenPath = (str) => {
      if (!str || typeof str !== 'string') return str;
      return str
        .replace(/investiture-3\.jpg/g, 'investiture-oath.jpg')
        .replace(/investiture-4\.jpg/g, 'cultural-fest.jpg')
        .replace(/sports-day-1\.jpg/g, 'school-parliament.jpg')
        .replace(/annual-day-1\.jpg/g, 'adharva-fest.jpg');
    };

    if (this.siteData.auto_slides) {
      this.siteData.auto_slides.forEach(s => { if (s) s.image_url = fixBrokenPath(s.image_url); });
    }
    if (this.siteData.image_packages) {
      this.siteData.image_packages.forEach(p => {
        if (p) {
          p.main_image = fixBrokenPath(p.main_image);
          if (Array.isArray(p.sub_images)) {
            p.sub_images = p.sub_images.map(fixBrokenPath);
          }
        }
      });
    }

    localStorage.setItem('bvb_site_data', JSON.stringify(this.siteData));
  }

  saveData(message = 'Changes saved successfully!') {
    localStorage.setItem('bvb_site_data', JSON.stringify(this.siteData));
    
    // Synchronize to MySQL API endpoint
    const payload = JSON.stringify({ action: 'sync_data', data: this.siteData });
    fetch('../api/admin_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    }).catch(() => {
      fetch('/api/admin_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(e => console.log('PHP MySQL sync notice:', e));
    });

    this.showToast(message, 'success');
    this.renderAll();
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION & LOGIN LOGIC
  // --------------------------------------------------------------------------
    bindLoginEvents() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const roleSelect = document.getElementById('loginRoleSelect');

      if (!usernameInput || !passwordInput) return;

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const role = roleSelect ? roleSelect.value : 'super admin';

      const defaultUsers = [
        { id: 1, username: "superadmin", password: "superadmin123", name: "Principal / Director", role: "super admin" },
        { id: 2, username: "admin", password: "admin123", name: "Administrative Officer", role: "admin" },
        { id: 3, username: "school", password: "school123", name: "School Office Staff", role: "school" }
      ];

      const loadedUsers = (this.siteData && Array.isArray(this.siteData.users)) ? this.siteData.users : [];
      const allUsers = [...defaultUsers, ...loadedUsers];

      const matchedUser = allUsers.find(u => 
        u.username && u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      const alertBox = document.getElementById('loginAlert');

      if (matchedUser) {
        const userToSave = {
          id: matchedUser.id || Date.now(),
          username: matchedUser.username,
          name: matchedUser.name || username.toUpperCase(),
          role: role || matchedUser.role || 'super admin'
        };

        sessionStorage.setItem('bvb_active_user', JSON.stringify(userToSave));
        localStorage.setItem('bvb_active_user', JSON.stringify(userToSave));

        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.backgroundColor = '#D1FAE5';
          alertBox.style.color = '#065F46';
          alertBox.textContent = '✅ Login successful! Redirecting to Control Center...';
        }

        setTimeout(() => {
          window.location.href = this.getAdminPath('index.html');
        }, 400);
      } else {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.backgroundColor = '#FEE2E2';
          alertBox.style.color = '#991B1B';
          alertBox.textContent = '❌ Invalid username or password. Please enter valid administrative credentials.';
        }
      }
    });
  }

  logout() {
    sessionStorage.removeItem('bvb_active_user');
    localStorage.removeItem('bvb_active_user');
    window.location.href = this.getAdminPath('login.html');
  }

  // --------------------------------------------------------------------------
  // DASHBOARD UI SETUP & PRIVILEGE CHECKS
  // --------------------------------------------------------------------------
  setupDashboardUI() {
    if (!this.currentUser) {
      window.location.href = this.getAdminPath('login.html');
      return;
    }

    const userNameEl = document.getElementById('sidebarUserName');
    const userRoleEl = document.getElementById('sidebarUserRole');

    if (userNameEl) userNameEl.textContent = this.currentUser.name || this.currentUser.username;
    if (userRoleEl) {
      userRoleEl.textContent = (this.currentUser.role || 'SCHOOL').toUpperCase();
    }

    // Role-based Access Control (RBAC) UI Hiding
    const userRole = (this.currentUser && this.currentUser.role ? this.currentUser.role : 'super admin').toLowerCase();
    const superAdminOnlyElements = document.querySelectorAll('.super-admin-only');

    superAdminOnlyElements.forEach(el => {
      if (userRole === 'super admin') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }

  bindEvents() {
    // Tab Navigation
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const tab = link.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    // Sidebar Mobile Toggle
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('adminSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // Form Submissions
    const popupForm = document.getElementById('popupConfigForm');
    if (popupForm) {
      popupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.savePopupConfig();
      });
    }

    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
      noticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNotice();
      });
    }

    const disclosureForm = document.getElementById('disclosureForm');
    if (disclosureForm) {
      disclosureForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveDisclosure();
      });
    }

    const imagePkgForm = document.getElementById('imagePackageForm');
    if (imagePkgForm) {
      imagePkgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveImagePackage();
      });
    }

    const slideForm = document.getElementById('slideForm');
    if (slideForm) {
      slideForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSlide();
      });
    }

    const slideBatchForm = document.getElementById('slideBatchForm');
    if (slideBatchForm) {
      slideBatchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.save5Slides();
      });
    }

    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveUser();
      });
    }

    // File Explorer Pickers (HTML5 FileReader API & Categorized cPanel File Uploads)
    const setupFilePicker = (inputId, targetTextId, previewImgId, previewWrapId, viewFullBtnId, category = 'general') => {
      const fileInput = document.getElementById(inputId);
      const textInput = document.getElementById(targetTextId);
      const previewImg = document.getElementById(previewImgId);
      const previewWrap = previewWrapId ? document.getElementById(previewWrapId) : null;
      const viewFullBtn = viewFullBtnId ? document.getElementById(viewFullBtnId) : null;

      if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) {
            if (!this.validateImageFile(file)) {
              fileInput.value = '';
              return;
            }
            const reader = new FileReader();
            reader.onload = async (evt) => {
              if (textInput) textInput.value = evt.target.result;
              if (previewImg) {
                previewImg.src = evt.target.result;
                previewImg.style.display = 'block';
              }
              if (viewFullBtn) {
                viewFullBtn.href = evt.target.result;
                viewFullBtn.style.display = 'inline-flex';
              }
              if (previewWrap) previewWrap.style.display = 'block';

              const fileUrl = await this.uploadFileApi(file, category);
              if (fileUrl && textInput) {
                textInput.value = fileUrl;
                if (viewFullBtn) viewFullBtn.href = this.formatImgSrc(fileUrl);
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };

    setupFilePicker('mainFileInput', 'mainImageUrl', 'mainImagePreview', 'mainPreviewWrap', 'mainViewFullBtn', 'gallery');
    setupFilePicker('popupFileInput', 'popupImageUrlInput', 'popupImagePreview', 'popupPreviewWrap', 'popupViewFullBtn', 'popup');
    setupFilePicker('slideFileInput', 'slideImageUrl', 'slideImagePreview', 'slidePreviewWrap', 'slideViewFullBtn', 'auto_slides');

    // Batch 5 Auto Slides Multi-File Picker Listener
    const batch5Picker = document.getElementById('batch5FilesPicker');
    if (batch5Picker) {
      batch5Picker.addEventListener('change', (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        if (files.length === 0) return;

        files.forEach((file, index) => {
          const slotIdx = index + 1;
          if (!this.validateImageFile(file)) return;

          const reader = new FileReader();
          reader.onload = (evt) => {
            const urlInput = document.getElementById(`batchImgUrl${slotIdx}`);
            const prevWrap = document.getElementById(`batchPrevWrap${slotIdx}`);
            const prevImg = document.getElementById(`batchPrev${slotIdx}`);

            if (urlInput) urlInput.value = evt.target.result;
            if (prevImg) prevImg.src = evt.target.result;
            if (prevWrap) prevWrap.style.display = 'block';
          };
          reader.readAsDataURL(file);
        });
      });
    }

    // Individual Batch Slide File Pickers (Slots 1 to 5)
    document.querySelectorAll('.batch-slide-file').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-idx');
        const file = e.target.files[0];
        if (file && idx) {
          if (!this.validateImageFile(file)) {
            e.target.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (evt) => {
            const urlInput = document.getElementById(`batchImgUrl${idx}`);
            const prevWrap = document.getElementById(`batchPrevWrap${idx}`);
            const prevImg = document.getElementById(`batchPrev${idx}`);

            if (urlInput) urlInput.value = evt.target.result;
            if (prevImg) prevImg.src = evt.target.result;
            if (prevWrap) prevWrap.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Sub-Images Individual File Pickers (Slots 1 to 10 in Image Package Modal)
    document.querySelectorAll('.sub-file-picker').forEach(picker => {
      picker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const targetId = picker.getAttribute('data-target');
        const prevId = picker.getAttribute('data-preview');
        const viewBtnId = picker.getAttribute('data-viewbtn');

        if (file && targetId) {
          if (!this.validateImageFile(file)) {
            picker.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (evt) => {
            const hiddenInput = document.getElementById(targetId);
            const prevImg = document.getElementById(prevId);
            const viewBtn = document.getElementById(viewBtnId);

            if (hiddenInput) hiddenInput.value = evt.target.result;
            if (prevImg) {
              prevImg.src = evt.target.result;
              prevImg.style.display = 'block';
            }
            if (viewBtn) {
              viewBtn.href = evt.target.result;
              viewBtn.style.display = 'inline-flex';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Disclosure PDF / JPEG File Picker (PDF or JPEG format under 1 MB limit)
    const discFilePicker = document.getElementById('disclosureFileInput');
    if (discFilePicker) {
      discFilePicker.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const maxSize = 1048576; // 1 MB limit
          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
          const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

          if (!isPdf && !isJpeg) {
            alert('⚠️ Invalid file format! Only PDF (.pdf) and JPEG (.jpg, .jpeg) document files are allowed for Mandatory Disclosures.');
            this.showToast('Only PDF and JPEG files are allowed.', 'error');
            discFilePicker.value = '';
            return;
          }

          if (file.size > maxSize) {
            alert('⚠️ File size exceeds 1 MB limit! Please choose a smaller document file (under 1 MB).');
            this.showToast('Document file size exceeds 1 MB limit!', 'error');
            discFilePicker.value = '';
            return;
          }

          const reader = new FileReader();
          reader.onload = async (evt) => {
            const linkInput = document.getElementById('disclosureFileLink');
            if (linkInput) linkInput.value = evt.target.result;

            const fileUrl = await this.uploadFileApi(file, 'mandatory_disclosures');
            if (fileUrl && linkInput) linkInput.value = fileUrl;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  async uploadFileApi(file, category = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      let res = await fetch('../api/upload_api.php', {
        method: 'POST',
        body: formData
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('api/upload_api.php', {
          method: 'POST',
          body: formData
        }).catch(() => null);
      }

      if (res && res.ok) {
        const json = await res.json();
        if (json && json.status === 'success' && json.file_url) {
          return json.file_url;
        }
      }
    } catch (e) {
      console.error('File upload API notice:', e);
    }
    return null;
  }

  validateImageFile(file) {
    if (!file) return false;
    const maxSize = 1048576; // 1 MB limit
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

    if (!isJpeg) {
      alert('⚠️ Invalid image format! Only JPEG (.jpg, .jpeg) images are allowed.');
      this.showToast('Only JPEG (.jpg, .jpeg) images are allowed.', 'error');
      return false;
    }

    if (file.size > maxSize) {
      alert('⚠️ File size exceeds 1 MB limit! Please choose a smaller JPEG image.');
      this.showToast('Image size exceeds 1 MB limit!', 'error');
      return false;
    }

    return true;
  }

  formatImgSrc(url) {
    if (!url || typeof url !== 'string' || !url.trim()) return '../assets/images/bvb-manvila-logo.png';
    const trimmed = url.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('../')) return trimmed;
    if (trimmed.startsWith('./')) return '../' + trimmed.substring(2);
    if (trimmed.startsWith('/')) return '..' + trimmed;
    return '../' + trimmed;
  }

  switchTab(tabName) {
    const userRole = (this.currentUser.role || 'school').toLowerCase();
    
    // RBAC: Block non-super admin users from accessing user management tab
    if (tabName === 'users' && userRole !== 'super admin') {
      this.showToast('Access Denied: User Management is restricted to Super Admin.', 'error');
      alert('⚠️ Access Denied: User Management module is restricted to Super Admin privilege level.');
      return;
    }

    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabName}"]`);
    const activePanel = document.getElementById(`tab-${tabName}`);
    const pageTitle = document.getElementById('currentTabTitle');

    if (activeLink) activeLink.classList.add('active');
    if (activePanel) activePanel.classList.add('active');

    const titles = {
      overview: 'Dashboard Overview',
      notices: 'Latest Notice Updation Section',
      popup: 'Entrance Announcement Popup Image Updation',
      disclosure: 'Mandatory Disclosure Updation Section (CBSE SARAS 5.0)',
      images: 'Image Upload Section (1 Main + 10 Sub Images & Target Checkboxes)',
      slides: 'Education Rooted in Values - Auto Slides Management',
      users: 'Multi-Role User Creation & Privileges'
    };
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) sidebar.classList.remove('open');
  }

  renderAll() {
    this.renderStats();
    this.renderNoticesTable();
    this.renderPopupForm();
    this.renderPopupHistoryTable();
    this.renderDisclosuresTable();
    this.renderImagePackagesTable();
    this.renderSlidesTable();
    this.renderUsersTable();
  }

  // --------------------------------------------------------------------------
  // 1. STATS OVERVIEW RENDER
  // --------------------------------------------------------------------------
  renderStats() {
    if (!this.siteData) return;

    const noticeCount = (this.siteData.notices || []).length;
    const popupStatus = this.siteData.popup && this.siteData.popup.is_active == 1 ? 'ACTIVE' : 'DISABLED';
    const disclosureCount = (this.siteData.mandatory_disclosures || []).length;
    const pkgCount = (this.siteData.image_packages || []).length;

    const el1 = document.getElementById('statNoticeCount');
    const el2 = document.getElementById('statPopupStatus');
    const el3 = document.getElementById('statDisclosureCount');
    const el4 = document.getElementById('statPackageCount');

    if (el1) el1.textContent = noticeCount;
    if (el2) {
      el2.textContent = popupStatus;
      el2.style.color = popupStatus === 'ACTIVE' ? '#10B981' : '#EF4444';
    }
    if (el3) el3.textContent = disclosureCount;
    if (el4) el4.textContent = pkgCount;
  }

  // --------------------------------------------------------------------------
  // 2. LATEST NOTICES SECTION
  // --------------------------------------------------------------------------
  renderNoticesTable() {
    const tbody = document.getElementById('noticesTableBody');
    if (!tbody || !this.siteData) return;

    const notices = this.siteData.notices || [];

    if (notices.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">No notices found. Click "+ Add New Notice" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = notices.map(n => `
      <tr>
        <td><strong>${this.escapeHtml(n.notice_date)}</strong></td>
        <td><span class="role-badge-preview badge-admin">${this.escapeHtml(n.category || 'General')}</span></td>
        <td style="font-weight: 600;">${this.escapeHtml(n.title)}</td>
        <td>${n.pdf_link ? `<a href="${this.formatImgSrc(n.pdf_link)}" target="_blank" style="color: var(--color-primary); font-weight: 600;">View PDF</a>` : '<span style="color: #94A3B8;">None</span>'}</td>
        <td>${n.is_ticker == 1 ? '<span class="role-badge-preview badge-school">Ticker Active</span>' : '<span style="color: #94A3B8;">Off</span>'}</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-sm btn-action-edit" onclick="adminApp.editNotice(${n.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deleteNotice(${n.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openNoticeModal(id = null) {
    const modal = document.getElementById('noticeModal');
    const titleEl = document.getElementById('noticeModalTitle');
    const form = document.getElementById('noticeForm');

    form.reset();
    document.getElementById('noticeId').value = '';

    if (id) {
      titleEl.textContent = 'Edit Notice';
      const n = (this.siteData.notices || []).find(item => item.id === id);
      if (n) {
        document.getElementById('noticeId').value = n.id;
        document.getElementById('noticeTitle').value = n.title;
        document.getElementById('noticeContent').value = n.content || '';
        document.getElementById('noticeCategory').value = n.category || 'General';
        document.getElementById('noticeDate').value = n.notice_date || '';
        document.getElementById('noticePdfLink').value = n.pdf_link || '';
        document.getElementById('noticeIsTicker').checked = n.is_ticker == 1;
      }
    } else {
      titleEl.textContent = 'Add New Notice';
      document.getElementById('noticeDate').value = new Date().toISOString().split('T')[0];
      document.getElementById('noticeIsTicker').checked = true;
    }

    modal.classList.add('active');
  }

  closeNoticeModal() {
    document.getElementById('noticeModal').classList.remove('active');
  }

  saveNotice() {
    const id = document.getElementById('noticeId').value;
    const title = document.getElementById('noticeTitle').value.trim();
    const content = document.getElementById('noticeContent').value.trim();
    const category = document.getElementById('noticeCategory').value;
    const notice_date = document.getElementById('noticeDate').value;
    const pdf_link = document.getElementById('noticePdfLink').value.trim();
    const is_ticker = document.getElementById('noticeIsTicker').checked ? 1 : 0;

    this.confirmAction({
      title: 'Confirm Notice Save',
      heading: id ? 'Update Notice?' : 'Publish New Notice?',
      message: 'Are you sure you want to save and publish this notice to the website?',
      icon: '📌',
      isDanger: false,
      onConfirm: () => {
        if (!this.siteData.notices) this.siteData.notices = [];

        if (id) {
          const idx = this.siteData.notices.findIndex(n => n.id == id);
          if (idx !== -1) {
            this.siteData.notices[idx] = { id: parseInt(id), title, content, category, notice_date, pdf_link, is_ticker };
          }
        } else {
          const newNotice = {
            id: Date.now(),
            title, content, category, notice_date, pdf_link, is_ticker
          };
          this.siteData.notices.unshift(newNotice);
        }

        this.siteData.ticker = this.siteData.notices.filter(n => n.is_ticker == 1);
        this.closeNoticeModal();
        this.saveData('Notice updated successfully!');
        this.verifySuccess({
          title: 'Notice Saved & Published!',
          message: 'The notice has been updated in system records and published on the website.'
        });
      }
    });
  }

  editNotice(id) {
    this.openNoticeModal(id);
  }

  deleteNotice(id) {
    this.confirmAction({
      title: 'Confirm Notice Deletion',
      heading: 'Delete Notice?',
      message: 'Are you sure you want to permanently delete this notice from the site?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.notices = (this.siteData.notices || []).filter(n => n.id !== id);
        this.siteData.ticker = this.siteData.notices.filter(n => n.is_ticker == 1);
        this.saveData('Notice deleted successfully.');
        this.verifySuccess({
          title: 'Notice Deleted!',
          message: 'The notice was permanently deleted from system records.'
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. ENTRANCE POPUP SECTION & LOG HISTORY
  // --------------------------------------------------------------------------
  renderPopupForm() {
    if (!this.siteData || !this.siteData.popup) return;
    const p = this.siteData.popup;

    const elActive = document.getElementById('popupActiveSelect');
    const elTitle = document.getElementById('popupTitleInput');
    const elMessage = document.getElementById('popupMessageInput');
    const elImg = document.getElementById('popupImageUrlInput');

    if (elActive) elActive.value = (p.is_active !== undefined && p.is_active !== null) ? p.is_active : 0;
    if (elTitle) elTitle.value = p.title || '';
    if (elMessage) elMessage.value = p.message || '';
    if (elImg) elImg.value = p.image_url || '';

    const popupPrevWrap = document.getElementById('popupPreviewWrap');
    const popupPrevImg = document.getElementById('popupImagePreview');
    const popupFullBtn = document.getElementById('popupViewFullBtn');

    if (p.image_url && popupPrevImg && popupPrevWrap) {
      const src = this.formatImgSrc(p.image_url);
      popupPrevImg.src = src;
      if (popupFullBtn) popupFullBtn.href = src;
      popupPrevWrap.style.display = 'block';
    } else if (popupPrevWrap) {
      popupPrevWrap.style.display = 'none';
    }
  }

  removeActivePopupImage() {
    this.confirmAction({
      title: 'Confirm Remove Image',
      heading: 'Remove Entrance Popup Image?',
      message: 'Are you sure you want to remove the current popup announcement image? This will disable the entrance popup modal on the website.',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        const elImg = document.getElementById('popupImageUrlInput');
        if (elImg) elImg.value = '';

        const popupFileInput = document.getElementById('popupFileInput');
        if (popupFileInput) popupFileInput.value = '';

        const popupActiveSelect = document.getElementById('popupActiveSelect');
        if (popupActiveSelect) popupActiveSelect.value = '0';

        const popupPrevWrap = document.getElementById('popupPreviewWrap');
        if (popupPrevWrap) popupPrevWrap.style.display = 'none';

        this.siteData.popup = {
          id: Date.now(),
          is_active: 0,
          title: document.getElementById('popupTitleInput') ? document.getElementById('popupTitleInput').value.trim() : '',
          message: document.getElementById('popupMessageInput') ? document.getElementById('popupMessageInput').value.trim() : '',
          image_url: '',
          button_text: '',
          button_url: ''
        };

        this.saveData('Popup image removed and modal disabled.');
        this.renderPopupForm();
        this.renderPopupHistoryTable();
        this.showToast('Popup image removed and disabled.', 'success');
      }
    });
  }

  savePopupConfig() {
    this.confirmAction({
      title: 'Confirm Entrance Popup Save',
      heading: 'Save Popup Announcement Settings?',
      message: 'Are you sure you want to update the homepage entrance popup configuration and history log?',
      icon: '🔔',
      isDanger: false,
      onConfirm: () => {
        const btnTextEl = document.getElementById('popupButtonTextInput');
        const btnUrlEl = document.getElementById('popupButtonUrlInput');
        const imageUrl = document.getElementById('popupImageUrlInput').value.trim();
        const isActiveSelect = parseInt(document.getElementById('popupActiveSelect').value);
        const isActive = imageUrl === '' ? 0 : isActiveSelect;

        const newPopup = {
          id: Date.now(),
          is_active: isActive,
          title: document.getElementById('popupTitleInput').value.trim(),
          message: document.getElementById('popupMessageInput').value.trim(),
          image_url: imageUrl,
          button_text: btnTextEl ? btnTextEl.value.trim() : '',
          button_url: btnUrlEl ? btnUrlEl.value.trim() : '',
          created_at: new Date().toISOString().replace('T', ' ').split('.')[0]
        };

        this.siteData.popup = newPopup;

        if (imageUrl !== '') {
          if (!this.siteData.popup_history) this.siteData.popup_history = [];
          this.siteData.popup_history.unshift(newPopup);
        }

        this.saveData('Entrance Popup settings saved!');
        this.renderPopupForm();
        this.renderPopupHistoryTable();
        this.verifySuccess({
          title: 'Entrance Popup Updated!',
          message: 'The entrance announcement popup modal settings have been updated.'
        });
      }
    });
  }

  renderPopupHistoryTable() {
    const tbody = document.getElementById('popupHistoryTableBody');
    if (!tbody || !this.siteData) return;

    const history = this.siteData.popup_history || [];

    if (history.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-secondary); padding: 1.5rem;">No popup history logs found yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = history.map(item => `
      <tr>
        <td>
          <img src="${this.formatImgSrc(item.image_url)}" onerror="this.onerror=null; this.src='../assets/images/bvb-manvila-logo.png';" alt="Popup" style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border);">
        </td>
        <td><strong style="color: var(--color-deep-blue);">${this.escapeHtml(item.title)}</strong></td>
        <td style="font-size: 0.8125rem; color: var(--color-text-secondary); max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(item.message)}</td>
        <td>
          ${item.is_active == 1 ? '<span class="role-badge-preview badge-school">ACTIVE</span>' : '<span class="role-badge-preview badge-super-admin" style="background: #FEE2E2; color: #991B1B;">INACTIVE</span>'}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-sm btn-action-edit" onclick="adminApp.togglePopupHistoryStatus(${item.id})">${item.is_active == 1 ? 'Disable' : 'Enable'}</button>
            <button class="btn-sm btn-action-edit" onclick="adminApp.editPopupHistory(${item.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deletePopupHistory(${item.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  togglePopupHistoryStatus(id) {
    const item = (this.siteData.popup_history || []).find(p => p.id === id);
    if (!item) return;
    item.is_active = item.is_active == 1 ? 0 : 1;

    if (item.is_active == 1) {
      this.siteData.popup = item;
    } else if (this.siteData.popup && (this.siteData.popup.id === id || this.siteData.popup.image_url === item.image_url)) {
      this.siteData.popup.is_active = 0;
    }

    this.saveData('Popup status updated.');
    this.renderPopupForm();
    this.renderPopupHistoryTable();
  }

  editPopupHistory(id) {
    const item = (this.siteData.popup_history || []).find(p => p.id === id);
    if (!item) return;
    this.siteData.popup = item;
    this.renderPopupForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToast('Popup settings loaded into form.', 'success');
  }

  deletePopupHistory(id) {
    const deletedItem = (this.siteData.popup_history || []).find(p => p.id === id);
    this.confirmAction({
      title: 'Confirm Popup Log Deletion',
      heading: 'Delete Popup Log Entry?',
      message: 'Are you sure you want to delete this popup announcement log entry?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.popup_history = (this.siteData.popup_history || []).filter(p => p.id !== id);

        if (this.siteData.popup && (this.siteData.popup.id === id || (deletedItem && this.siteData.popup.image_url === deletedItem.image_url))) {
          this.siteData.popup = {
            id: Date.now(),
            is_active: 0,
            title: '',
            message: '',
            image_url: '',
            button_text: '',
            button_url: ''
          };
          this.renderPopupForm();
        }

        this.saveData('Popup log entry deleted.');
        this.renderPopupHistoryTable();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. MANDATORY DISCLOSURE SECTION (SARAS Categories A, B, C, D, E)
  // --------------------------------------------------------------------------

  filterDisclosures(secCode) {
    this.currentDisclosureFilter = secCode;
    const btns = document.querySelectorAll('.disclosure-filter-btn');
    btns.forEach(btn => {
      if (btn.getAttribute('data-sec') === secCode) {
        btn.classList.add('active');
        btn.style.backgroundColor = 'var(--color-primary)';
        btn.style.color = '#ffffff';
      } else {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }
    });
    this.renderDisclosuresTable();
  }

  renderDisclosuresTable() {
    const tbody = document.getElementById('disclosuresTableBody');
    if (!tbody || !this.siteData) return;

    let docs = this.siteData.mandatory_disclosures || [];

    if (this.currentDisclosureFilter && this.currentDisclosureFilter !== 'ALL') {
      docs = docs.filter(d => (d.category_code || 'B') === this.currentDisclosureFilter);
    }

    if (docs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">No disclosures found for Section ${this.currentDisclosureFilter}. Click "+ Add Mandatory Document" to add one.</td></tr>`;
      return;
    }

    const catBadgeClass = {
      'A': 'badge-admin',
      'B': 'badge-super-admin',
      'C': 'badge-school',
      'D': 'badge-admin',
      'E': 'badge-super-admin'
    };

    tbody.innerHTML = docs.map(d => {
      const secCode = d.category_code || 'B';
      const badgeClass = catBadgeClass[secCode] || 'badge-super-admin';
      const fileUrl = this.formatImgSrc(d.file_link);
      const hasFile = d.file_link && d.file_link.trim() !== '';

      return `
      <tr>
        <td><strong>${this.escapeHtml(d.sl_no)}</strong></td>
        <td><span class="role-badge-preview ${badgeClass}">Section ${secCode}: ${this.escapeHtml(d.category_name || 'Disclosure')}</span></td>
        <td style="font-weight: 600; color: var(--color-deep-blue);">${this.escapeHtml(d.title)}</td>
        <td style="font-size: 0.8125rem; color: var(--color-text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${this.escapeHtml(d.details || '-')}</td>
        <td>
          ${hasFile ? `
            <a href="${fileUrl}" target="_blank" class="btn-sm btn-action-edit" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; background: var(--color-ultra-light-blue); color: var(--color-primary); border: 1px solid var(--color-border); font-weight: 600;">
              👁️ View Document
            </a>
          ` : '<span style="color: #94A3B8; font-size: 0.8125rem;">Text Record</span>'}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-sm btn-action-edit" onclick="adminApp.editDisclosure(${d.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deleteDisclosure(${d.id})">Delete</button>
          </div>
        </td>
      </tr>
    `;
    }).join('');
  }

  openDisclosureModal(id = null) {
    const modal = document.getElementById('disclosureModal');
    const titleEl = document.getElementById('disclosureModalTitle');
    const form = document.getElementById('disclosureForm');

    form.reset();
    document.getElementById('disclosureId').value = '';

    if (id) {
      titleEl.textContent = 'Edit Mandatory Document';
      const d = (this.siteData.mandatory_disclosures || []).find(item => item.id === id);
      if (d) {
        document.getElementById('disclosureId').value = d.id;
        document.getElementById('disclosureSlNo').value = d.sl_no || '1';
        document.getElementById('disclosureCategoryCode').value = d.category_code || 'B';
        document.getElementById('disclosureTitle').value = d.title || '';
        document.getElementById('disclosureDetails').value = d.details || '';
        document.getElementById('disclosureFileLink').value = d.file_link || '';
      }
    } else {
      titleEl.textContent = 'Add Mandatory Document';
    }

    modal.classList.add('active');
  }

  closeDisclosureModal() {
    document.getElementById('disclosureModal').classList.remove('active');
  }

  saveDisclosure() {
    const id = document.getElementById('disclosureId').value;
    const sl_no = document.getElementById('disclosureSlNo').value.trim();
    const category_code = document.getElementById('disclosureCategoryCode').value;
    const title = document.getElementById('disclosureTitle').value.trim();
    const details = document.getElementById('disclosureDetails').value.trim();
    const file_link = document.getElementById('disclosureFileLink').value.trim();

    const catMap = {
      'A': 'General Information',
      'B': 'Documents & Compliance',
      'C': 'Result & Academics',
      'D': 'Staff & Teaching',
      'E': 'School Infrastructure'
    };
    const category_name = catMap[category_code] || 'Documents & Compliance';

    this.confirmAction({
      title: 'Confirm Mandatory Document Save',
      heading: id ? 'Update Mandatory Document?' : 'Add Mandatory Document?',
      message: 'Are you sure you want to save this CBSE SARAS 5.0 disclosure record?',
      icon: '📑',
      isDanger: false,
      onConfirm: () => {
        if (!this.siteData.mandatory_disclosures) this.siteData.mandatory_disclosures = [];

        if (id) {
          const idx = this.siteData.mandatory_disclosures.findIndex(d => d.id == id);
          if (idx !== -1) {
            this.siteData.mandatory_disclosures[idx] = { id: parseInt(id), sl_no, category_code, category_name, title, details, file_link };
          }
        } else {
          const newDoc = {
            id: Date.now(),
            sl_no, category_code, category_name, title, details, file_link
          };
          this.siteData.mandatory_disclosures.push(newDoc);
        }

        this.closeDisclosureModal();
        this.saveData('Mandatory disclosure document saved!');
        this.verifySuccess({
          title: 'Document Saved & Verified!',
          message: 'The mandatory disclosure document has been updated in CBSE compliance section.'
        });
      }
    });
  }

  editDisclosure(id) {
    this.openDisclosureModal(id);
  }

  deleteDisclosure(id) {
    this.confirmAction({
      title: 'Confirm Document Deletion',
      heading: 'Delete Mandatory Document?',
      message: 'Are you sure you want to delete this mandatory disclosure document?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.mandatory_disclosures = (this.siteData.mandatory_disclosures || []).filter(d => d.id !== id);
        this.saveData('Document deleted.');
        this.verifySuccess({
          title: 'Document Deleted!',
          message: 'The mandatory disclosure document has been deleted.'
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. IMAGE UPLOAD PACKAGE SECTION (1 Main + 10 Sub & Target Checkboxes)
  // --------------------------------------------------------------------------
  renderImagePackagesTable() {
    const tbody = document.getElementById('imagePackagesTableBody');
    if (!tbody || !this.siteData) return;

    const pkgs = this.siteData.image_packages || [];

    if (pkgs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">No image packages found. Click "+ Upload New Image Package" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = pkgs.map(p => {
      const subs = (p.sub_images || []).filter(s => s && s.trim() !== '');
      const subCount = subs.length;
      
      const activeTargets = [];
      const t = p.target_sections || {};
      if (t.welcome_section) activeTargets.push('WELCOME');
      if (t.whats_happening) activeTargets.push("WHAT'S HAPPENING");
      if (t.life_at_bhavans) activeTargets.push("LIFE AT BHAVAN'S");
      if (t.moments_at_bhavans) activeTargets.push('MOMENTS (Gallery)');
      if (t.campus_discovery) activeTargets.push('CAMPUS DISCOVERY');
      if (t.academic_environment) activeTargets.push('ACADEMIC');

      const targetBadges = activeTargets.map(name => `<span class="role-badge-preview badge-admin" style="margin-right: 4px; margin-bottom: 4px; font-size: 0.65rem;">${name}</span>`).join('');

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${this.formatImgSrc(p.main_image)}" onerror="this.onerror=null; this.src='../assets/images/bvb-manvila-logo.png';" alt="Main Image" style="width: 75px; height: 55px; object-fit: cover; border-radius: 6px; border: 1.5px solid var(--color-border); box-shadow: var(--shadow-xs);">
            </div>
          </td>
          <td>
            <strong style="color: var(--color-deep-blue); font-size: 0.9rem;">${this.escapeHtml(p.title)}</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 2px;">${this.escapeHtml(p.subtitle || '')}</div>
          </td>
          <td>
            <span class="role-badge-preview badge-school" style="display: inline-block;">${subCount} Sub Images</span>
          </td>
          <td>${targetBadges || '<span style="color: #94A3B8;">None</span>'}</td>
          <td>
            <div class="action-btn-group">
              <button class="btn-sm btn-action-edit" onclick="adminApp.editImagePackage(${p.id})">Edit</button>
              <button class="btn-sm btn-action-delete" onclick="adminApp.deleteImagePackage(${p.id})">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openImagePackageModal(id = null) {
    const modal = document.getElementById('imagePackageModal');
    const titleEl = document.getElementById('imageModalTitle');
    const form = document.getElementById('imagePackageForm');

    form.reset();
    document.getElementById('packageId').value = '';

    if (id) {
      titleEl.textContent = 'Edit Image Package (1 Main + 10 Sub Images)';
      const p = (this.siteData.image_packages || []).find(item => item.id === id);
      if (p) {
        document.getElementById('packageId').value = p.id;
        document.getElementById('packageTitle').value = p.title || '';
        document.getElementById('packageSubtitle').value = p.subtitle || '';
        document.getElementById('mainImageUrl').value = p.main_image || '';

        const mainPrev = document.getElementById('mainImagePreview');
        const mainWrap = document.getElementById('mainPreviewWrap');
        const mainFullBtn = document.getElementById('mainViewFullBtn');
        if (mainPrev && p.main_image) {
          const src = this.formatImgSrc(p.main_image);
          mainPrev.src = src;
          if (mainFullBtn) mainFullBtn.href = src;
          if (mainWrap) mainWrap.style.display = 'block';
        } else if (mainWrap) {
          mainWrap.style.display = 'none';
        }

        const subs = p.sub_images || [];
        for (let i = 1; i <= 10; i++) {
          const val = subs[i - 1] || '';
          const inputEl = document.getElementById(`subImg${i}`);
          const prevEl = document.getElementById(`subPreview${i}`);
          const vBtn = document.getElementById(`subViewBtn${i}`);
          if (inputEl) inputEl.value = val;
          if (prevEl) {
            if (val) {
              const src = this.formatImgSrc(val);
              prevEl.src = src;
              prevEl.style.display = 'block';
              if (vBtn) {
                vBtn.href = src;
                vBtn.style.display = 'inline-flex';
              }
            } else {
              prevEl.style.display = 'none';
              if (vBtn) vBtn.style.display = 'none';
            }
          }
        }

        const t = p.target_sections || {};
        document.getElementById('chk_welcome').checked = !!t.welcome_section;
        document.getElementById('chk_whats_happening').checked = !!t.whats_happening;
        document.getElementById('chk_life_at_bhavans').checked = !!t.life_at_bhavans;
        document.getElementById('chk_moments_at_bhavans').checked = !!t.moments_at_bhavans;
        document.getElementById('chk_campus_discovery').checked = !!t.campus_discovery;
        document.getElementById('chk_academic_environment').checked = !!t.academic_environment;
      }
    } else {
      titleEl.textContent = 'Upload Image Package (1 Main + 10 Sub Images)';
      document.getElementById('chk_moments_at_bhavans').checked = true;
      const mainWrap = document.getElementById('mainPreviewWrap');
      if (mainWrap) mainWrap.style.display = 'none';
      for (let i = 1; i <= 10; i++) {
        const prevEl = document.getElementById(`subPreview${i}`);
        if (prevEl) prevEl.style.display = 'none';
      }
    }

    modal.classList.add('active');
  }

  closeImagePackageModal() {
    document.getElementById('imagePackageModal').classList.remove('active');
  }

  saveImagePackage() {
    const id = document.getElementById('packageId').value;
    const title = document.getElementById('packageTitle').value.trim();
    const subtitle = document.getElementById('packageSubtitle').value.trim();
    const main_image = document.getElementById('mainImageUrl').value.trim();

    const sub_images = [];
    for (let i = 1; i <= 10; i++) {
      const el = document.getElementById(`subImg${i}`);
      if (el && el.value.trim()) {
        sub_images.push(el.value.trim());
      }
    }

    const target_sections = {
      welcome_section: document.getElementById('chk_welcome').checked,
      whats_happening: document.getElementById('chk_whats_happening').checked,
      life_at_bhavans: document.getElementById('chk_life_at_bhavans').checked,
      moments_at_bhavans: document.getElementById('chk_moments_at_bhavans').checked,
      campus_discovery: document.getElementById('chk_campus_discovery').checked,
      academic_environment: document.getElementById('chk_academic_environment').checked
    };

    this.confirmAction({
      title: 'Confirm Image Package Save',
      heading: id ? 'Update Image Package?' : 'Save New Image Package?',
      message: 'Are you sure you want to save this 1 Main highlight image + sub-images package?',
      icon: '🖼️',
      isDanger: false,
      onConfirm: () => {
        if (!this.siteData.image_packages) this.siteData.image_packages = [];

        if (id) {
          const idx = this.siteData.image_packages.findIndex(p => p.id == id);
          if (idx !== -1) {
            this.siteData.image_packages[idx] = { id: parseInt(id), title, subtitle, main_image, sub_images, target_sections };
          }
        } else {
          const newPkg = {
            id: Date.now(),
            title, subtitle, main_image, sub_images, target_sections
          };
          this.siteData.image_packages.push(newPkg);
        }

        this.closeImagePackageModal();
        this.saveData('Image package saved with main highlight & sub-images!');
        this.verifySuccess({
          title: 'Image Package Verified & Saved!',
          message: 'Main highlight image and sub-gallery images have been successfully updated across public site sections.'
        });
      }
    });
  }

  editImagePackage(id) {
    this.openImagePackageModal(id);
  }

  deleteImagePackage(id) {
    this.confirmAction({
      title: 'Confirm Image Package Deletion',
      heading: 'Delete Image Package?',
      message: 'Are you sure you want to permanently delete this image package and its gallery sub-images?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.image_packages = (this.siteData.image_packages || []).filter(p => p.id !== id);
        this.saveData('Image package deleted.');
        this.verifySuccess({
          title: 'Image Package Deleted!',
          message: 'The image package and associated gallery images have been deleted.'
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. EDUCATION SLIDER (AUTO SLIDES) SECTION
  // --------------------------------------------------------------------------
  renderSlidesTable() {
    const tbody = document.getElementById('slidesTableBody');
    if (!tbody || !this.siteData) return;

    const slides = this.siteData.auto_slides || [];

    if (slides.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">No auto slides found. Click "+ Add New Auto Slide" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = slides.map(s => `
      <tr>
        <td>
          <img src="${this.formatImgSrc(s.image_url)}" onerror="this.onerror=null; this.src='../assets/images/bvb-manvila-logo.png';" alt="Slide Image" style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border);">
        </td>
        <td><strong style="color: var(--color-deep-blue);">${this.escapeHtml(s.title)}</strong></td>
        <td style="font-size: 0.8125rem; color: var(--color-text-secondary);">${this.escapeHtml(s.subtitle || '-')}</td>
        <td>
          ${s.is_active == 1 ? '<span class="role-badge-preview badge-school">ACTIVE</span>' : '<span class="role-badge-preview badge-super-admin" style="background: #FEE2E2; color: #991B1B;">OFF</span>'}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-sm btn-action-edit" onclick="adminApp.toggleSlideStatus(${s.id})">${s.is_active == 1 ? 'Disable' : 'Enable'}</button>
            <button class="btn-sm btn-action-edit" onclick="adminApp.editSlide(${s.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deleteSlide(${s.id})">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openSlideModal(id = null) {
    const modal = document.getElementById('slideModal');
    const titleEl = document.getElementById('slideModalTitle');
    const form = document.getElementById('slideForm');

    form.reset();
    document.getElementById('slideId').value = '';
    const slideWrap = document.getElementById('slidePreviewWrap');
    if (slideWrap) slideWrap.style.display = 'none';

    if (id) {
      titleEl.textContent = 'Edit Education Auto Slide';
      const s = (this.siteData.auto_slides || []).find(item => item.id === id);
      if (s) {
        document.getElementById('slideId').value = s.id;
        document.getElementById('slideTitle').value = s.title || '';
        document.getElementById('slideSubtitle').value = s.subtitle || '';
        document.getElementById('slideImageUrl').value = s.image_url || '';
        document.getElementById('slideIsActive').checked = s.is_active == 1;

        const prev = document.getElementById('slideImagePreview');
        const vBtn = document.getElementById('slideViewFullBtn');
        if (s.image_url && prev) {
          const src = this.formatImgSrc(s.image_url);
          prev.src = src;
          if (vBtn) vBtn.href = src;
          if (slideWrap) slideWrap.style.display = 'block';
        }
      }
    } else {
      titleEl.textContent = 'Upload Education Auto Slide Image';
      document.getElementById('slideTitle').value = 'EDUCATION ROOTED IN VALUES. DRIVEN BY EXCELLENCE';
      document.getElementById('slideIsActive').checked = true;
    }

    modal.classList.add('active');
  }

  closeSlideModal() {
    document.getElementById('slideModal').classList.remove('active');
  }

  saveSlide() {
    const id = document.getElementById('slideId').value;
    const title = document.getElementById('slideTitle').value.trim();
    const subtitle = document.getElementById('slideSubtitle').value.trim();
    const image_url = document.getElementById('slideImageUrl').value.trim();
    const is_active = document.getElementById('slideIsActive').checked ? 1 : 0;

    this.confirmAction({
      title: 'Confirm Auto Slide Save',
      heading: id ? 'Update Auto Slide?' : 'Add New Auto Slide?',
      message: 'Are you sure you want to save this slider image for the Education Rooted in Values banner?',
      icon: '✨',
      isDanger: false,
      onConfirm: () => {
        if (!this.siteData.auto_slides) this.siteData.auto_slides = [];

        if (id) {
          const idx = this.siteData.auto_slides.findIndex(s => s.id == id);
          if (idx !== -1) {
            this.siteData.auto_slides[idx] = { id: parseInt(id), title, subtitle, image_url, is_active };
          }
        } else {
          const newSlide = {
            id: Date.now(),
            title, subtitle, image_url, is_active
          };
          this.siteData.auto_slides.push(newSlide);
        }

        this.closeSlideModal();
        this.saveData('Auto slide saved successfully!');
        this.verifySuccess({
          title: 'Auto Slide Saved & Verified!',
          message: 'The slide image has been updated on the Education Rooted in Values auto slider carousel.'
        });
      }
    });
  }

  editSlide(id) {
    this.openSlideModal(id);
  }

  toggleSlideStatus(id) {
    const s = (this.siteData.auto_slides || []).find(item => item.id === id);
    if (!s) return;
    s.is_active = s.is_active == 1 ? 0 : 1;
    this.saveData('Slide status updated.');
  }

  deleteSlide(id) {
    this.confirmAction({
      title: 'Confirm Slide Deletion',
      heading: 'Delete Auto Slide?',
      message: 'Are you sure you want to delete this education slider image?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.auto_slides = (this.siteData.auto_slides || []).filter(s => s.id !== id);
        this.saveData('Slide deleted.');
        this.verifySuccess({
          title: 'Slide Deleted!',
          message: 'The auto slide image has been removed.'
        });
      }
    });
  }

  openSlideBatchModal() {
    const modal = document.getElementById('slideBatchModal');
    const form = document.getElementById('slideBatchForm');
    if (form) form.reset();

    const slides = this.siteData.auto_slides || [];
    for (let i = 1; i <= 5; i++) {
      const titleEl = document.getElementById(`batchTitle${i}`);
      const subEl = document.getElementById(`batchSubtitle${i}`);
      const urlEl = document.getElementById(`batchImgUrl${i}`);
      const prevWrap = document.getElementById(`batchPrevWrap${i}`);
      const prevImg = document.getElementById(`batchPrev${i}`);

      const existingSlide = slides[i - 1];
      if (existingSlide) {
        if (titleEl) titleEl.value = existingSlide.title || '';
        if (subEl) subEl.value = existingSlide.subtitle || '';
        if (urlEl) urlEl.value = existingSlide.image_url || '';
        if (existingSlide.image_url && prevImg) {
          prevImg.src = this.formatImgSrc(existingSlide.image_url);
          if (prevWrap) prevWrap.style.display = 'block';
        } else if (prevWrap) {
          prevWrap.style.display = 'none';
        }
      } else {
        if (urlEl) urlEl.value = '';
        if (prevWrap) prevWrap.style.display = 'none';
      }
    }

    if (modal) modal.classList.add('active');
  }

  closeSlideBatchModal() {
    const modal = document.getElementById('slideBatchModal');
    if (modal) modal.classList.remove('active');
  }

  save5Slides() {
    const newBatch = [];
    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const title = (document.getElementById(`batchTitle${i}`)?.value || '').trim();
      const subtitle = (document.getElementById(`batchSubtitle${i}`)?.value || '').trim();
      const image_url = (document.getElementById(`batchImgUrl${i}`)?.value || '').trim();

      if (image_url) {
        newBatch.push({
          id: Date.now() + i,
          title: title || 'EDUCATION ROOTED IN VALUES. DRIVEN BY EXCELLENCE',
          subtitle: subtitle || 'Bhavan\'s Vivekananda Vidya Mandir',
          image_url: image_url,
          is_active: 1
        });
        count++;
      }
    }

    if (count === 0) {
      alert('⚠️ Please select at least 1 image file before saving auto slides.');
      return;
    }

    this.confirmAction({
      title: 'Confirm 5 Auto Slides Batch Upload',
      heading: 'Save All 5 Auto Slides?',
      message: `Are you sure you want to save ${count} auto slide image(s) for the Education Rooted in Values banner on the public site?`,
      icon: '🚀',
      isDanger: false,
      onConfirm: () => {
        this.siteData.auto_slides = newBatch;
        this.closeSlideBatchModal();
        this.saveData(`${count} Auto Slides uploaded and saved successfully!`);
        this.verifySuccess({
          title: '5 Auto Slides Batch Save Verified!',
          message: `${count} auto slides have been updated and are live on the public site homepage hero slider.`
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. MULTI-ROLE USER MANAGEMENT SECTION (Super Admin Only)
  // --------------------------------------------------------------------------
  renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody || !this.siteData) return;

    const users = this.siteData.users || [];

    tbody.innerHTML = users.map(u => {
      let badgeClass = 'badge-school';
      let privs = 'Basic View & Section Updates';
      if (u.role === 'admin') {
        badgeClass = 'badge-admin';
        privs = 'Full Content & Image Media Access';
      } else if (u.role === 'super admin') {
        badgeClass = 'badge-super-admin';
        privs = 'Full Authority + User Creation & Deletion';
      }

      return `
        <tr>
          <td>#${u.id}</td>
          <td><strong>${this.escapeHtml(u.username)}</strong></td>
          <td>${this.escapeHtml(u.name || u.username)}</td>
          <td><span class="role-badge-preview ${badgeClass}">${this.escapeHtml(u.role).toUpperCase()}</span></td>
          <td style="font-size: 0.8125rem; color: var(--color-text-secondary);">${privs}</td>
          <td>
            <div class="action-btn-group">
              <button class="btn-sm btn-action-edit" onclick="adminApp.editUser(${u.id})">Edit</button>
              <button class="btn-sm btn-action-delete" onclick="adminApp.deleteUser(${u.id})">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openUserModal(id = null) {
    const modal = document.getElementById('userModal');
    const titleEl = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');

    form.reset();
    document.getElementById('userId').value = '';

    if (id) {
      titleEl.textContent = 'Edit Administrative User';
      const u = (this.siteData.users || []).find(item => item.id === id);
      if (u) {
        document.getElementById('userId').value = u.id;
        document.getElementById('userName').value = u.name || '';
        document.getElementById('userUsername').value = u.username || '';
        document.getElementById('userPassword').value = u.password || '';
        document.getElementById('userRole').value = u.role || 'school';
      }
    } else {
      titleEl.textContent = 'Create Administrative User';
    }

    modal.classList.add('active');
  }

  closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
  }

  saveUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value.trim();
    const username = document.getElementById('userUsername').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;

    this.confirmAction({
      title: 'Confirm User Account Save',
      heading: id ? 'Update User Account?' : 'Create Administrative User?',
      message: `Are you sure you want to save user account for "${username}" with role level "${role.toUpperCase()}"?`,
      icon: '👤',
      isDanger: false,
      onConfirm: () => {
        if (!this.siteData.users) this.siteData.users = [];

        if (id) {
          const idx = this.siteData.users.findIndex(u => u.id == id);
          if (idx !== -1) {
            this.siteData.users[idx] = { id: parseInt(id), name, username, password, role };
          }
        } else {
          const newUser = {
            id: Date.now(),
            name, username, password, role
          };
          this.siteData.users.push(newUser);
        }

        this.closeUserModal();
        this.saveData('User account created/updated successfully!');
        this.verifySuccess({
          title: 'User Account Verified!',
          message: `The user account for "${username}" with privilege role "${role.toUpperCase()}" has been saved.`
        });
      }
    });
  }

  editUser(id) {
    this.openUserModal(id);
  }

  deleteUser(id) {
    this.confirmAction({
      title: 'Confirm User Deletion',
      heading: 'Delete User Account?',
      message: 'Are you sure you want to delete this administrative user account?',
      icon: '🗑️',
      isDanger: true,
      onConfirm: () => {
        this.siteData.users = (this.siteData.users || []).filter(u => u.id !== id);
        this.saveData('User account deleted.');
        this.verifySuccess({
          title: 'User Account Deleted!',
          message: 'The administrative user account has been deleted.'
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // ACTION CONFIRMATION & WORK VERIFICATION MODAL ENGINE
  // --------------------------------------------------------------------------
  confirmAction({ title = 'Confirm Action', heading = 'Are you sure?', message = 'Please confirm to proceed.', icon = '⚠️', isDanger = false, onConfirm }) {
    const modal = document.getElementById('confirmActionModal');
    const titleEl = document.getElementById('confirmModalTitle');
    const headingEl = document.getElementById('confirmHeading');
    const msgEl = document.getElementById('confirmMessage');
    const iconEl = document.getElementById('confirmIconWrap');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const proceedBtn = document.getElementById('confirmProceedBtn');
    const headerEl = document.getElementById('confirmModalHeader');

    if (!modal || !proceedBtn) {
      if (onConfirm) onConfirm();
      return;
    }

    if (titleEl) titleEl.textContent = title;
    if (headingEl) headingEl.textContent = heading;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    if (isDanger) {
      if (headerEl) headerEl.style.background = 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)';
      proceedBtn.className = 'btn-sm btn-action-delete';
      proceedBtn.style.backgroundColor = '#DC2626';
      proceedBtn.textContent = 'Yes, Delete';
    } else {
      if (headerEl) headerEl.style.background = 'linear-gradient(135deg, #062B5C 0%, #0B4EA2 100%)';
      proceedBtn.className = 'btn-sm btn-action-add';
      proceedBtn.style.backgroundColor = '#0B4EA2';
      proceedBtn.textContent = 'Confirm & Proceed';
    }

    const closeConfirmModal = () => {
      modal.classList.remove('active');
    };

    const newCancelBtn = cancelBtn.cloneNode(true);
    if (cancelBtn.parentNode) cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    const newProceedBtn = proceedBtn.cloneNode(true);
    if (proceedBtn.parentNode) proceedBtn.parentNode.replaceChild(newProceedBtn, proceedBtn);

    newCancelBtn.addEventListener('click', closeConfirmModal);
    newProceedBtn.addEventListener('click', () => {
      closeConfirmModal();
      if (onConfirm) onConfirm();
    });

    modal.classList.add('active');
  }

  verifySuccess({ title = 'Work Completed Successfully!', message = 'Your changes have been saved, updated in site data, and verified.' }) {
    const modal = document.getElementById('successVerifyModal');
    const titleEl = document.getElementById('successModalTitle');
    const msgEl = document.getElementById('successModalMessage');
    const closeBtn = document.getElementById('successCloseBtn');

    if (!modal) return;

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    const closeSuccessModal = () => {
      modal.classList.remove('active');
    };

    if (closeBtn) {
      const newCloseBtn = closeBtn.cloneNode(true);
      if (closeBtn.parentNode) closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
      newCloseBtn.addEventListener('click', closeSuccessModal);
    }

    modal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // UTILITIES & TOAST
  // --------------------------------------------------------------------------
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠'}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, "&amp;")
                       .replace(/</g, "&lt;")
                       .replace(/>/g, "&gt;")
                       .replace(/"/g, "&quot;")
                       .replace(/'/g, "&#039;");
  }
}

// Global App Initialization
try {
  window.adminApp = new AdminApp();
} catch (e) {
  console.error('AdminApp instantiation notice:', e);
}
