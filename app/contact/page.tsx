"use client";

import { useState } from "react";
import BrandMark from "@/components/BrandMark";
// import { PrimaryButton, GhostButton } from "@/components/Buttons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general"
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            We're here to help. Get in touch with our support team.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">
              Send us a Message
            </h2>
            
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm">
                  Thank you! Your message has been sent. We'll respond within 24 hours.
                </p>
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">
                  Sorry, there was an error sending your message. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-porcelain mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-porcelain mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-porcelain mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="shipping">Shipping Question</option>
                  <option value="selling">Selling on SAPS</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-porcelain mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-porcelain mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap resize-none"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-titanium text-ink px-6 py-4 font-semibold transition-transform duration-sap hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-1">Email Support</h3>
                    <p className="text-nickel text-body">support@saps.com</p>
                    <p className="text-sm text-nickel">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-1">Business Hours</h3>
                    <p className="text-nickel text-body">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-sm text-nickel">Saturday: 10 AM - 4 PM EST</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-1">FAQ</h3>
                    <p className="text-nickel text-body">Find quick answers to common questions</p>
                    <a href="/faq" className="text-sm text-titanium hover:text-porcelain transition-colors duration-sap">
                      Browse FAQ →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Support */}
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">
                Specialized Support
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-porcelain/10">
                  <div>
                    <h3 className="text-porcelain font-medium">Returns & Refunds</h3>
                    <p className="text-sm text-nickel">returns@saps.com</p>
                  </div>
                  <a
                    href="mailto:returns@saps.com"
                    className="text-titanium hover:text-porcelain transition-colors duration-sap"
                  >
                    Contact →
                  </a>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-porcelain/10">
                  <div>
                    <h3 className="text-porcelain font-medium">Shipping Questions</h3>
                    <p className="text-sm text-nickel">shipping@saps.com</p>
                  </div>
                  <a
                    href="mailto:shipping@saps.com"
                    className="text-titanium hover:text-porcelain transition-colors duration-sap"
                  >
                    Contact →
                  </a>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-porcelain/10">
                  <div>
                    <h3 className="text-porcelain font-medium">Selling Support</h3>
                    <p className="text-sm text-nickel">sellers@saps.com</p>
                  </div>
                  <a
                    href="mailto:sellers@saps.com"
                    className="text-titanium hover:text-porcelain transition-colors duration-sap"
                  >
                    Contact →
                  </a>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div>
                    <h3 className="text-porcelain font-medium">Privacy & Security</h3>
                    <p className="text-sm text-nickel">privacy@saps.com</p>
                  </div>
                  <a
                    href="mailto:privacy@saps.com"
                    className="text-titanium hover:text-porcelain transition-colors duration-sap"
                  >
                    Contact →
                  </a>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">
                Response Times
              </h2>
              <div className="space-y-4 text-nickel text-body">
                <div className="flex justify-between">
                  <span>General Inquiries</span>
                  <span className="text-titanium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Technical Support</span>
                  <span className="text-titanium">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Questions</span>
                  <span className="text-titanium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Returns & Refunds</span>
                  <span className="text-titanium">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgent Issues</span>
                  <span className="text-titanium">4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
