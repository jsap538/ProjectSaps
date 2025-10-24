import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email queue to prevent rate limits
interface EmailJob {
  id: string;
  to: string;
  subject: string;
  html: string;
  retries: number;
  createdAt: Date;
}

class EmailQueue {
  private queue: EmailJob[] = [];
  private processing = false;
  private maxRetries = 3;
  private delayBetweenEmails = 1000; // 1 second

  async add(job: Omit<EmailJob, 'id' | 'retries' | 'createdAt'>) {
    const emailJob: EmailJob = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      retries: 0,
      createdAt: new Date(),
    };

    this.queue.push(emailJob);
    
    if (!this.processing) {
      this.process();
    }
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;

      try {
        await this.sendEmail(job);
        console.log(`Email sent successfully: ${job.id}`);
  } catch (error) {
        console.error(`Email failed: ${job.id}`, error);
        
        if (job.retries < this.maxRetries) {
          job.retries++;
          this.queue.push(job);
        } else {
          console.error(`Email permanently failed after ${this.maxRetries} retries: ${job.id}`);
        }
      }

      // Delay between emails to respect rate limits
      await new Promise(resolve => setTimeout(resolve, this.delayBetweenEmails));
    }

    this.processing = false;
  }

  private async sendEmail(job: EmailJob) {
    const { to, subject, html } = job;
    
    const result = await resend.emails.send({
      from: 'SAPS Marketplace <noreply@saps-marketplace.com>',
      to: [to],
      subject,
      html,
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  }
}

export const emailQueue = new EmailQueue();

// Email service functions
export const sendEmail = async (to: string, subject: string, html: string) => {
  return emailQueue.add({ to, subject, html });
};

// Track email delivery status
export const trackEmailDelivery = async (emailId: string, status: 'sent' | 'delivered' | 'bounced' | 'failed') => {
  // In a real implementation, you'd store this in your database
  console.log(`Email ${emailId} status: ${status}`);
  
  // You could store this in MongoDB for analytics
  // await EmailLog.create({ emailId, status, timestamp: new Date() });
};

// Unsubscribe functionality
export const unsubscribeUser = async (email: string, type: 'all' | 'marketing' | 'orders' | 'offers') => {
  // In a real implementation, you'd update the user's preferences in the database
  console.log(`User ${email} unsubscribed from ${type} emails`);
  
  // You could store this in MongoDB
  // await User.updateOne({ email }, { $set: { emailPreferences: { [type]: false } } });
};

// Check if user is subscribed
export const isUserSubscribed = async (email: string, type: 'all' | 'marketing' | 'orders' | 'offers') => {
  // In a real implementation, you'd check the user's preferences in the database
  // For now, assume all users are subscribed
  return true;
};

// Format currency for email templates
export const formatEmailCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Send order confirmation email (for Stripe webhook)
export const sendOrderConfirmationEmail = async (emailData: any) => {
  try {
    const { orderConfirmationTemplate } = await import('./email-templates');
    const template = orderConfirmationTemplate(emailData);
    await sendEmail(emailData.buyerEmail, template.subject, template.html);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send new sale email (for Stripe webhook)
export const sendNewSaleEmail = async (emailData: any) => {
  try {
    const { newOrderNotificationTemplate } = await import('./email-templates');
    const template = newOrderNotificationTemplate(emailData);
    await sendEmail(emailData.sellerEmail, template.subject, template.html);
  } catch (error) {
    console.error('Error sending new sale email:', error);
  }
};