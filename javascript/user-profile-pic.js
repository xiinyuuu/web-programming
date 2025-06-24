// Utility to update navbar profile picture from user data (fetches from backend like profile.js)
(function() {
  document.addEventListener('DOMContentLoaded', async function() {
    const profileImgs = document.querySelectorAll('.profile-img');
    if (!profileImgs.length) return;

    // Helper: Get JWT token from localStorage
    function getToken() {
      const userData = localStorage.getItem('movrec_user');
      if (!userData) return null;
      try {
        const parsed = JSON.parse(userData);
        return parsed.token;
      } catch (e) {
        return null;
      }
    }

    const token = getToken();
    if (!token) return;

    try {
      // Fetch profile from backend
      const profileRes = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!profileRes.ok) throw new Error('Profile fetch failed');
      const user = await profileRes.json();

      // Set profile image (like profile.js)
      const profilePicUrl = user.profilePic && user.profilePic.trim() !== '' ? user.profilePic : '/images/profile.jpg';
      profileImgs.forEach(img => {
        img.src = profilePicUrl;
      });
    } catch (err) {
      // On error, fallback to default
      profileImgs.forEach(img => {
        img.src = '/images/profile.jpg';
      });
    }
  });
})(); 