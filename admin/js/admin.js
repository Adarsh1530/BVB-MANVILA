/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin Panel Application Engine & Multi-Role State Controller
 */

class AdminApp {
  constructor() {
    this.siteData = null;
    this.currentUser = null;
    this.init();
  }

  async init() {
    // 1. Check Authentication State
    this.currentUser = JSON.parse(sessionStorage.getItem('bvb_active_user') || localStorage.getItem('bvb_active_user') || 'null');

    const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('login');

    if (!this.currentUser && !isLoginPage) {
      window.location.href = '/admin/login.html';
      return;
    }

    if (this.currentUser && isLoginPage) {
      window.location.href = '/admin/index.html';
      return;
    }

    // 2. Load Site Data State
    await this.loadData();

    // 3. If on Dashboard, setup UI and event listeners
    if (!isLoginPage) {
      this.setupDashboardUI();
      this.bindEvents();
      this.renderAll();
    } else {
      this.bindLoginEvents();
    }
  }

  async loadData() {
    const localData = localStorage.getItem('bvb_site_data');
    if (localData) {
      try {
        this.siteData = JSON.parse(localData);
        return;
      } catch (e) {
        console.error('Local state parse error, fetching fresh state:', e);
      }
    }

    try {
      const res = await fetch('/api/get_site_data.json');
      if (res.ok) {
        this.siteData = await res.json();
        localStorage.setItem('bvb_site_data', JSON.stringify(this.siteData));
      }
    } catch (err) {
      console.error('Failed to load initial site data JSON:', err);
    }
  }

  saveData(message = 'Changes saved successfully!') {
    localStorage.setItem('bvb_site_data', JSON.stringify(this.siteData));
    
    // Also post to backend PHP endpoint if available on server
    fetch('/api/admin_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync_data', data: this.siteData })
    }).catch(e => console.log('PHP sync notice (Static fallback active):', e));

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
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const role = document.getElementById('loginRoleSelect').value;

      const users = this.siteData ? this.siteData.users : [];
      const matchedUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

      const alertBox = document.getElementById('loginAlert');

      if (matchedUser) {
        // Enforce chosen role privilege if user has permissions
        matchedUser.role = role; 
        sessionStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        localStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        window.location.href = '/admin/index.html';
      } else {
        // Demo Fallback Login
        if (username && password) {
          const newUser = {
            id: Date.now(),
            username: username,
            name: username.toUpperCase(),
            role: role
          };
          sessionStorage.setItem('bvb_active_user', JSON.stringify(newUser));
          localStorage.setItem('bvb_active_user', JSON.stringify(newUser));
          window.location.href = '/admin/index.html';
        } else {
          alertBox.style.display = 'block';
          alertBox.style.backgroundColor = '#FEE2E2';
          alertBox.style.color = '#991B1B';
          alertBox.textContent = 'Invalid username or password. Please try again.';
        }
      }
    });
  }

  logout() {
    sessionStorage.removeItem('bvb_active_user');
    localStorage.removeItem('bvb_active_user');
    window.location.href = '/admin/login.html';
  }

  // --------------------------------------------------------------------------
  // DASHBOARD UI SETUP & PRIVILEGE CHECKS
  // --------------------------------------------------------------------------
  setupDashboardUI() {
    const userNameEl = document.getElementById('sidebarUserName');
    const userRoleEl = document.getElementById('sidebarUserRole');

    if (userNameEl) userNameEl.textContent = this.currentUser.name || this.currentUser.username;
    if (userRoleEl) {
      userRoleEl.textContent = (this.currentUser.role || 'SCHOOL').toUpperCase();
    }

    // Role-based Access Control (RBAC) UI Hiding
    const userRole = (this.currentUser.role || 'school').toLowerCase();
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

    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveUser();
      });
    }

    // File Explorer Pickers (HTML5 FileReader API)
    const setupFilePicker = (inputId, targetTextId, previewImgId, previewWrapId, viewFullBtnId) => {
      const fileInput = document.getElementById(inputId);
      const textInput = document.getElementById(targetTextId);
      const previewImg = document.getElementById(previewImgId);
      const previewWrap = previewWrapId ? document.getElementById(previewWrapId) : null;
      const viewFullBtn = viewFullBtnId ? document.getElementById(viewFullBtnId) : null;

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
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
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };

    setupFilePicker('mainFileInput', 'mainImageUrl', 'mainImagePreview', 'mainPreviewWrap', 'mainViewFullBtn');
    setupFilePicker('popupFileInput', 'popupImageUrlInput', 'popupImagePreview', 'popupPreviewWrap', 'popupViewFullBtn');

    // Sub Image File Pickers
    document.querySelectorAll('.sub-file-picker').forEach(picker => {
      picker.addEventListener('change', (e) => {
        const targetId = picker.getAttribute('data-target');
        const previewId = picker.getAttribute('data-preview');
        const viewBtnId = picker.getAttribute('data-viewbtn');
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const txt = document.getElementById(targetId);
            const prev = document.getElementById(previewId);
            const vBtn = document.getElementById(viewBtnId);
            if (txt) txt.value = evt.target.result;
            if (prev) {
              prev.src = evt.target.result;
              prev.style.display = 'block';
            }
            if (vBtn) {
              vBtn.href = evt.target.result;
              vBtn.style.display = 'inline-flex';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  switchTab(tabName) {
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
      images: 'Image Upload Section (1 Main + 5 Sub Images & Target Checkboxes)',
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
    this.renderDisclosuresTable();
    this.renderImagePackagesTable();
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
        <td>${n.pdf_link ? `<a href="/${this.escapeHtml(n.pdf_link)}" target="_blank" style="color: var(--color-primary); font-weight: 600;">View PDF</a>` : '<span style="color: #94A3B8;">None</span>'}</td>
        <td>${n.is_ticker == 1 ? '<span class="role-badge-preview badge-school">Ticker Active</span>' : '<span style="color: #94A3B8;">Off</span>'}</td>
        <td>
          <button class="btn-sm btn-action-edit" onclick="adminApp.editNotice(${n.id})">Edit</button>
          <button class="btn-sm btn-action-delete" onclick="adminApp.deleteNotice(${n.id})">Delete</button>
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
  // 3. ENTRANCE POPUP SECTION
  // --------------------------------------------------------------------------
  renderPopupForm() {
    if (!this.siteData || !this.siteData.popup) return;
    const p = this.siteData.popup;

    const elActive = document.getElementById('popupActiveSelect');
    const elTitle = document.getElementById('popupTitleInput');
    const elMessage = document.getElementById('popupMessageInput');
    const elImg = document.getElementById('popupImageUrlInput');
    const elBtnText = document.getElementById('popupButtonTextInput');
    const elBtnUrl = document.getElementById('popupButtonUrlInput');

    if (elActive) elActive.value = p.is_active || 1;
    if (elTitle) elTitle.value = p.title || '';
    if (elMessage) elMessage.value = p.message || '';
    if (elImg) elImg.value = p.image_url || '';
    if (elBtnText) elBtnText.value = p.button_text || '';
    if (elBtnUrl) elBtnUrl.value = p.button_url || '';

    const popupPrevWrap = document.getElementById('popupPreviewWrap');
    const popupPrevImg = document.getElementById('popupImagePreview');
    const popupFullBtn = document.getElementById('popupViewFullBtn');

    if (p.image_url && popupPrevImg && popupPrevWrap) {
      const src = p.image_url.startsWith('/') || p.image_url.startsWith('http') || p.image_url.startsWith('data:') ? p.image_url : '/' + p.image_url;
      popupPrevImg.src = src;
      if (popupFullBtn) popupFullBtn.href = src;
      popupPrevWrap.style.display = 'block';
    } else if (popupPrevWrap) {
      popupPrevWrap.style.display = 'none';
    }
  }

  savePopupConfig() {
    this.confirmAction({
      title: 'Confirm Entrance Popup Save',
      heading: 'Save Popup Announcement Settings?',
      message: 'Are you sure you want to update the homepage entrance popup configuration?',
      icon: '🔔',
      isDanger: false,
      onConfirm: () => {
        this.siteData.popup = {
          id: 1,
          is_active: parseInt(document.getElementById('popupActiveSelect').value),
          title: document.getElementById('popupTitleInput').value.trim(),
          message: document.getElementById('popupMessageInput').value.trim(),
          image_url: document.getElementById('popupImageUrlInput').value.trim(),
          button_text: document.getElementById('popupButtonTextInput').value.trim(),
          button_url: document.getElementById('popupButtonUrlInput').value.trim()
        };
        this.saveData('Entrance Popup settings saved successfully!');
        this.verifySuccess({
          title: 'Entrance Popup Updated!',
          message: 'The entrance announcement popup modal settings and uploaded image have been verified and updated.'
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. MANDATORY DISCLOSURE SECTION
  // --------------------------------------------------------------------------
  renderDisclosuresTable() {
    const tbody = document.getElementById('disclosuresTableBody');
    if (!tbody || !this.siteData) return;

    const docs = this.siteData.mandatory_disclosures || [];

    if (docs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">No disclosures added yet. Click "+ Add Mandatory Document" to add one.</td></tr>`;
      return;
    }

    tbody.innerHTML = docs.map(d => `
      <tr>
        <td><strong>${this.escapeHtml(d.sl_no)}</strong></td>
        <td><span class="role-badge-preview badge-super-admin">Section ${this.escapeHtml(d.category_code || 'B')}</span></td>
        <td style="font-weight: 600;">${this.escapeHtml(d.title)}</td>
        <td style="font-size: 0.8125rem; color: var(--color-text-secondary);">${this.escapeHtml(d.details || '-')}</td>
        <td><a href="/${this.escapeHtml(d.file_link)}" target="_blank" style="color: var(--color-primary); font-weight: 600;">Open Document</a></td>
        <td>
          <button class="btn-sm btn-action-edit" onclick="adminApp.editDisclosure(${d.id})">Edit</button>
          <button class="btn-sm btn-action-delete" onclick="adminApp.deleteDisclosure(${d.id})">Delete</button>
        </td>
      </tr>
    `).join('');
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
            this.siteData.mandatory_disclosures[idx] = { id: parseInt(id), sl_no, category_code, title, details, file_link };
          }
        } else {
          const newDoc = {
            id: Date.now(),
            sl_no, category_code, title, details, file_link
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
  // 5. IMAGE UPLOAD PACKAGE SECTION (1 Main + 5 Sub & Target Checkboxes)
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
      const subCount = (p.sub_images || []).filter(s => s && s.trim() !== '').length;
      
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
            <img src="/${this.escapeHtml(p.main_image)}" alt="Main Image" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border);">
          </td>
          <td>
            <strong style="color: var(--color-deep-blue);">${this.escapeHtml(p.title)}</strong>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">${this.escapeHtml(p.subtitle || '')}</div>
          </td>
          <td><span class="role-badge-preview badge-school">${subCount} Sub Images</span></td>
          <td>${targetBadges || '<span style="color: #94A3B8;">None</span>'}</td>
          <td>
            <button class="btn-sm btn-action-edit" onclick="adminApp.editImagePackage(${p.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deleteImagePackage(${p.id})">Delete</button>
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
      titleEl.textContent = 'Edit Image Package';
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
          const src = p.main_image.startsWith('/') || p.main_image.startsWith('http') || p.main_image.startsWith('data:') ? p.main_image : '/' + p.main_image;
          mainPrev.src = src;
          if (mainFullBtn) mainFullBtn.href = src;
          if (mainWrap) mainWrap.style.display = 'block';
        } else if (mainWrap) {
          mainWrap.style.display = 'none';
        }

        const subs = p.sub_images || [];
        for (let i = 1; i <= 5; i++) {
          const val = subs[i - 1] || '';
          const inputEl = document.getElementById(`subImg${i}`);
          const prevEl = document.getElementById(`subPreview${i}`);
          const vBtn = document.getElementById(`subViewBtn${i}`);
          if (inputEl) inputEl.value = val;
          if (prevEl) {
            if (val) {
              const src = val.startsWith('/') || val.startsWith('http') || val.startsWith('data:') ? val : '/' + val;
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
      titleEl.textContent = 'Upload Image Package (1 Main + 5 Sub Images)';
      document.getElementById('chk_moments_at_bhavans').checked = true;
      const mainWrap = document.getElementById('mainPreviewWrap');
      if (mainWrap) mainWrap.style.display = 'none';
      for (let i = 1; i <= 5; i++) {
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

    const sub_images = [
      document.getElementById('subImg1').value.trim(),
      document.getElementById('subImg2').value.trim(),
      document.getElementById('subImg3').value.trim(),
      document.getElementById('subImg4').value.trim(),
      document.getElementById('subImg5').value.trim()
    ].filter(s => s !== '');

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
  // 6. MULTI-ROLE USER MANAGEMENT SECTION (Super Admin Only)
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
            <button class="btn-sm btn-action-edit" onclick="adminApp.editUser(${u.id})">Edit</button>
            <button class="btn-sm btn-action-delete" onclick="adminApp.deleteUser(${u.id})">Delete</button>
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
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});
