/**
 * Email Service using Resend
 * Handles all transactional emails for the marketplace
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'SAPS <orders@saps.com>'; // Update with your verified domain
const SUPPORT_EMAIL = 'support@saps.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://project-saps.vercel.app';

interface EmailRecipient {
  email: string;
  name: string;
}

interface OrderEmailData {
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  items: Array<{
    title: string;
    brand: string;
    price: string;
    imageUrl: string;
  }>;
  subtotal: string;
  shipping: string;
  serviceFee: string;
  total: string;
  shippingAddress: {
    fullName: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface ItemSoldEmailData {
  sellerName: string;
  sellerEmail: string;
  itemTitle: string;
  itemBrand: string;
  salePrice: string;
  buyerName: string;
  orderNumber: string;
}

/**
 * Send order confirmation to buyer
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const html = generateOrderConfirmationHTML(data);
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.buyerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
    });
    
    console.log(`✅ Order confirmation sent to ${data.buyerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return { success: false, error };
  }
}

/**
 * Send new sale notification to seller
 */
export async function sendNewSaleEmail(data: OrderEmailData) {
  try {
    const html = generateNewSaleHTML(data);
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.sellerEmail,
      subject: `New Sale! Order ${data.orderNumber}`,
      html,
    });
    
    console.log(`✅ New sale notification sent to ${data.sellerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending new sale email:', error);
    return { success: false, error };
  }
}

/**
 * Send item sold notification to seller
 */
export async function sendItemSoldEmail(data: ItemSoldEmailData) {
  try {
    const html = generateItemSoldHTML(data);
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.sellerEmail,
      subject: `Your item sold: ${data.itemTitle}`,
      html,
    });
    
    console.log(`✅ Item sold notification sent to ${data.sellerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending item sold email:', error);
    return { success: false, error };
  }
}

/**
 * Send shipping notification to buyer
 */
export async function sendShippingNotificationEmail(
  buyerEmail: string,
  buyerName: string,
  orderNumber: string,
  trackingNumber: string,
  trackingUrl: string,
  carrier: string
) {
  try {
    const html = generateShippingNotificationHTML(buyerName, orderNumber, trackingNumber, trackingUrl, carrier);
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: buyerEmail,
      subject: `Your order ${orderNumber} has shipped!`,
      html,
    });
    
    console.log(`✅ Shipping notification sent to ${buyerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending shipping notification:', error);
    return { success: false, error };
  }
}

// ============================================
// HTML Email Templates
// ============================================

function generateOrderConfirmationHTML(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0C0E;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1d24; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #33CC66 0%, #2aa856 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Confirmed!</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">Thank you for your purchase</p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #F5F6F7; font-size: 16px;">
                Hi ${data.buyerName},
              </p>
              <p style="margin: 0 0 30px; color: #C1C9D2; font-size: 15px; line-height: 1.6;">
                Your order has been confirmed and will be shipped soon. We'll send you another email when your order ships.
              </p>
              
              <!-- Order Number -->
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #8B98A8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                <p style="margin: 5px 0 0; color: #33CC66; font-size: 20px; font-weight: 600; font-family: monospace;">${data.orderNumber}</p>
              </div>
              
              <!-- Items -->
              <h2 style="margin: 0 0 20px; color: #F5F6F7; font-size: 18px; font-weight: 600;">Order Items</h2>
              ${data.items.map(item => `
                <div style="display: flex; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #2a2f3a;">
                  <img src="${item.imageUrl}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                  <div style="flex: 1;">
                    <p style="margin: 0 0 5px; color: #F5F6F7; font-size: 15px; font-weight: 500;">${item.title}</p>
                    <p style="margin: 0 0 5px; color: #8B98A8; font-size: 13px;">${item.brand}</p>
                    <p style="margin: 0; color: #33CC66; font-size: 16px; font-weight: 600;">${item.price}</p>
                  </div>
                </div>
              `).join('')}
              
              <!-- Pricing -->
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; margin-top: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #C1C9D2; font-size: 14px;">Subtotal</span>
                  <span style="color: #F5F6F7; font-size: 14px;">${data.subtotal}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #C1C9D2; font-size: 14px;">Shipping</span>
                  <span style="color: #F5F6F7; font-size: 14px;">${data.shipping}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #C1C9D2; font-size: 14px;">Service Fee</span>
                  <span style="color: #F5F6F7; font-size: 14px;">${data.serviceFee}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #3a3f4a;">
                  <span style="color: #F5F6F7; font-size: 16px; font-weight: 600;">Total</span>
                  <span style="color: #33CC66; font-size: 18px; font-weight: 600;">${data.total}</span>
                </div>
              </div>
              
              <!-- Shipping Address -->
              <h3 style="margin: 30px 0 15px; color: #F5F6F7; font-size: 16px; font-weight: 600;">Shipping Address</h3>
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; color: #C1C9D2; font-size: 14px; line-height: 1.6;">
                ${data.shippingAddress.fullName}<br>
                ${data.shippingAddress.street1}<br>
                ${data.shippingAddress.street2 ? `${data.shippingAddress.street2}<br>` : ''}
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.country}
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 40px; text-align: center;">
                <a href="${SITE_URL}/dashboard" style="display: inline-block; background-color: #33CC66; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                  View Order Details
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #151821; border-top: 1px solid #2a2f3a;">
              <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">
                Questions? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #33CC66; text-decoration: none;">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin: 0; color: #5A6270; font-size: 12px;">
                © ${new Date().getFullYear()} SAPS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateNewSaleHTML(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Sale!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0C0E;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1d24; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #33CC66 0%, #2aa856 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">You Made a Sale! 🎉</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">Time to ship your item</p>
            </td>
          </tr>
          
          <!-- Sale Details -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #F5F6F7; font-size: 16px;">
                Hi ${data.sellerName},
              </p>
              <p style="margin: 0 0 30px; color: #C1C9D2; font-size: 15px; line-height: 1.6;">
                Great news! Your item has been purchased. Please ship it within 3 business days.
              </p>
              
              <!-- Order Number -->
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #8B98A8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                <p style="margin: 5px 0 0; color: #33CC66; font-size: 20px; font-weight: 600; font-family: monospace;">${data.orderNumber}</p>
              </div>
              
              <!-- Items -->
              <h2 style="margin: 0 0 20px; color: #F5F6F7; font-size: 18px; font-weight: 600;">Items Sold</h2>
              ${data.items.map(item => `
                <div style="display: flex; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #2a2f3a;">
                  <img src="${item.imageUrl}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                  <div style="flex: 1;">
                    <p style="margin: 0 0 5px; color: #F5F6F7; font-size: 15px; font-weight: 500;">${item.title}</p>
                    <p style="margin: 0 0 5px; color: #8B98A8; font-size: 13px;">${item.brand}</p>
                    <p style="margin: 0; color: #33CC66; font-size: 16px; font-weight: 600;">${item.price}</p>
                  </div>
                </div>
              `).join('')}
              
              <!-- Payout Info -->
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px; color: #F5F6F7; font-size: 16px; font-weight: 600;">Your Payout</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #C1C9D2; font-size: 14px;">Sale Price</span>
                  <span style="color: #F5F6F7; font-size: 14px;">${data.total}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #C1C9D2; font-size: 14px;">Service Fee (10%)</span>
                  <span style="color: #F5F6F7; font-size: 14px;">-${data.serviceFee}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #3a3f4a;">
                  <span style="color: #F5F6F7; font-size: 16px; font-weight: 600;">You'll Receive</span>
                  <span style="color: #33CC66; font-size: 18px; font-weight: 600;">${(parseFloat(data.total.replace('$', '')) - parseFloat(data.serviceFee.replace('$', ''))).toFixed(2)}</span>
                </div>
              </div>
              
              <!-- Shipping Address -->
              <h3 style="margin: 30px 0 15px; color: #F5F6F7; font-size: 16px; font-weight: 600;">Ship To</h3>
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; color: #C1C9D2; font-size: 14px; line-height: 1.6;">
                ${data.shippingAddress.fullName}<br>
                ${data.shippingAddress.street1}<br>
                ${data.shippingAddress.street2 ? `${data.shippingAddress.street2}<br>` : ''}
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.country}
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #2a3f2f; border-left: 4px solid #33CC66; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <h3 style="margin: 0 0 10px; color: #33CC66; font-size: 15px; font-weight: 600;">Next Steps</h3>
                <ol style="margin: 0; padding-left: 20px; color: #C1C9D2; font-size: 14px; line-height: 1.8;">
                  <li>Package your item securely</li>
                  <li>Ship within 3 business days</li>
                  <li>Add tracking number in your dashboard</li>
                  <li>Get paid automatically after delivery</li>
                </ol>
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 40px; text-align: center;">
                <a href="${SITE_URL}/dashboard?tab=sales" style="display: inline-block; background-color: #33CC66; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                  Manage Sale
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #151821; border-top: 1px solid #2a2f3a;">
              <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">
                Questions? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #33CC66; text-decoration: none;">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin: 0; color: #5A6270; font-size: 12px;">
                © ${new Date().getFullYear()} SAPS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateItemSoldHTML(data: ItemSoldEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Item Sold</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0C0E;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1d24; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #33CC66 0%, #2aa856 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Your Item Sold!</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">${data.itemTitle}</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #F5F6F7; font-size: 16px;">
                Hi ${data.sellerName},
              </p>
              <p style="margin: 0 0 30px; color: #C1C9D2; font-size: 15px; line-height: 1.6;">
                Great news! Your <strong style="color: #F5F6F7;">${data.itemBrand} ${data.itemTitle}</strong> has been sold for <strong style="color: #33CC66;">${data.salePrice}</strong>.
              </p>
              
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">Buyer</p>
                <p style="margin: 0 0 15px; color: #F5F6F7; font-size: 15px; font-weight: 500;">${data.buyerName}</p>
                <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">Order Number</p>
                <p style="margin: 0; color: #33CC66; font-size: 16px; font-weight: 600; font-family: monospace;">${data.orderNumber}</p>
              </div>
              
              <div style="margin-top: 40px; text-align: center;">
                <a href="${SITE_URL}/dashboard?tab=sales" style="display: inline-block; background-color: #33CC66; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                  View Sale Details
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #151821; border-top: 1px solid #2a2f3a;">
              <p style="margin: 0; color: #5A6270; font-size: 12px;">
                © ${new Date().getFullYear()} SAPS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateShippingNotificationHTML(
  buyerName: string,
  orderNumber: string,
  trackingNumber: string,
  trackingUrl: string,
  carrier: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C0E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0C0E;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1d24; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #33CC66 0%, #2aa856 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Your Order Has Shipped! 📦</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">Track your package</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #F5F6F7; font-size: 16px;">
                Hi ${buyerName},
              </p>
              <p style="margin: 0 0 30px; color: #C1C9D2; font-size: 15px; line-height: 1.6;">
                Your order <strong style="color: #33CC66;">${orderNumber}</strong> has been shipped via ${carrier}.
              </p>
              
              <div style="background-color: #2a2f3a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">Tracking Number</p>
                <p style="margin: 0; color: #F5F6F7; font-size: 16px; font-weight: 600; font-family: monospace;">${trackingNumber}</p>
              </div>
              
              <div style="margin-top: 40px; text-align: center;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #33CC66; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                  Track Package
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #151821; border-top: 1px solid #2a2f3a;">
              <p style="margin: 0 0 10px; color: #8B98A8; font-size: 13px;">
                Questions? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #33CC66; text-decoration: none;">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin: 0; color: #5A6270; font-size: 12px;">
                © ${new Date().getFullYear()} SAPS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Helper to format currency for emails
 */
export function formatEmailCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

