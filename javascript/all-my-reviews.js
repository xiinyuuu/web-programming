document.addEventListener('DOMContentLoaded', function() {
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));

    // Review data (same as in profile.js)
    const userReviews = [
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
            title: "Amazing Spiderman",
            info: "Action, Drama • 2020",
            image: "../images/amazingspiderman.jpg",
            rating: 4.5,
            review: "We love ANDREW GARFIELD <3",
            date: "2 weeks ago"
        },
        {
            id: 4,
            title: "Black Panther",
            info: "Action, Drama • 2020",
            image: "../images/blackpanther.jpg",
            rating: 4.5,
            review: "Wakanda forever!",
            date: "2 weeks ago"
        },
        {
            id: 5,
            title: "Cruella",
            info: "Action, Drama • 2020",
            image: "../images/cruella.jpg",
            rating: 2,
            review: "Emma Stone is a queen!",
            date: "2 weeks ago"
        },
        {
            id: 6,
            title: "Doctor Strange",
            info: "Action, Drama • 2020",
            image: "../images/doctorstrange.jpg",
            rating: 5,
            review: "Doctor Strange is a must-watch for Marvel fans!",
            date: "2 weeks ago"
        },
        {
            id: 7,
            title: "Enola Holmes",
            info: "Action, Drama • 2020",
            image: "../images/enolaholmes.webp",
            rating: 1.2,
            review: "Millie Bobby Brown is a star!",
            date: "2 weeks ago"
        },
        {
            id: 8,
            title: "Five Feet Apart",
            info: "Action, Drama • 2020",
            image: "../images/fivefeetapart.jpg",
            rating: 1,
            review: "I cried so much watching this movie...",
            date: "2 weeks ago"
        },
        {
            id: 9,
            title: "Maleficent",
            info: "Action, Drama • 2020",
            image: "../images/maleficent.jpeg",
            rating: 5,
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

    // // Function to attach click handlers to reviews
    // function attachReviewClickHandlers() {
    //     document.querySelectorAll('.activity-item').forEach(item => {
    //         item.style.cursor = 'pointer';
    //         item.addEventListener('click', function() {
    //             const reviewId = parseInt(this.getAttribute('data-review-id'));
    //             const review = userReviews.find(r => r.id === reviewId);
                
    //             if (review) {
    //                 document.getElementById('modalMovieImage').src = review.image;
    //                 document.getElementById('modalMovieTitle').textContent = review.title;
    //                 document.getElementById('modalMovieInfo').textContent = review.info;
    //                 document.getElementById('modalMovieRating').innerHTML = generateStars(review.rating);
    //                 document.getElementById('modalMovieReview').textContent = review.review;
    //                 document.getElementById('modalReviewDate').textContent = review.date;
                    
    //                 reviewModal.show();
    //             }
    //         });
    //     });
    // }



    // Update your attachReviewClickHandlers function to:
function attachReviewClickHandlers() {
    document.querySelectorAll('.activity-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const reviewId = parseInt(this.getAttribute('data-review-id'));
            const review = userReviews.find(r => r.id === reviewId);
            
            if (review) {
                // Reset modal scroll position
                document.querySelector('.modal-body').scrollTop = 0;
                
                // Populate modal
                document.getElementById('modalMovieImage').src = review.image;
                document.getElementById('modalMovieTitle').textContent = review.title;
                document.getElementById('modalMovieInfo').textContent = review.info;
                document.getElementById('modalMovieRating').innerHTML = generateStars(review.rating);
                document.getElementById('modalMovieReview').textContent = review.review;
                document.getElementById('modalReviewDate').textContent = review.date;
                
                // Show modal
                reviewModal.show();
            }
        });
    });
}

    // Function to render ALL reviews
    function renderAllReviews() {
        const container = document.getElementById('all-reviews-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Sort by date (newest first)
        const sortedReviews = [...userReviews].sort((a, b) => {
            // Simple date comparison for "X days/weeks ago" format
            if (a.date.includes('day') && !b.date.includes('day')) return -1;
            if (!a.date.includes('day') && b.date.includes('day')) return 1;
            return parseInt(a.date) - parseInt(b.date);
        });
        
        sortedReviews.forEach(review => {
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

    // Initialize all reviews
    renderAllReviews();

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