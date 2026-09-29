const fs = require('fs');
const path = require('path');

const adminJsPath = 'c:\\xampp\\htdocs\\BVB MANVILA\\admin\\js\\admin.js';
let adminJs = fs.readFileSync(adminJsPath, 'utf8');

// Replace auto-login fallback in init()
const oldInit = `      if (!this.currentUser && !isLoginPage) {
        // Fallback default admin user if session state is missing to avoid crashing
        this.currentUser = { id: 1, username: 'superadmin', name: 'Principal / Director', role: 'super admin' };
        sessionStorage.setItem('bvb_active_user', JSON.stringify(this.currentUser));
        localStorage.setItem('bvb_active_user', JSON.stringify(this.currentUser));
      }`;

const newInit = `      if (!this.currentUser && !isLoginPage) {
        window.location.href = this.getAdminPath('login.html');
        return;
      }`;

adminJs = adminJs.replace(oldInit, newInit);

// Replace fallback in setupDashboardUI()
const oldSetupUI = `  setupDashboardUI() {
    if (!this.currentUser) {
      this.currentUser = { username: 'superadmin', name: 'Principal / Director', role: 'super admin' };
    }`;

const newSetupUI = `  setupDashboardUI() {
    if (!this.currentUser) {
      window.location.href = this.getAdminPath('login.html');
      return;
    }`;

adminJs = adminJs.replace(oldSetupUI, newSetupUI);

// Replace bindLoginEvents() implementation to enforce strict username and password checking
const oldBindLogin = `      if (matchedUser) {
        matchedUser.role = role; 
        sessionStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        localStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        window.location.href = this.getAdminPath('index.html');
      } else {
        if (username && password) {
          const newUser = {
            id: Date.now(),
            username: username,
            name: username.toUpperCase(),
            role: role
          };
          sessionStorage.setItem('bvb_active_user', JSON.stringify(newUser));
          localStorage.setItem('bvb_active_user', JSON.stringify(newUser));
          window.location.href = this.getAdminPath('index.html');
        } else {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.backgroundColor = '#FEE2E2';
            alertBox.style.color = '#991B1B';
            alertBox.textContent = 'Invalid username or password. Please try again.';
          }
        }
      }`;

const newBindLogin = `      if (matchedUser) {
        matchedUser.role = role || matchedUser.role; 
        sessionStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        localStorage.setItem('bvb_active_user', JSON.stringify(matchedUser));
        window.location.href = this.getAdminPath('index.html');
      } else {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.backgroundColor = '#FEE2E2';
          alertBox.style.color = '#991B1B';
          alertBox.textContent = '❌ Invalid username or password. Please enter valid administrative credentials.';
        }
      }`;

adminJs = adminJs.replace(oldBindLogin, newBindLogin);

fs.writeFileSync(adminJsPath, adminJs, 'utf8');
console.log('✅ Updated admin/js/admin.js with strict login authentication redirect');
