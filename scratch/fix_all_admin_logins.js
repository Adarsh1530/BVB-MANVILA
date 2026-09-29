const fs = require('fs');
const path = require('path');

const adminJsPath = 'c:\\xampp\\htdocs\\BVB MANVILA\\admin\\js\\admin.js';
let adminJs = fs.readFileSync(adminJsPath, 'utf8');

const newBindLoginEvents = `  bindLoginEvents() {
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
  }`;

// Replace bindLoginEvents method
adminJs = adminJs.replace(/bindLoginEvents\(\) \{[\s\S]*?\n  \}/, newBindLoginEvents);

fs.writeFileSync(adminJsPath, adminJs, 'utf8');
console.log('✅ Updated admin/js/admin.js with robust login authentication for all roles');
