/**
 * ContactForm  —  components/ContactForm.jsx
 * ===========================================
 * Interactive client-side contact form powered by react-hook-form.
 * Submissions are sent to the internal API route POST /api/contact via JSON.
 *
 * Fields:
 *   - Name     (required)
 *   - Email    (required, regex validated)
 *   - Subject  (required)
 *   - Message  (required, min 10 characters)
 *
 * Anti-spam:
 *   A hidden honeypot field is included in the form. If a bot fills it in,
 *   the handler silently returns a success response without forwarding the data.
 *
 * After submission a modal overlay appears with either a success or error message.
 * Clicking outside the modal card, or the Close button, dismisses it.
 */
'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

/**
 * ContactForm Component
 * Renders an interactive client-side form using react-hook-form.
 * Submits validated feedback or inquiries via POST to /api/contact.
 * Integrates anti-spam honeypot mechanism to prevent bots.
 * Shows transactional statuses using a dynamic modal dialog.
 *
 * @returns {React.ReactElement} The interactive ContactForm JSX structure
 */
export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [modal, setModal] = useState(null);
  const dialogRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    if (!modal) return;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      submitRef.current?.focus();
    };
  }, [modal]);

  const onSubmit = async (data) => {
    // Honeypot check: if bot fills this hidden field, abort
    if (data.honeypot) {
      console.log('Bot detected');
      setModal({
        icon: '✅',
        title: 'Success!',
        message: "Thanks for your message! I'll get back to you soon.",
      });
      reset();
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setModal({ icon: '✅', title: 'Success!', message: "Thanks for your message! I'll get back to you soon." });
        reset();
      } else {
        const errorMsg = json.errors
          ? json.errors.map((err) => err.message).join(', ')
          : json.error || 'Oops! There was a problem submitting your form';
        setModal({ icon: '❌', title: 'Error', message: errorMsg });
      }
    } catch {
      setModal({
        icon: '❌',
        title: 'Error',
        message: 'Oops! There was a problem submitting your form',
      });
    }
  };

  const closeModal = () => setModal(null);

  return (
    <>
      <form id="contactForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Honeypot field to prevent bot spam */}
        <div style={{ display: 'none' }}>
          <input type="text" {...register('honeypot')} tabIndex="-1" autoComplete="off" />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            aria-label="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={`form-control${errors.name ? ' is-invalid' : ''}`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <div id="contact-name-error" className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Your Email"
            aria-label="Your email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={`form-control${errors.email ? ' is-invalid' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <div id="contact-email-error" className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            aria-label="Subject"
            autoComplete="off"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            className={`form-control${errors.subject ? ' is-invalid' : ''}`}
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && <div id="contact-subject-error" className="invalid-feedback">{errors.subject.message}</div>}
        </div>

        <div className="form-group">
          <textarea
            rows="5"
            placeholder="Message"
            aria-label="Message"
            autoComplete="off"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`form-control${errors.message ? ' is-invalid' : ''}`}
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
            })}
          />
          {errors.message && <div id="contact-message-error" className="invalid-feedback">{errors.message.message}</div>}
        </div>

        <button ref={submitRef} type="submit" className="btn btn-submit d-flex align-items-center justify-content-center" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <i className="fas fa-circle-notch fa-spin me-2"></i>
              Sending…
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane me-2"></i>
              Send Message
            </>
          )}
        </button>
      </form>

      {modal && (
        <dialog
          ref={dialogRef}
          className="contact-modal-overlay"
          aria-labelledby="contact-modal-title"
          aria-describedby="contact-modal-message"
          onCancel={closeModal}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={`contact-modal-card ${modal.title.toLowerCase()}`}>
            <div className="modal-visual">
              <span className="modal-icon">{modal.icon}</span>
            </div>
            <div className="modal-text">
              <h3 id="contact-modal-title" className="modal-title">{modal.title}</h3>
              <p id="contact-modal-message" className="modal-message">{modal.message}</p>
            </div>
            <button className="btn btn-modal-close" onClick={closeModal}>
              Dismiss
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
