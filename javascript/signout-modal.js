document.addEventListener('DOMContentLoaded', function() {
    // Load the modal HTML
    fetch('/signout-modal.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Inject the modal HTML
            const container = document.getElementById('signout-modal-container');
            container.innerHTML = html;
            
            // Initialize Bootstrap modal
            const signOutModal = new bootstrap.Modal(document.getElementById('signOutModal'));
            
            // Get the trigger button
            const triggerBtn = document.getElementById('triggerSignOutModal');
            
            // Get the confirmation ("Yes") button from the modal
            const confirmSignOutBtn = document.getElementById('signOutBtn');
            
            // Show modal when trigger button is clicked
            triggerBtn.addEventListener('click', function(e) {
                e.preventDefault();
                signOutModal.show();
            });
            
            // Handle confirmation
            confirmSignOutBtn.addEventListener('click', function() {
                window.location.href = '/login.html?logout=true';
            });
        })
        .catch(error => {
            console.error('Error loading signout modal:', error);
            // Fallback: redirect directly if modal fails to load
            document.getElementById('triggerSignOutModal').addEventListener('click', function() {
                window.location.href = '/login.html?logout=true';
            });
        });
});