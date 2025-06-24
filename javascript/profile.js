// Find this existing event listener in your profile.js file

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
        const userData = localStorage.getItem('movrec_user');
        if (!userData) return null;
        try {
            const parsed = JSON.parse(userData);
            return parsed.token;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }

    console.log('Token being used:', getToken());

    // Fetch profile data from backend
    async function fetchProfile() {
        const token = getToken();
        if (!token) {
            console.error('No token found, redirecting to login');
            window.location.href = '/login.html';
            return null;
        }

        console.log('🔵 Fetching profile with token:', token);

        try {
            // First verify token
            const verifyRes = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!verifyRes.ok) {
                console.error('❌ Token verification failed:', verifyRes.status);
                localStorage.removeItem('movrec_user');
                localStorage.removeItem('userId');
                window.location.href = '/login.html';
                return null;
            }

            const verifiedUser = await verifyRes.json();
            console.log('✅ Token verified, user:', verifiedUser);

            // Then fetch profile
            const profileRes = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!profileRes.ok) {
                throw new Error(`Profile fetch failed: ${profileRes.status}`);
            }

            const profileData = await profileRes.json();
            console.log('✅ Profile data fetched:', profileData);

            // Update localStorage with verified user data
            const userData = JSON.parse(localStorage.getItem('movrec_user') || '{}');
            localStorage.setItem('movrec_user', JSON.stringify({
                ...userData,
                ...verifiedUser,
                deactivated: false,
                id: profileData._id,
                username: profileData.username,
                email: profileData.email
            }));

            return profileData;
        } catch (err) {
            console.error('❌ Error fetching profile:', err);
            return null;
        }
    }

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }

    // Function to render reviews
    function renderProfileReviews(reviews) {
        const container = document.getElementById('reviews-container');
        if (!container) {
            console.error('Reviews container not found!');
            return;
        }
        
        console.log('Rendering reviews:', reviews);
        console.log('Review IDs in array:', reviews.map(r => r.id));
        container.innerHTML = '';
        
        // Store the reviews globally for click handler access
        window.renderedReviews = reviews;
        
        reviews.forEach(review => {
            console.log(`Setting data-review-id="${review.id}" for review:`, review.title);
            container.innerHTML += `
                <div class="activity-item" data-review-id="${review.id}">
                    <span class="activity-date">${formatDate(review.date)}</span>
                    <div class="activity-content">
                        <img src="${review.image}" alt="${review.title}" class="activity-movie-img">
                        <div>
                            <div class="activity-movie-title">${review.title}</div>
                            <div class="activity-movie-info">${review.genre} • ${review.year}</div>
                            <div class="text-warning mb-1">${generateStars(review.rating)}</div>
                            <p class="small text activity-movie-review">"${review.review}"</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        console.log('Reviews rendered, attaching click handlers...');
        attachReviewClickHandlers();
    }

    // Render profile header with user data
    function renderProfileHeader(user) {
        if (!user) return;
        
        document.getElementById('displayName').textContent = user.username;
        document.getElementById('displayEmail').textContent = user.email;
        
        // Update profile picture everywhere it's used
        const profilePicUrl = user.profilePic || '../images/profile.jpg';
        document.getElementById('displayProfilePic').src = profilePicUrl;
        document.querySelector('.profile-img').src = profilePicUrl;
        
        const navbarProfileImg = document.querySelector('nav .profile-img');
        if (navbarProfileImg) {
            navbarProfileImg.src = profilePicUrl;
        }
        
        // Update stats
        const statValues = document.querySelectorAll('.stat-value');
        statValues[0].textContent = user.moviesWatchedCount || 0;
        statValues[1].textContent = user.reviewCount || 0;
        statValues[2].textContent = user.watchlist?.length || 0;
        
        // Set initial values in edit modal
        document.getElementById('editName').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('profilePicPreview').src = profilePicUrl;

        // Render reviews if available
        if (user.reviews) {
            console.log('Rendering user reviews:', user.reviews);
            renderProfileReviews(user.reviews);
        } else {
            console.log('No user reviews found, rendering test data');
            // Test with dummy data to ensure click functionality works
            renderProfileReviews([
                {
                    id: 1,
                    title: "Test Movie",
                    genre: "Drama",
                    year: 2023,
                    image: "/images/barbie.webp",
                    rating: 4,
                    review: "This is a test review to verify click functionality.",
                    date: new Date().toISOString()
                }
            ]);
        }
    }

    // Fetch and render user profile from backend
    const user = await fetchProfile();
    if (user) {
        // Update localStorage with latest user data
        const userData = JSON.parse(localStorage.getItem('movrec_user') || '{}');
        localStorage.setItem('movrec_user', JSON.stringify({
            ...userData,
            deactivated: false, // Force deactivated to false when profile is loaded
            id: user._id,
            username: user.username,
            email: user.email
        }));

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
        const activityItems = document.querySelectorAll('.activity-item');
        console.log('Found activity items:', activityItems.length);
        
        activityItems.forEach((item, index) => {
            console.log(`Attaching click handler to item ${index + 1}:`, item);
            const dataReviewId = item.getAttribute('data-review-id');
            console.log(`Item ${index + 1} has data-review-id:`, dataReviewId);
            
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                console.log('Review item clicked!');
                // Use the full string ID instead of parseInt for MongoDB ObjectIds
                const reviewId = this.getAttribute('data-review-id');
                console.log('Review ID:', reviewId);
                
                // Use the globally stored reviews array
                const reviewsArr = window.renderedReviews || [];
                console.log('Available reviews:', reviewsArr);
                console.log('Available review IDs:', reviewsArr.map(r => r.id));
                const review = reviewsArr.find(r => r.id === reviewId);
                
                if (review) {
                    console.log('Found review data:', review);
                    document.getElementById('modalMovieImage').src = review.image;
                    document.getElementById('modalMovieTitle').textContent = review.title;
                    document.getElementById('modalMovieInfo').textContent = review.info || (review.genre ? `${review.genre} • ${review.year}` : '');
                    document.getElementById('modalMovieDuration').textContent = review.duration || '';
                    document.getElementById('modalMovieRating').innerHTML = generateStars(review.rating);
                    document.getElementById('modalMovieReview').textContent = review.review;
                    document.getElementById('modalReviewDate').textContent = formatDate(review.date);
                    
                    console.log('Showing review modal...');
                    reviewModal.show();
                } else {
                    console.error('Review not found for ID:', reviewId);
                    console.error('Available IDs:', reviewsArr.map(r => r.id));
                }
            });
        });
        
        console.log('Click handlers attached to', activityItems.length, 'items');
    }

    // Edit Profile Modal
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', async function() {
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const token = getToken();
        
        if (!token) {
            alert('Please log in again');
            window.location.href = '/login.html';
            return;
        }

        try {
          const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username: newName, email: newEmail })
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
          }
          const updatedUser = await response.json();
          
          // Only update the specific fields that were changed
          // This preserves the existing reviews and other profile data
          document.getElementById('displayName').textContent = updatedUser.username;
          document.getElementById('displayEmail').textContent = updatedUser.email;
          
          // Update stored user data
          const userData = JSON.parse(localStorage.getItem('movrec_user') || '{}');
          userData.username = updatedUser.username;
          userData.profilePic = updatedUser.profilePic;
          userData.email = updatedUser.email;

          localStorage.setItem('movrec_user', JSON.stringify(userData));
          
          updateToast.show();
          editProfileModal.hide();
        } catch (err) {
          alert(err.message);
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
              body: JSON.stringify({ image: profilePicPreview.src })
            });
            if (!response.ok) throw new Error('Failed to update profile picture');
            const updatedUser = await response.json();
            
            // Only update the profile picture without re-rendering everything
            // This preserves the existing reviews and other profile data
            const profilePicUrl = updatedUser.profilePic || '../images/profile.jpg';
            document.getElementById('displayProfilePic').src = profilePicUrl;
            document.querySelector('.profile-img').src = profilePicUrl;
            document.getElementById('profilePicPreview').src = profilePicUrl;
            
            // Update stored user data
            const userData = JSON.parse(localStorage.getItem('movrec_user') || '{}');
            userData.profilePic = updatedUser.profilePic;
            localStorage.setItem('movrec_user', JSON.stringify(userData));
            
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
});