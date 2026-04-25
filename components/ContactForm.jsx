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
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [modal, setModal] = useState(null);

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
        setModal({
          icon: '✅',
          title: 'Success!',
          message: "Thanks for your message! I'll get back to you soon.",
        });
        reset();
      } else {
        const errorMsg = json.errors
          ? json.errors.map((err) => err.message).join(', ')
          : 'Oops! There was a problem submitting your form';
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
            className={`form-control${errors.name ? ' is-invalid' : ''}`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Your Email"
            className={`form-control${errors.email ? ' is-invalid' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            className={`form-control${errors.subject ? ' is-invalid' : ''}`}
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
        </div>

        <div className="form-group">
          <textarea
            rows="5"
            placeholder="Message"
            className={`form-control${errors.message ? ' is-invalid' : ''}`}
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
            })}
          />
          {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
        </div>

        <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-card">
            <span className="modal-icon">{modal.icon}</span>
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <button className="btn btn-modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
