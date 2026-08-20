import { db } from '../../db/index.js';
import crypto from 'crypto';

export class EmailService {
  /**
   * Queue an email to be sent asynchronously by the worker.
   * This should be called within the same transaction as the business event.
   * 
   * @param {Object} params 
   * @param {import('pg').PoolClient} params.client - The DB client/transaction
   * @param {string} params.organizationId
   * @param {string} params.to
   * @param {string} params.templateKey - e.g. 'employeeInvite'
   * @param {Object} params.payload
   * @param {string} params.idempotencyKey
   */
  async queue({ client, organizationId, to, templateKey, payload, idempotencyKey }) {
    await client.query(
      `INSERT INTO email_outbox 
       (organization_id, to_email, template_key, payload_json, idempotency_key)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        organizationId,
        to,
        templateKey,
        JSON.stringify(payload),
        idempotencyKey
      ]
    );
  }
}

export const emailService = new EmailService();
