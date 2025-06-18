// Shared user status management
async function checkAndUpdateUserStatus() {
    const userData = localStorage.getItem('movrec_user');
    if (!userData) return null;

    try {
        const user = JSON.parse(userData);
        if (!user.token) return null;

        // Make a request to verify and update user status
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('movrec_user');
                localStorage.removeItem('userId');
                window.location.href = '/login.html';
                return null;
            }
            throw new Error('Failed to verify user status');
        }

        const updatedUser = await response.json();
        
        // Update localStorage with verified user data
        localStorage.setItem('movrec_user', JSON.stringify({
            ...user,
            ...updatedUser,
            deactivated: false // Ensure deactivated is always false when verified
        }));

        return updatedUser;
    } catch (err) {
        console.error('Error checking user status:', err);
        return null;
    }
}

// Check user status when page loads
document.addEventListener('DOMContentLoaded', checkAndUpdateUserStatus);

// Export for use in other files
window.checkAndUpdateUserStatus = checkAndUpdateUserStatus; 