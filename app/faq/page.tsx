"use client";

import { useState } from "react";
import BrandMark from "@/components/BrandMark";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: "What is SAPS?",
    answer: "SAPS is a trusted marketplace for buying and selling premium men's fashion. From designer suits and limited-edition sneakers to luxury watches and accessories, we connect buyers with trusted sellers. All listings are reviewed for accuracy and sellers are accountable to the community.",
    category: "General"
  },
  {
    question: "How do I get started?",
    answer: "Simply create an account to start browsing our curated collection. You can browse items by category, brand, or price range. When you find something you love, add it to your cart and checkout securely.",
    category: "General"
  },
  {
    question: "Is SAPS safe to use?",
    answer: "Yes. We use Stripe for secure payment processing with buyer protection. All listings are reviewed before going live, and we have a dispute resolution process if items don't match descriptions.",
    category: "General"
  },

  // Buying Questions
  {
    question: "How do I know items are authentic?",
    answer: "Sellers are responsible for accurate descriptions and photos. We review listings for obvious issues and hold sellers accountable. If you receive an item that doesn't match the listing, you can open a dispute for a refund. For high-value items, we recommend professional authentication.",
    category: "Buying"
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer: "We want you to be completely satisfied. If you're not happy with your purchase, contact us within 48 hours of delivery. We'll work with the seller to resolve any issues and ensure you're taken care of.",
    category: "Buying"
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping times vary by seller and location. Most items ship within 1-3 business days and arrive within 5-7 business days. You'll receive tracking information once your item ships.",
    category: "Buying"
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, many of our sellers offer international shipping. Shipping costs and delivery times will vary by destination. Check the item listing for specific shipping information.",
    category: "Buying"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through Stripe, our secure payment processor. Stripe handles all payment information and provides buyer protection.",
    category: "Buying"
  },

  // Selling Questions
  {
    question: "How do I become a seller?",
    answer: "Just sign up for an account and you can start listing items immediately. All listings go through review before going live (usually within 24 hours). Make sure to provide accurate photos and descriptions.",
    category: "Selling"
  },
  {
    question: "What items can I sell?",
    answer: "We accept premium men's fashion including clothing (suits, shirts, pants, outerwear), shoes (dress shoes, sneakers, boots), watches, and accessories (ties, belts, bags, etc.). Items should be in good condition with accurate descriptions and photos.",
    category: "Selling"
  },
  {
    question: "How much does it cost to sell?",
    answer: "SAPS charges a competitive commission on successful sales. Our fee structure is transparent and clearly displayed before you list. There are no upfront costs or monthly fees.",
    category: "Selling"
  },
  {
    question: "How do I price my items?",
    answer: "Research similar items on our platform and consider condition, brand, and rarity. Our pricing tools can help you find the right price point. Remember, competitive pricing often leads to faster sales.",
    category: "Selling"
  },
  {
    question: "When do I get paid?",
    answer: "Payments are processed after the buyer confirms receipt and satisfaction with their purchase. This typically takes 2-3 business days after delivery confirmation.",
    category: "Selling"
  },

  // Account & Security
  {
    question: "How do I update my account information?",
    answer: "You can update your account information anytime in your profile settings. This includes your shipping address, payment methods, and notification preferences.",
    category: "Account"
  },
  {
    question: "How do I change my password?",
    answer: "Go to your account settings and select 'Change Password'. You'll need to enter your current password and create a new one. We recommend using a strong, unique password.",
    category: "Account"
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account at any time from your account settings. Please note that this action is permanent and cannot be undone. Any active transactions will need to be completed first.",
    category: "Account"
  },

  // Returns & Refunds
  {
    question: "What is your return policy?",
    answer: "Returns are handled on a case-by-case basis. If you're not satisfied with your purchase, contact us within 48 hours of delivery. We'll work with you and the seller to resolve any issues.",
    category: "Returns"
  },
  {
    question: "How long do refunds take?",
    answer: "Refunds are processed within 3-5 business days after we receive the returned item. The refund will appear on your original payment method within 5-10 business days depending on your bank.",
    category: "Returns"
  },
  {
    question: "Who pays for return shipping?",
    answer: "Return shipping costs depend on the reason for return. If the item doesn't match the description or is damaged, we cover return shipping. If you simply change your mind, you may be responsible for return shipping costs.",
    category: "Returns"
  }
];

const categories = ["All", "General", "Buying", "Selling", "Account", "Returns"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Find answers to common questions about shopping and selling on SAPS
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-sap ${
                  selectedCategory === category
                    ? "bg-titanium text-ink"
                    : "bg-graphite/60 text-nickel hover:bg-graphite/80 hover:text-porcelain"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-porcelain/10 bg-graphite/60 shadow-subtle overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-graphite/80 transition-colors duration-sap"
              >
                <h3 className="text-lg font-semibold text-porcelain pr-4">
                  {faq.question}
                </h3>
                {openItems.has(index) ? (
                  <ChevronUp className="h-5 w-5 text-titanium flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-titanium flex-shrink-0" />
                )}
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-porcelain/10 pt-4">
                    <p className="text-nickel text-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-porcelain mb-4 text-display">
              Still Have Questions?
            </h2>
            <p className="text-nickel mb-6 text-body">
              Need more help? Get in touch and we'll respond within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@saps.com"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-titanium text-ink font-medium transition-transform duration-sap hover:-translate-y-px"
              >
                Contact Support
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-porcelain/20 text-porcelain font-medium transition-colors duration-sap hover:bg-porcelain/5"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
