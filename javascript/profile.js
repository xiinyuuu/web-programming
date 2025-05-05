document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap toasts
    const logoutToast = new bootstrap.Toast(document.getElementById('logoutToast'));
    const updateToast = new bootstrap.Toast(document.getElementById('updateToast'));
    const updateProfilePicToast = new bootstrap.Toast(document.getElementById('updateProfilePicToast'));
    const updatePasswordToast = new bootstrap.Toast(document.getElementById('updatePasswordToast'));
    const deleteAccountToast = new bootstrap.Toast(document.getElementById('deleteAccountToast'));
  
    // Check if we should show logout toast (from URL parameter)
    if (window.location.search.includes('logout=true')) {
      logoutToast.show();
    }
  
    // Edit Profile Modal
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', function() {
        // Get form values
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        
        // Update the display
        document.getElementById('displayName').textContent = newName;
        document.getElementById('displayEmail').textContent = newEmail;
        
        // Show success toast
        updateToast.show();
        
        // Close modal
        editProfileModal.hide();
      });
    }
  
    // Profile Picture Modal
    const profilePicModal = new bootstrap.Modal(document.getElementById('profilePicModal'));
    const profilePicUpload = document.getElementById('profilePicUpload');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const saveProfilePicBtn = document.getElementById('saveProfilePicBtn');
    
    if (profilePicUpload) {
      profilePicUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            profilePicPreview.src = event.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
    }
    
    if (saveProfilePicBtn) {
      saveProfilePicBtn.addEventListener('click', function() {
        if (profilePicPreview.src) {
          // Update profile picture in the header
          document.getElementById('displayProfilePic').src = profilePicPreview.src;
          document.querySelector('.profile-img').src = profilePicPreview.src;
          
          // Show success toast
          updateProfilePicToast.show();
          
          // Close modal
          profilePicModal.hide();
        }
      });
    }
  
    // Change Password Modal 
    const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');

    if (changePasswordForm && changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate inputs
            if (!currentPassword || !newPassword || !confirmPassword) {
                showError("Please fill in all fields");
                return;
            }

            if (newPassword.length < 8) {
                showError("Password must be at least 8 characters");
                return;
            }

            if (newPassword !== confirmPassword) {
                showError("New passwords don't match");
                return;
            }

            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful password change
            simulatePasswordChange(currentPassword, newPassword);
        });

        // Clear validation errors when modal is shown
        changePasswordModal._element.addEventListener('show.bs.modal', function() {
            clearErrors();
            changePasswordForm.reset();
        });
    }
    
    // Delete Account Modal
    const deleteAccountModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (deleteAccountForm && confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const password = document.getElementById('deletePassword').value;
            const confirmationCheck = document.getElementById('deleteConfirmationCheck');

            // Validate inputs
            if (!password) {
                showDeleteError("Please enter your password");
                return;
            }

            // In a real app, you might want additional confirmation
            if (!confirm("Are you absolutely sure you want to delete your account? This cannot be undone!")) {
                return;
            }

            // Here you would typically make an API call to your backend
            simulateAccountDeletion(password);
        });

        // Clear validation errors when modal is shown
        deleteAccountModal._element.addEventListener('show.bs.modal', function() {
            clearDeleteErrors();
            deleteAccountForm.reset();
        });
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function simulatePasswordChange(currentPassword, newPassword) {
        // In a real app, you would make an API call here
        console.log("Attempting to change password...");
        
        // Simulate API call delay
        setTimeout(function() {
            // This would come from your API response in a real app
            const success = true; // Simulate success
            
            if (success) {
                // Show success message
                document.querySelector('#updatePasswordToast .toast-body').innerHTML = 
                    '<i class="bi bi-check-circle me-2"></i> Password changed successfully!';
                updatePasswordToast.show();
                
                // Close modal and reset form
                changePasswordModal.hide();
                changePasswordForm.reset();
            } else {
                showError("Current password is incorrect");
            }
        }, 1000);
    }

    function showError(message) {
        // Remove any existing error alerts
        clearErrors();
        
        // Create error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger mt-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
        
        // Insert before the form's submit button
        changePasswordForm.insertBefore(alertDiv, changePasswordForm.lastElementChild);
    }

    function clearErrors() {
        const existingAlerts = changePasswordForm.querySelectorAll('.alert-danger');
        existingAlerts.forEach(alert => alert.remove());
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function simulateAccountDeletion(password) {
        // Show loading state
        confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting...';
        confirmDeleteBtn.disabled = true;

        // In a real app, you would make an API call here
        console.log("Attempting to delete account...");
        
        // Simulate API call delay
        setTimeout(function() {
            // This would come from your API response in a real app
            const success = true; // Simulate success
            
            if (success) {
                // Show success message
                document.querySelector('#deleteAccountToast .toast-body').innerHTML = 
                    '<i class="bi bi-check-circle me-2"></i> Account deleted successfully!';
                deleteAccountToast.show();
                
                // Reset button state
                confirmDeleteBtn.innerHTML = 'Delete Account';
                confirmDeleteBtn.disabled = false;
                
                // Close modal and redirect after delay
                deleteAccountModal.hide();
                setTimeout(() => {
                    window.location.href = '../html/login.html?accountDeleted=true';
                }, 1500);
            } else {
                showDeleteError("Incorrect password");
                confirmDeleteBtn.innerHTML = 'Delete Account';
                confirmDeleteBtn.disabled = false;
            }
        }, 1500);
    }

    function showDeleteError(message) {
        // Remove any existing error alerts
        clearDeleteErrors();
        
        // Create error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger mt-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
        
        // Insert before the form's submit button
        deleteAccountForm.insertBefore(alertDiv, deleteAccountForm.lastElementChild);
    }

    function clearDeleteErrors() {
        const existingAlerts = deleteAccountForm.querySelectorAll('.alert-danger');
        existingAlerts.forEach(alert => alert.remove());
    }

    const reviewModal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Make each activity item clickable
    document.querySelectorAll('.activity-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
        // Get data from the clicked item
        const movieImg = this.querySelector('.activity-movie-img').src;
        const movieTitle = this.querySelector('.activity-movie-title').textContent;
        const movieInfo = this.querySelector('.activity-movie-info').textContent;
        const movieRating = this.querySelector('.text-warning').innerHTML;
        const movieReview = this.querySelector('.small.text').textContent;
        const reviewDate = this.querySelector('.activity-date').textContent;
        
        // Populate modal with data
        document.getElementById('modalMovieImage').src = movieImg;
        document.getElementById('modalMovieTitle').textContent = movieTitle;
        document.getElementById('modalMovieInfo').textContent = movieInfo;
        document.getElementById('modalMovieRating').innerHTML = movieRating;
        document.getElementById('modalMovieReview').textContent = movieReview;
        document.getElementById('modalReviewDate').textContent = reviewDate;
        
        // Show the modal
        reviewModal.show();
        });
    });


  });