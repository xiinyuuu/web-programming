
// Add an event listener to the form with id="login-form"
document.getElementById('login-form').addEventListener('submit', function(event) {
    // Prevent the form from reloading the page
    event.preventDefault();

    // Get user input from the form fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // --- IMPORTANT: DEMONSTRATION ONLY ---
    // In a real application, this validation would happen on a server.
    // For now, we use a simple hardcoded username and password.
    const correctUsername = 'user';
    const correctPassword = 'password123';

    if (username === correctUsername && password === correctPassword) {
        // If login is successful
        alert('Login successful!');

        // 1. Set a flag in sessionStorage to remember the user is logged in.
        // This data is cleared when the browser tab is closed.
        sessionStorage.setItem('isLoggedIn', 'true');

        // 2. Redirect the user to the home page.
        window.location.href = 'home.html';

    } else {
        // If login fails
        alert('Invalid username or password.');
    }
});