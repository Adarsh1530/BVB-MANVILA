/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Admin Dashboard Engine (Tab Switching, Checkbox Multi-Location Save, Modals, CRUD)
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Vertical Sidebar Navigation Engine
  const navButtons = document.querySelectorAll('.admin-sidebar .sidebar-nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Direct Slot Upload (+ Icon) Handler
  const slotFileInput = document.getElementById('directSlotFileInput');
  let activeUploadTarget = null;

  document.querySelectorAll('.btn-slot-upload-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      activeUploadTarget = {
        category_id: btn.getAttribute('data-category-id'),
        image_type: btn.getAttribute('data-image-type'),
        sort_order: btn.getAttribute('data-sort-order')
      };
      if (slotFileInput) {
        slotFileInput.value = '';
        slotFileInput.click();
      }
    });
  });

  if (slotFileInput) {
    slotFileInput.addEventListener('change', () => {
      if (!slotFileInput.files || !slotFileInput.files[0] || !activeUploadTarget) return;

      const file = slotFileInput.files[0];
      const formData = new FormData();
      formData.append('action', 'upload_image');
      formData.append('category_id', activeUploadTarget.category_id);
      formData.append('image_type', activeUploadTarget.image_type);
      formData.append('sort_order', activeUploadTarget.sort_order);
      formData.append('image_file', file);
      formData.append('locations[]', 'moments_at_bhavans'); // Default location assignment

      showAlert('Uploading image to selected slot...', false);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message || 'Upload failed.', true);
          }
        })
        .catch(err => showAlert('Server communication error.', true));
    });
  }

  // 2. Alert Helper
  const alertBox = document.getElementById('adminAlert');
  function showAlert(msg, isError = false) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `admin-alert ${isError ? 'error' : 'success'}`;
    alertBox.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4000);
  }

  // 3. Multi-Location Checkboxes Submission
  document.querySelectorAll('.location-checkboxes-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const imageId = form.getAttribute('data-image-id');
      const checkedBoxes = Array.from(form.querySelectorAll('input[name="loc"]:checked')).map(cb => cb.value);

      const formData = new FormData();
      formData.append('action', 'update_locations');
      formData.append('image_id', imageId);
      checkedBoxes.forEach(loc => formData.append('locations[]', loc));

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showAlert(data.message || 'Display sections updated.');
          } else {
            showAlert(data.message || 'Error updating sections.', true);
          }
        })
        .catch(err => showAlert('Server communication error.', true));
    });
  });

  // 4. Image Delete Button
  document.querySelectorAll('.btn-delete-image').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete this image?')) return;
      const imageId = btn.getAttribute('data-image-id');
      const formData = new FormData();
      formData.append('action', 'delete_image');
      formData.append('image_id', imageId);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message || 'Failed to delete image.', true);
          }
        });
    });
  });

  // 5. Promote to Main Image Button
  document.querySelectorAll('.btn-set-main').forEach(btn => {
    btn.addEventListener('click', () => {
      const imageId = btn.getAttribute('data-image-id');
      const formData = new FormData();
      formData.append('action', 'set_main_image');
      formData.append('image_id', imageId);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message || 'Failed to update Main Image.', true);
          }
        });
    });
  });

  // 6. Upload Image Modal Trigger
  const uploadModal = document.getElementById('uploadImageModal');
  document.querySelectorAll('.btn-upload-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-category-id');
      const catName = btn.getAttribute('data-category-name');
      document.getElementById('modalCatId').value = catId;
      document.getElementById('modalCatName').textContent = catName;
      if (uploadModal) uploadModal.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal').forEach(m => m.classList.remove('active'));
    });
  });

  // Upload Form Submit
  const uploadForm = document.getElementById('uploadImageForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);
      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message || 'Upload failed.', true);
          }
        });
    });
  }

  // 7. Popup Settings Form
  const popupForm = document.getElementById('popupSettingsForm');
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(popupForm);
      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showAlert(data.message);
          } else {
            showAlert(data.message, true);
          }
        });
    });
  }

  // 8. Notice Management Modal & Handlers
  const noticeModal = document.getElementById('createNoticeModal');
  const btnOpenNoticeModal = document.getElementById('btnOpenNoticeModal');
  if (btnOpenNoticeModal && noticeModal) {
    btnOpenNoticeModal.addEventListener('click', () => {
      noticeModal.classList.add('active');
    });
  }

  const createNoticeForm = document.getElementById('createNoticeForm');
  if (createNoticeForm) {
    createNoticeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(createNoticeForm);
      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message, true);
          }
        });
    });
  }

  // Toggle Ticker Status
  document.querySelectorAll('.btn-toggle-ticker').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const formData = new FormData();
      formData.append('action', 'toggle_ticker');
      formData.append('notice_id', id);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          }
        });
    });
  });

  // Delete Notice
  document.querySelectorAll('.btn-delete-notice').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Delete this notice?')) return;
      const id = btn.getAttribute('data-id');
      const formData = new FormData();
      formData.append('action', 'delete_notice');
      formData.append('notice_id', id);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') location.reload();
        });
    });
  });

  // 9. User Management Modals & Actions
  const userModal = document.getElementById('createUserModal');
  const btnOpenUserModal = document.getElementById('btnOpenUserModal');
  if (btnOpenUserModal && userModal) {
    btnOpenUserModal.addEventListener('click', () => {
      userModal.classList.add('active');
    });
  }

  const createUserForm = document.getElementById('createUserForm');
  if (createUserForm) {
    createUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(createUserForm);
      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message, true);
          }
        });
    });
  }

  // Delete User
  document.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Delete this user account?')) return;
      const id = btn.getAttribute('data-id');
      const formData = new FormData();
      formData.append('action', 'delete_user');
      formData.append('user_id', id);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            location.reload();
          } else {
            showAlert(data.message, true);
          }
        });
    });
  });

  // Change Password
  document.querySelectorAll('.btn-change-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const uname = btn.getAttribute('data-user');
      const newPass = prompt(`Enter new password for account '${uname}':`);
      if (!newPass) return;

      const formData = new FormData();
      formData.append('action', 'change_password');
      formData.append('user_id', id);
      formData.append('new_password', newPass);

      fetch('actions.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showAlert(data.message);
          } else {
            showAlert(data.message, true);
          }
        });
    });
  });

});
