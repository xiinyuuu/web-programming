document.addEventListener('DOMContentLoaded', function() {
    // Create and inject the modal HTML
    const modalHTML = `
        <div class="modal fade" id="signOutModal" tabindex="-1" aria-labelledby="signOutModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" style="height: fit-content; width: fit-content;">
                <div class="modal-content p-1">
                    <div class="modal-body mt-1 justify-content-center text-center">
                        <p style="font-size: 1.2rem;">Are you sure you want to sign out?</p>
                        <button type="button" class="btn btn-secondary justify-content-center me-1" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-outline-danger justify-content-center ms-1" id="signOutBtn">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inject the modal HTML
    const container = document.getElementById('signout-modal-container');
    container.innerHTML = modalHTML;
    
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
});