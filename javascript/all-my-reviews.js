document.addEventListener('DOMContentLoaded', async function() {
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));

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

    // Fetch user reviews from backend
    async function fetchUserReviews() {
        const token = getToken();
        if (!token) {
            console.error('No token found, redirecting to login');
            window.location.href = '/login.html';
            return [];
        }

        console.log('🔵 Fetching all user reviews with token:', token.substring(0, 20) + '...');

        try {
            const response = await fetch('/api/profile/reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response not ok:', response.status, errorText);
                throw new Error(`Failed to fetch reviews: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ All user reviews fetched:', data.reviews);
            return data.reviews || [];
        } catch (err) {
            console.error('❌ Error fetching reviews:', err);
            console.error('❌ Error details:', err.message);
            return [];
        }
    }

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
                    // Reset modal scroll position
                    document.querySelector('.modal-body').scrollTop = 0;
                    
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

    // Function to render ALL reviews
    function renderAllReviews(reviews) {
        const container = document.getElementById('all-reviews-container');
        if (!container) {
            console.error('All reviews container not found!');
            return;
        }
        
        console.log('Rendering all reviews:', reviews);
        container.innerHTML = '';
        
        // Store the reviews globally for click handler access
        window.renderedReviews = reviews;
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-chat-square-text" style="font-size: 3rem; color: #6c757d;"></i>
                    <h4 class="mt-3 text-muted">No reviews yet</h4>
                    <p class="text-muted">Start reviewing movies to see them here!</p>
                    <a href="/movies.html" class="btn btn-primary">Browse Movies</a>
                </div>
            `;
            return;
        }
        
        // Sort by date (newest first)
        const sortedReviews = [...reviews].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        sortedReviews.forEach(review => {
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

        console.log('All reviews rendered, attaching click handlers...');
        attachReviewClickHandlers();
    }

    // Show loading state initially
    function showLoadingState() {
        const container = document.getElementById('all-reviews-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">Loading your reviews...</p>
                </div>
            `;
        }
    }

    // Show error state
    function showErrorState(error) {
        const container = document.getElementById('all-reviews-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-file-earmark-x" style="font-size: 3rem; color:rgba(205, 205, 205, 0.58);"></i>
                    <h6 class="mt-1 text-secondary">No reviews submitted yet</h6>
                    <p class="text-muted">${error}</p>
                </div>
            `;
        }
    }

    // Initialize: Fetch and render all reviews
    async function initializePage() {
        showLoadingState();
        
        try {
            const userReviews = await fetchUserReviews();
            if (userReviews.length === 0 && window.renderedReviews === undefined) {
                // This means there was an error fetching reviews
                showErrorState('');
                return;
            }
            renderAllReviews(userReviews);
        } catch (error) {
            console.error('Failed to initialize page:', error);
            showErrorState('Failed to load reviews. Please try again later.');
        }
    }

    // Start the initialization
    initializePage();
});