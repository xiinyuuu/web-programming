document.addEventListener('DOMContentLoaded', () => {
    // 1. Find the placeholder div
    const navbarPlaceholder = document.querySelector("#navbar-placeholder");

    if (navbarPlaceholder) {
        // 2. Fetch the navbar HTML and load it into the placeholder
        fetch('/navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                // 3. After the navbar is loaded, update the user-specific content
                updateUserNav();
            });
    }

    function updateUserNav() {
        const userString = localStorage.getItem('movrec_user');
        let user = null;

        if (userString) {
            try {
                user = JSON.parse(userString);
            } catch (e) {
                console.error("Failed to parse user data:", e);
                localStorage.clear(); // Clear corrupted data
            }
        }

        // Check for a logged-in, non-deactivated user
        if (user && user.isLoggedIn && !user.deactivated) {
            const profileImageElement = document.querySelector('.profile-img');
            
            if (profileImageElement) {
                // Update the profile picture source
                profileImageElement.src = user.profilePic || '/images/profile.jpg'; // Fallback to default
                profileImageElement.style.display = 'block'; // Make the image visible
            }
        } else {
            // Optional: If user is not logged in, you could hide the profile link/image
            // or redirect to login. For now, we'll just ensure the default image is hidden.
            const profileLink = document.querySelector('#user-nav-section a');
            if (profileLink) {
                 // You could redirect or change this link to a login button if desired
                 // e.g., profileLink.href = '/login.html';
                 // For now, it just won't show a custom picture.
            }
        }
    }
});