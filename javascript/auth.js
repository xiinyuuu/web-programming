// This script acts as a gatekeeper for protected pages.
const userString = localStorage.getItem('movrec_user');
let user = null;

// Try to parse the user data from the string.
try {
    if (userString) {
        user = JSON.parse(userString);
    }
} catch (error) {
    console.error("Error parsing user data from localStorage", error);
    // If data is corrupted, clear it to be safe and force a re-login.
    localStorage.clear();
}

// A user is NOT authenticated if:
// 1. The user object doesn't exist.
// 2. The user object exists but the isLoggedIn flag is not true.
// 3. The user's account has been deactivated.
if (!user || !user.isLoggedIn || user.deactivated) {

    // Save the page the user was trying to access.
    // Your login script can use this to redirect them back after they log in.
    sessionStorage.setItem('redirectAfterLogin', window.location.href);

    // If any check fails, alert and redirect to the login page.
    alert('You must be logged in to view this page.');
    window.location.href = 'login.html'; // All HTML files are in the same folder.
}