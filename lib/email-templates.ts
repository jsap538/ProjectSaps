interface EmailTemplate {
  subject: string;
  html: string;
}

interface OrderData {
  orderNumber: string;
  buyerName: string;
  sellerName: string;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingAddress: string;
}

interface ItemData {
  title: string;
  sellerName: string;
  reason?: string;
}

interface OfferData {
  itemTitle: string;
  buyerName: string;
  offerAmount: number;
  message?: string;
}

// Base email template
const getBaseTemplate = (content: string, unsubscribeLink?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAPS Marketplace</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f6f7; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0b0c0e; padding: 20px; text-align: center; }
    .logo { color: #f5f6f7; font-size: 24px; font-weight: bold; }
    .content { padding: 30px; }
    .footer { background-color: #1a1d24; padding: 20px; text-align: center; color: #8b8d92; font-size: 14px; }
    .button { display: inline-block; background-color: #33cc66; color: #0b0c0e; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .unsubscribe { color: #8b8d92; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SAPS</div>
    </div>
    <div class="content">
      ${content}
      ${unsubscribeLink ? `
        <div class="unsubscribe">
          <a href="${unsubscribeLink}" style="color: #8b8d92;">Unsubscribe</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>SAPS Marketplace - Premium Men's Fashion</p>
      <p>This email was sent to you because you have an account with us.</p>
    </div>
  </div>
</body>
</html>
`;

// Order Confirmation (Buyer)
export const orderConfirmationTemplate = (data: OrderData): EmailTemplate => {
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <h3>${item.title}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
    </div>
  `).join('');

  const content = `
    <h1>Order Confirmation</h1>
    <p>Hi ${data.buyerName},</p>
    <p>Thank you for your order! Your order #${data.orderNumber} has been confirmed.</p>
    
    <h2>Order Details</h2>
    ${itemsHtml}
    
    <p><strong>Total: $${data.total.toFixed(2)}</strong></p>
    <p><strong>Shipping Address:</strong><br>${data.shippingAddress}</p>
    
    <p>You'll receive another email when your order ships.</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${data.orderNumber}" class="button">View Order</a>
  `;

  return {
    subject: `Order Confirmation - #${data.orderNumber}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.buyerName)}&type=orders`)
  };
};

// New Order Notification (Seller)
export const newOrderNotificationTemplate = (data: OrderData): EmailTemplate => {
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <h3>${item.title}</h3>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
    </div>
  `).join('');

  const content = `
    <h1>New Order Received!</h1>
    <p>Hi ${data.sellerName},</p>
    <p>Great news! You have a new order #${data.orderNumber} from ${data.buyerName}.</p>
    
    <h2>Order Details</h2>
    ${itemsHtml}
    
    <p><strong>Total: $${data.total.toFixed(2)}</strong></p>
    <p><strong>Shipping Address:</strong><br>${data.shippingAddress}</p>
    
    <p>Please prepare and ship the items within 2 business days.</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${data.orderNumber}" class="button">View Order</a>
  `;

  return {
    subject: `New Order - #${data.orderNumber}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.sellerName)}&type=orders`)
  };
};

// Item Approved Notification (Seller)
export const itemApprovedTemplate = (data: ItemData): EmailTemplate => {
  const content = `
    <h1>Item Approved!</h1>
    <p>Hi ${data.sellerName},</p>
    <p>Great news! Your item "${data.title}" has been approved and is now live on the marketplace.</p>
    
    <p>Your item is now visible to buyers and ready for sale.</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/items/${data.title}" class="button">View Item</a>
  `;

  return {
    subject: `Item Approved - ${data.title}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.sellerName)}&type=marketing`)
  };
};

// Item Rejected Notification (Seller)
export const itemRejectedTemplate = (data: ItemData): EmailTemplate => {
  const content = `
    <h1>Item Not Approved</h1>
    <p>Hi ${data.sellerName},</p>
    <p>Unfortunately, your item "${data.title}" was not approved for the marketplace.</p>
    
    ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
    
    <p>You can edit your item and resubmit it for review.</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/items" class="button">Manage Items</a>
  `;

  return {
    subject: `Item Not Approved - ${data.title}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.sellerName)}&type=marketing`)
  };
};

// Offer Received (Seller)
export const offerReceivedTemplate = (data: OfferData): EmailTemplate => {
  const content = `
    <h1>New Offer Received!</h1>
    <p>Hi there,</p>
    <p>You have a new offer for your item "${data.itemTitle}" from ${data.buyerName}.</p>
    
    <div class="item">
      <h3>Offer Details</h3>
      <p><strong>Amount:</strong> $${data.offerAmount.toFixed(2)}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
    </div>
    
    <p>You can accept, reject, or counter this offer.</p>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/offers" class="button">View Offer</a>
  `;

  return {
    subject: `New Offer - ${data.itemTitle}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent('seller')}&type=offers`)
  };
};

// Offer Accepted/Rejected (Buyer)
export const offerResponseTemplate = (data: OfferData & { accepted: boolean }): EmailTemplate => {
  const content = `
    <h1>Offer ${data.accepted ? 'Accepted' : 'Rejected'}</h1>
    <p>Hi ${data.buyerName},</p>
    <p>Your offer for "${data.itemTitle}" has been ${data.accepted ? 'accepted' : 'rejected'}.</p>
    
    ${data.accepted ? `
      <p>Congratulations! The seller has accepted your offer. You can now proceed to checkout.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout" class="button">Complete Purchase</a>
    ` : `
      <p>Unfortunately, the seller has rejected your offer. You can make a new offer or browse other items.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/browse" class="button">Browse Items</a>
    `}
  `;

  return {
    subject: `Offer ${data.accepted ? 'Accepted' : 'Rejected'} - ${data.itemTitle}`,
    html: getBaseTemplate(content, `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.buyerName)}&type=offers`)
  };
};
