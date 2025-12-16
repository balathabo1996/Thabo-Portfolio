/**
 * Contact Form Handler
 * 
 * Handles contact form submission using AJAX to send data to Formspree.
 * Displays success/error messages in a modal popup.
 * 
 * @file contact.js
 * @requires DOM
 */

/**
 * Initialize contact form when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('form-status');

    // Only proceed if contact form exists on the page
    if (form) {
        /**
         * Handle form submission
         * @param {Event} ev - Submit event
         */
        form.addEventListener('submit', function (ev) {
            // Prevent default form submission (page reload)
            ev.preventDefault();

            // Collect form data
            const data = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.innerText;

            // Update button to show loading state
            button.innerText = 'Sending...';
            button.disabled = true;

            /**
             * Send form data to Formspree using Fetch API
             */
            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                let message = "";
                let typeClass = "";

                if (response.ok) {
                    // Success: Show success message and reset form
                    message = "Thanks for your message! I'll get back to you soon.";
                    typeClass = "success";
                    form.reset();
                    showModal('Success!', message, '✅');
                } else {
                    // Error: Parse error messages from response
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            message = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            message = "Oops! There was a problem submitting your form";
                        }
                        showModal('Error', message, '❌');
                    });
                }
            }).catch(error => {
                // Network error or other exception
                showModal('Error', "Oops! There was a problem submitting your form", '❌');
            }).finally(() => {
                // Restore button to original state
                button.innerText = originalText;
                button.disabled = false;
            });
        });
    }

    /**
     * Show Modal Popup
     * 
     * Creates and displays a modal overlay with a message.
     * Modal can be closed by clicking the close button or clicking outside.
     * 
     * @param {string} title - Modal title
     * @param {string} message - Modal message content
     * @param {string} icon - Emoji icon to display
     */
    function showModal(title, message, icon) {
        // Create modal overlay element
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        // Set modal HTML content
        modal.innerHTML = `
            <div class="modal-card">
                <span class="modal-icon">${icon}</span>
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <button class="btn-modal-close">Close</button>
            </div>
        `;

        // Add modal to page
        document.body.appendChild(modal);

        // Close button functionality
        const closeBtn = modal.querySelector('.btn-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });

        // Close when clicking outside the modal card
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }
});
