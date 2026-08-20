import { Resend } from 'resend';
import { env } from '../../../config/env.js';

export class ResendProvider {
  constructor() {
    this.resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  }

  /**
   * @param {Object} message 
   * @param {string} message.to
   * @param {string} message.subject
   * @param {string} message.html
   * @param {string} message.text
   * @param {string} message.idempotencyKey
   */
  async send(message) {
    if (!this.resend) {
      console.warn('[ResendProvider] Missing RESEND_API_KEY. Simulating successful send.');
      return { ok: true, messageId: 'simulated_' + Date.now() };
    }

    try {
      const response = await this.resend.emails.send({
        from: env.EMAIL_FROM || 'Haazri <onboarding@resend.dev>',
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        headers: {
          'Idempotency-Key': message.idempotencyKey,
        }
      });

      if (response.error) {
        return { 
          ok: false, 
          error: response.error.message, 
          retryable: response.error.name === 'too_many_requests' || response.error.statusCode >= 500
        };
      }

      return { ok: true, messageId: response.data.id };
    } catch (error) {
      return { ok: false, error: error.message, retryable: true };
    }
  }
}

export const resendProvider = new ResendProvider();
