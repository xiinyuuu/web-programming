document.addEventListener('DOMContentLoaded', async function() {

    // Initialize Bootstrap toasts
    const logoutToast = new bootstrap.Toast(document.getElementById('logoutToast'), { delay: 3000 });
    const updateToast = new bootstrap.Toast(document.getElementById('updateToast'), { delay: 3000 });
    const updateProfilePicToast = new bootstrap.Toast(document.getElementById('updateProfilePicToast'), { delay: 3000 });
    const updatePasswordToast = new bootstrap.Toast(document.getElementById('updatePasswordToast'), { delay: 3000 });
    const deactivateAccountToast = new bootstrap.Toast(document.getElementById('deactivateAccountToast'), { delay: 3000 });
    const deleteAccountToast = new bootstrap.Toast(document.getElementById('deleteAccountToast'), { delay: 3000 });
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));

    // Inside profile.js (remove the myReviews array)
    const myReviews = window.myReviews || []; // Fallback to empty array if not loaded yet

    // Check if we should show logout toast (from URL parameter)
    if (window.location.search.includes('logout=true')) {
        logoutToast.show();
    }

    // Helper: Get JWT token from localStorage
    function getToken() {
        return localStorage.getItem('movrec_token');
    }

    console.log('Token being used:', getToken());

    // Fetch profile data from backend
    async function fetchProfile() {
        const token = getToken();
        if (!token) return null;
        try {
            const res = await fetch('/api/profile', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // Render profile header with user data
    function renderProfileHeader(user) {
        document.getElementById('displayName').textContent = user.username;
        document.getElementById('displayEmail').textContent = user.email;
        // Update profile picture everywhere it's used
        document.getElementById('displayProfilePic').src = user.profilePic || '../images/profile.jpg';
        const navProfileImg = document.querySelector('.profile-img');
        if (navProfileImg) navProfileImg.src = user.profilePic || '../images/profile.jpg';
        // Set stats if you add them to the backend
        // ...
        document.getElementById('editName').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('profilePicPreview').src = user.profilePic || '../images/profile.jpg';
    }

    // Fetch and render user profile from backend
    const user = await fetchProfile();
    if (user) {
        renderProfileHeader(user);
    }

    console.log('Fetched user:', user);

    // Function to generate star ratings
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="bi bi-star-fill"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="bi bi-star"></i>';
        }
        
        return stars;
    }

    // Function to attach click handlers to reviews
    function attachReviewClickHandlers() {
        document.querySelectorAll('.activity-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                const reviewId = parseInt(this.getAttribute('data-review-id'));
                const review = myReviews.find(r => r.id === reviewId);
                
                if (review) {
                    document.getElementById('modalMovieImage').src = review.image;
                    document.getElementById('modalMovieTitle').textContent = review.title;
                    document.getElementById('modalMovieInfo').textContent = review.info;
                    document.getElementById('modalMovieDuration').textContent = review.duration;
                    document.getElementById('modalMovieRating').innerHTML = generateStars(review.rating);
                    document.getElementById('modalMovieReview').textContent = review.review;
                    document.getElementById('modalReviewDate').textContent = review.date;
                    
                    reviewModal.show();
                }
            });
        });
    }

    // Function to render reviews
    function renderProfileReviews() {
        const container = document.getElementById('reviews-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Sort by date (newest first) and take first 3
        const latestReviews = [...myReviews]
            .sort((a, b) => {
                // Simple date comparison for "X days/weeks ago" format
                if (a.date.includes('day') && !b.date.includes('day')) return -1;
                if (!a.date.includes('day') && b.date.includes('day')) return 1;
                return parseInt(a.date) - parseInt(b.date);
            })
            .slice(0, 3);
        
        latestReviews.forEach(review => {
            container.innerHTML += `
                <div class="activity-item" data-review-id="${review.id}">
                    <span class="activity-date">${review.date}</span>
                    <div class="activity-content">
                        <img src="${review.image}" alt="${review.title}" class="activity-movie-img">
                        <div>
                            <div class="activity-movie-title">${review.title}</div>
                            <div class="activity-movie-info">${review.info}</div>
                            <div class="text-warning mb-1">${generateStars(review.rating)}</div>
                            <p class="small text activity-movie-review">"${review.review}"</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        attachReviewClickHandlers();
    }

    // Initialize reviews
    renderProfileReviews();

    // Initialize the profile with current user data
    function initializeProfile() {
        document.getElementById('displayName').textContent = currentUser.name;
        document.getElementById('displayEmail').textContent = currentUser.email;
        document.getElementById('displayProfilePic').src = currentUser.profilePic;
        document.querySelector('.profile-img').src = currentUser.profilePic;
        
        // Set profile stats
        const statValues = document.querySelectorAll('.stat-value');
        statValues[0].textContent = currentUser.stats.moviesWatched;
        statValues[1].textContent = currentUser.stats.reviews;
        statValues[2].textContent = currentUser.stats.watchlist;

        
        // Set initial values in edit modal
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email;
        document.getElementById('profilePicPreview').src = currentUser.profilePic;
    }

    // Call the initialization function
    initializeProfile();

    // Edit Profile Modal
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', async function() {
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const token = getToken();
        try {
          const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username: newName, email: newEmail })
          });
          if (!response.ok) throw new Error('Failed to update profile');
          const updatedUser = await response.json();
          renderProfileHeader(updatedUser);
          updateToast.show();
          editProfileModal.hide();
        } catch (err) {
          alert('Failed to update profile: ' + err.message);
        }
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
      saveProfilePicBtn.addEventListener('click', async function() {
        if (profilePicPreview.src) {
          const token = getToken();
          try {
            const response = await fetch('/api/profile/profile-pic', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({ profilePic: profilePicPreview.src })
            });
            if (!response.ok) throw new Error('Failed to update profile picture');
            const updatedUser = await response.json();
            renderProfileHeader(updatedUser);
            updateProfilePicToast.show();
            profilePicModal.hide();
          } catch (err) {
            alert('Failed to update profile picture: ' + err.message);
          }
        }
      });
    }
  
    // Change Password Modal
    const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm && changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async function() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (!currentPassword || !newPassword || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            if (newPassword.length < 8) {
                showError('Password must be at least 8 characters');
                return;
            }
            if (newPassword !== confirmPassword) {
                showError("New passwords don't match");
                return;
            }
            const token = getToken();
            try {
                const response = await fetch('/api/profile/password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });
                const result = await response.json();
                if (response.ok) {
                    updatePasswordToast.show();
                    changePasswordModal.hide();
                    changePasswordForm.reset();
                } else {
                    showError(result.message || 'Failed to update password');
                }
            } catch (err) {
                showError('Server error. Please try again.');
            }
        });
        changePasswordModal._element.addEventListener('show.bs.modal', function() {
            clearErrors();
            changePasswordForm.reset();
        });
    }
    
    // Deactivate Account Modal
    const deactivateAccountModal = new bootstrap.Modal(document.getElementById('deactivateAccountModal'));
    const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
    if (confirmDeactivateBtn) {
        confirmDeactivateBtn.addEventListener('click', async function() {
            const token = getToken();
            try {
                const response = await fetch('/api/profile/deactivate', {
                    method: 'PUT',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const result = await response.json();
                if (response.ok) {
                    deactivateAccountToast.show();
                    setTimeout(() => {
                        // Log out and redirect to login
                        localStorage.clear();
                        window.location.href = 'login.html?accountDeactivated=true';
                    }, 1500);
                } else {
                    alert(result.message || 'Failed to deactivate account');
                }
            } catch (err) {
                alert('Server error. Please try again.');
            }
        });
    }

    // Delete Account Modal
    const deleteAccountModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (deleteAccountForm && confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            const password = document.getElementById('deletePassword').value;
            if (!password) {
                showDeleteError('Please enter your password');
                return;
            }
            if (!confirm('Are you absolutely sure you want to delete your account? This cannot be undone!')) {
                return;
            }
            const token = getToken();
            try {
                const response = await fetch('/api/profile', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ password })
                });
                const result = await response.json();
                if (response.ok) {
                    deleteAccountToast.show();
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.href = 'login.html?accountDeleted=true';
                    }, 1500);
                } else {
                    showDeleteError(result.message || 'Failed to delete account');
                }
            } catch (err) {
                showDeleteError('Server error. Please try again.');
            }
        });

        // Clear validation errors when modal is shown
        deleteAccountModal._element.addEventListener('show.bs.modal', function() {
            clearDeleteErrors();
            deleteAccountForm.reset();
        });
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

    // Make each activity item clickable
    document.querySelectorAll('.activity-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
        // Get data from the clicked item
        const movieImg = this.querySelector('.activity-movie-img').src;
        const movieTitle = this.querySelector('.activity-movie-title').textContent;
        const movieInfo = this.querySelector('.activity-movie-info').textContent;
        const movieDuration = this.querySelector('.activity-movie-duration').textContent;
        const movieRating = this.querySelector('.text-warning').innerHTML;
        const movieReview = this.querySelector('.small.text').textContent;
        const reviewDate = this.querySelector('.activity-date').textContent;
        
        // Populate modal with data
        document.getElementById('modalMovieImage').src = movieImg;
        document.getElementById('modalMovieTitle').textContent = movieTitle;
        document.getElementById('modalMovieInfo').textContent = movieInfo;
        document.getElementById('modalMovieDuration').textContent = movieDuration;
        document.getElementById('modalMovieRating').innerHTML = movieRating;
        document.getElementById('modalMovieReview').textContent = movieReview;
        document.getElementById('modalReviewDate').textContent = reviewDate;
        
        // Show the modal
        reviewModal.show();
        });
    });
});