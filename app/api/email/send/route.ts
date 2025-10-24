import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, isUserSubscribed } from '@/lib/email';
import { 
  orderConfirmationTemplate, 
  newOrderNotificationTemplate,
  itemApprovedTemplate,
  itemRejectedTemplate,
  offerReceivedTemplate,
  offerResponseTemplate
} from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { type, data, recipientEmail } = await request.json();

    // Check if user is subscribed to this type of email
    const isSubscribed = await isUserSubscribed(recipientEmail, type);
    if (!isSubscribed) {
      return NextResponse.json({ success: true, message: 'User unsubscribed' });
    }

    let template;
    let subject;
    let html;

    switch (type) {
      case 'order_confirmation':
        template = orderConfirmationTemplate(data);
        break;
      case 'new_order':
        template = newOrderNotificationTemplate(data);
        break;
      case 'item_approved':
        template = itemApprovedTemplate(data);
        break;
      case 'item_rejected':
        template = itemRejectedTemplate(data);
        break;
      case 'offer_received':
        template = offerReceivedTemplate(data);
        break;
      case 'offer_response':
        template = offerResponseTemplate(data);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid email type' }, { status: 400 });
    }

    // Send email
    await sendEmail(recipientEmail, template.subject, template.html);

    return NextResponse.json({ 
      success: true, 
      message: 'Email queued successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
