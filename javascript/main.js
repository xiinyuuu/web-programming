// This script handles the login/logout functionality for the MovRec application.
// It checks if a user is logged in and updates the login/logout link accordingly.
document.addEventListener('DOMContentLoaded', function() {
    const loginLogoutLink = document.getElementById('login-logout-link');

    // If the login/logout link doesn't exist on the page, stop.
    if (!loginLogoutLink) {
        return;
    }

    // Check for the user data in localStorage.
    const userString = localStorage.getItem('movrec_user');
    let user = null;
    try {
        if (userString) {
            user = JSON.parse(userString);
        }
    } catch (e) {
        user = null;
    }

    // If a valid, logged-in, non-deactivated user exists...
    if (user && user.isLoggedIn && !user.deactivated) {
    
        // Find all profile images in the navbar (using a class is safer).
        const profileImages = document.querySelectorAll('.profile-img');

        if (profileImages.length > 0) {
            // Use an ABSOLUTE path for the fallback image for consistency.
            const newProfilePicUrl = user.profilePic || '/images/profile.jpg';
            profileImages.forEach(img => {
                img.src = newProfilePicUrl;
            });
        }

        // ...change the link to a "Logout" button.
        loginLogoutLink.textContent = 'Logout';
        loginLogoutLink.href = '#';

        // Add the logout functionality.
        loginLogoutLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Clear all user data from storage.
            localStorage.removeItem('movrec_user');
            localStorage.removeItem('userId');
            sessionStorage.clear(); // Clear any leftover session data.

            alert('You have been successfully logged out.');
            window.location.href = 'login.html';
        });
    } else {
        // If no valid user is found, ensure the link is a "Login" link.
        loginLogoutLink.textContent = 'Login';
        loginLogoutLink.href = 'login.html';
    }
});