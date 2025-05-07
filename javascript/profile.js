document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap toasts
    const logoutToast = new bootstrap.Toast(document.getElementById('logoutToast'));
    const updateToast = new bootstrap.Toast(document.getElementById('updateToast'));
    const updateProfilePicToast = new bootstrap.Toast(document.getElementById('updateProfilePicToast'));
    const updatePasswordToast = new bootstrap.Toast(document.getElementById('updatePasswordToast'));
    const deleteAccountToast = new bootstrap.Toast(document.getElementById('deleteAccountToast'));
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));

    // Check if we should show logout toast (from URL parameter)
    if (window.location.search.includes('logout=true')) {
        logoutToast.show();
    }

    // Initialize current user data
    const currentUser = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        profilePic: "../images/sad cat.png",
        stats: {
            moviesWatched: 42,
            reviews: 16,
            watchlist: 8
        }
    };

    // Review data
    const myReviews = [
        {
            id: 1,
            title: "Interstellar",
            info: "Sci-Fi, Adventure • 2014",
            image: "../images/interstellar.jpg",
            rating: 4.5,
            review: "Nolan is simply the Picasso of film industry",
            date: "2 days ago"
        },
        {
            id: 2,
            title: "Barbie",
            info: "Comedy, Adventure • 2023",
            image: "../images/barbie.jpg",
            rating: 3,
            review: "This movie just slay. Absolute 10/10",
            date: "1 week ago"
        },
        {
            id: 3,
            title: "Mulan",
            info: "Action, Drama • 2020",
            image: "../images/mulan.jpg",
            rating: 3,
            review: "Visually impressive but lacking the heart of the original",
            date: "2 weeks ago"
        },
        {
            id: 9,
            title: "Maleficent",
            info: "Action, Drama • 2020",
            image: "../images/maleficent.jpeg",
            rating: 3,
            review: "A dark twist on a classic tale, with stunning visuals and a very powerful performance by Angelina Jolie.",
            date: "1 day ago"
        }
    ];

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
      saveProfileBtn.addEventListener('click', function() {
        // Update current user data
        currentUser.name = document.getElementById('editName').value;
        currentUser.email = document.getElementById('editEmail').value;

        // Update the display
        initializeProfile();
        
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
          // Update current user data
          currentUser.profilePic = profilePicPreview.src;
                
          // Update the display
          initializeProfile();
          
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

            // Here should make an API call to the backend to make sure the current password is correct
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

            // Here should make an API call to the backend to make sure the password is correct
            simulateAccountDeletion(password);
        });

        // Clear validation errors when modal is shown
        deleteAccountModal._element.addEventListener('show.bs.modal', function() {
            clearDeleteErrors();
            deleteAccountForm.reset();
        });
    }

    // Change Password Functionality
    function simulatePasswordChange(currentPassword, newPassword) {
        // Make an API call here
        console.log("Attempting to change password...");
        
        // Simulate API call delay
        setTimeout(function() {
            // This would come from API response in a real app
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

    // Delete Account Functionality
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