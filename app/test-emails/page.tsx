"use client";

import { useState } from 'react';

export default function TestEmailsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testEmail = async (type: string, data: any) => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data,
          recipientEmail: email,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult(`✅ ${type} email sent successfully!`);
      } else {
        setResult(`❌ Failed to send ${type} email: ${result.error}`);
      }
    } catch (error) {
      setResult(`❌ Error sending ${type} email: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testOrderConfirmation = () => {
    testEmail('order_confirmation', {
      orderNumber: 'ORD-12345',
      buyerName: 'John Doe',
      sellerName: 'Jane Smith',
      items: [
        { title: 'Designer Suit', price: 299.99, quantity: 1 },
        { title: 'Luxury Watch', price: 599.99, quantity: 1 }
      ],
      total: 899.98,
      shippingAddress: '123 Main St, New York, NY 10001'
    });
  };

  const testNewOrder = () => {
    testEmail('new_order', {
      orderNumber: 'ORD-12345',
      buyerName: 'John Doe',
      sellerName: 'Jane Smith',
      items: [
        { title: 'Designer Suit', price: 299.99, quantity: 1 }
      ],
      total: 299.99,
      shippingAddress: '123 Main St, New York, NY 10001'
    });
  };

  const testItemApproved = () => {
    testEmail('item_approved', {
      title: 'Designer Suit',
      sellerName: 'Jane Smith'
    });
  };

  const testItemRejected = () => {
    testEmail('item_rejected', {
      title: 'Designer Suit',
      sellerName: 'Jane Smith',
      reason: 'Item does not meet quality standards'
    });
  };

  const testOfferReceived = () => {
    testEmail('offer_received', {
      itemTitle: 'Designer Suit',
      buyerName: 'John Doe',
      offerAmount: 250.00,
      message: 'Would you consider $250 for this suit?'
    });
  };

  const testOfferResponse = () => {
    testEmail('offer_response', {
      itemTitle: 'Designer Suit',
      buyerName: 'John Doe',
      offerAmount: 250.00,
      accepted: true
    });
  };

  return (
    <div className="min-h-screen bg-ink p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-porcelain mb-8">
          Email Testing Dashboard
        </h1>
        
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-porcelain mb-4">
            Test Email Address
          </h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-xl bg-ink border border-porcelain/20 text-porcelain px-4 py-3 mb-4"
          />
          <p className="text-nickel text-sm">
            Enter your email address to test all email templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Emails */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-4">Order Emails</h3>
            <div className="space-y-3">
              <button
                onClick={testOrderConfirmation}
                disabled={!email || loading}
                className="w-full rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Order Confirmation
              </button>
              <button
                onClick={testNewOrder}
                disabled={!email || loading}
                className="w-full rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test New Order Notification
              </button>
            </div>
          </div>

          {/* Item Emails */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-4">Item Emails</h3>
            <div className="space-y-3">
              <button
                onClick={testItemApproved}
                disabled={!email || loading}
                className="w-full rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Item Approved
              </button>
              <button
                onClick={testItemRejected}
                disabled={!email || loading}
                className="w-full rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Item Rejected
              </button>
            </div>
          </div>

          {/* Offer Emails */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-4">Offer Emails</h3>
            <div className="space-y-3">
              <button
                onClick={testOfferReceived}
                disabled={!email || loading}
                className="w-full rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Offer Received
              </button>
              <button
                onClick={testOfferResponse}
                disabled={!email || loading}
                className="w-full rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Offer Response
              </button>
            </div>
          </div>

          {/* Unsubscribe Test */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-4">Unsubscribe Test</h3>
            <div className="space-y-3">
              <a
                href={`/unsubscribe?email=${encodeURIComponent(email || 'test@example.com')}&type=orders`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-yellow-500/30 text-center"
              >
                Test Unsubscribe Link
              </a>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8 bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-2">Result</h3>
            <p className="text-nickel">{result}</p>
          </div>
        )}

        {loading && (
          <div className="mt-8 bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-titanium border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-porcelain">Sending email...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
