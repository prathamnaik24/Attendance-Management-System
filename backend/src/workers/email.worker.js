import { db } from '../db/index.js';
import { resendProvider } from '../services/email/providers/resend.provider.js';
import { generateEmployeeInviteEmail } from '../services/email/templates/employeeInvite.template.js';

export class EmailWorker {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  start(intervalMs = 10000) {
    if (this.intervalId) return;
    
    console.log(`[EmailWorker] Starting with interval ${intervalMs}ms`);
    this.intervalId = setInterval(() => this.processQueue(), intervalMs);
    
    // Run immediately on start
    this.processQueue();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async processQueue() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      // 1. Fetch pending/failed jobs, max 50
      // We lock them by changing status to 'processing'
      const { rows } = await db.query(`
        UPDATE email_outbox
        SET status = 'processing',
            attempt_count = attempt_count + 1
        WHERE id IN (
          SELECT id FROM email_outbox
          WHERE status IN ('pending', 'failed')
            AND attempt_count < 3
          ORDER BY created_at ASC
          LIMIT 50
          FOR UPDATE SKIP LOCKED
        )
        RETURNING *;
      `);

      if (rows.length === 0) {
        this.isRunning = false;
        return;
      }

      console.log(`[EmailWorker] Processing ${rows.length} emails`);

      // 2. Process each job
      for (const job of rows) {
        await this.processJob(job);
      }
    } catch (error) {
      console.error('[EmailWorker] Error processing queue:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async processJob(job) {
    try {
      let emailContent;
      
      // Select template
      if (job.template_key === 'employeeInvite') {
        emailContent = generateEmployeeInviteEmail(job.payload_json);
      } else {
        throw new Error(`Unknown template: ${job.template_key}`);
      }

      // Send via provider
      const result = await resendProvider.send({
        to: job.to_email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        idempotencyKey: job.idempotency_key
      });

      if (result.ok) {
        await this.markSuccess(job.id, job.organization_id);
      } else {
        await this.markFailed(job.id, result.error, result.retryable);
      }
    } catch (error) {
      await this.markFailed(job.id, error.message, true);
    }
  }

  async markSuccess(jobId, organizationId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      // Update outbox
      await client.query(`
        UPDATE email_outbox 
        SET status = 'sent', sent_at = current_timestamp 
        WHERE id = $1
      `, [jobId]);

      // If this was an invite, also update org_invite_tokens
      await client.query(`
        UPDATE org_invite_tokens
        SET invite_email_status = 'sent', invite_sent_at = current_timestamp
        WHERE organization_id = $2 
          AND EXISTS (
            SELECT 1 FROM email_outbox e 
            WHERE e.id = $1 AND e.idempotency_key = 'invite:' || org_invite_tokens.id || ':v1'
          )
      `, [jobId, organizationId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[EmailWorker] Failed to mark job ${jobId} as success:`, error);
    } finally {
      client.release();
    }
  }

  async markFailed(jobId, errorMsg, isRetryable) {
    const nextStatus = isRetryable ? 'failed' : 'bounced';
    try {
      await db.query(`
        UPDATE email_outbox 
        SET status = $2, last_error = $3
        WHERE id = $1
      `, [jobId, nextStatus, errorMsg]);
    } catch (dbError) {
      console.error(`[EmailWorker] Failed to mark job ${jobId} as failed:`, dbError);
    }
  }
}

export const emailWorker = new EmailWorker();
