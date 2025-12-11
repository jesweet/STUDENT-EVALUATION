// Custom Modal System for EduMetrics
// Provides reusable alert and confirm modal functions

// Show custom alert modal with OK button
function showCustomAlert(title, message) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) {
        // Fallback to regular alert if modal container doesn't exist
        alert(`${title}\n\n${message}`);
        return;
    }

    // Create modal HTML
    modalContainer.innerHTML = `
        <div class="custom-modal-overlay">
            <div class="modal-box">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-primary" onclick="closeCustomModal()">OK</button>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modalContainer.className = 'modal-visible';
    
    // Focus on OK button for accessibility
    setTimeout(() => {
        const okButton = modalContainer.querySelector('.modal-btn-primary');
        if (okButton) okButton.focus();
    }, 100);
}

// Show custom confirm modal with Cancel and Confirm buttons
function showCustomConfirm(title, message, onConfirm) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) {
        // Fallback to regular confirm if modal container doesn't exist
        const result = confirm(`${title}\n\n${message}`);
        if (result && typeof onConfirm === 'function') {
            onConfirm();
        }
        return;
    }

    // Create modal HTML
    modalContainer.innerHTML = `
        <div class="custom-modal-overlay">
            <div class="modal-box">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-secondary" onclick="closeCustomModal()">Cancel</button>
                    <button class="modal-btn modal-btn-primary" onclick="confirmCustomModal()">Confirm</button>
                </div>
            </div>
        </div>
    `;

    // Store the confirm callback
    window.modalConfirmCallback = onConfirm;
    
    // Show modal
    modalContainer.className = 'modal-visible';
    
    // Focus on Confirm button for accessibility
    setTimeout(() => {
        const confirmButton = modalContainer.querySelector('.modal-btn-primary');
        if (confirmButton) confirmButton.focus();
    }, 100);
}

// Close custom modal
function closeCustomModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) {
        modalContainer.className = 'modal-hidden';
        modalContainer.innerHTML = '';
    }
    // Clear callback
    window.modalConfirmCallback = null;
}

// Handle confirm button click
function confirmCustomModal() {
    // Execute callback if it exists
    if (typeof window.modalConfirmCallback === 'function') {
        window.modalConfirmCallback();
    }
    // Close modal
    closeCustomModal();
}

// Close modal when clicking outside the modal box
function closeModalOnOverlayClick(event) {
    if (event.target.classList.contains('custom-modal-overlay')) {
        closeCustomModal();
    }
}

// Close modal with Escape key
function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeCustomModal();
    }
}

// Initialize modal event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) {
        // Add event listeners for modal interactions
        modalContainer.addEventListener('click', closeModalOnOverlayClick);
        document.addEventListener('keydown', handleModalKeydown);
    }
});