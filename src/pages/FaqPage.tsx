import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

const FAQS: FaqCategory[] = [
  {
    category: 'Ordering & Availability',
    items: [
      {
        question: 'How do I place an order for Egerton campus delivery?',
        answer:
          'Simply browse the catalogue, select your desired size and colour, and click "Add to Cart". In the checkout page, choose either Campus Pickup at the Student Centre or Direct Delivery to your hall/hostel.',
      },
      {
        question: 'Can I order directly via WhatsApp?',
        answer:
          'Yes! Every product page features an "Order via WhatsApp Direct" button that prepares a pre-filled message with your selected outfit, size, and quantity.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      {
        question: 'How do Sinatra sizes fit?',
        answer:
          'Our hoodies and sweatshirts are designed with a relaxed collegiate streetwear cut. T-shirts have an oversized boxy drop-shoulder silhouette. If you prefer a snug tailored fit, consider sizing down one size.',
      },
      {
        question: 'What materials do you use?',
        answer:
          'We use heavyweight 380 GSM cotton fleece for hoodies to keep everyone warm in chilly Njoro mornings, and 240 GSM combed organic cotton for t-shirts.',
      },
    ],
  },
  {
    category: 'Delivery & Campus Pickup',
    items: [
      {
        question: 'Where can I collect my order?',
        answer:
          'Orders can be collected directly at the Sinatra Collection Hub located inside the Egerton University Student Centre, Ground Floor Room 12.',
      },
      {
        question: 'How much does campus delivery cost?',
        answer:
          'Delivery is 100% FREE for orders above KSh 2,000! For smaller orders, delivery to Egerton halls and nearby Njoro town hostels is KSh 150.',
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    items: [
      {
        question: 'Do I need to pay online with a credit card?',
        answer:
          'No! Sinatra does not require online credit card payments. You pay via M-Pesa or cash upon inspecting your outfits when delivered or collected.',
      },
      {
        question: 'Can I exchange for a different size if it doesn’t fit?',
        answer:
          'Yes! We offer hassle-free size exchanges within 48 hours as long as the item has not been worn or washed.',
      },
    ],
  },
];

export const FaqPage: React.FC = () => {
  const { isDark } = useTheme();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true, // open first item by default
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb */}
      <div
        className={`w-full py-4 px-4 sm:px-6 lg:px-8 border-b ${
          isDark ? 'bg-[#0c1421] border-[#182334]' : 'bg-[#f8f2eb] border-[#ede4d8]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c85028] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#c85028] font-bold">Frequently Asked Questions</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Everything you need to know about shopping, campus delivery, and sizing at Sinatra.
          </p>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-8">
          {FAQS.map((categoryGroup, catIdx) => (
            <div key={catIdx}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#c85028] mb-3">
                {categoryGroup.category}
              </h3>
              <div className="space-y-3">
                {categoryGroup.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = Boolean(openItems[key]);

                  return (
                    <div
                      key={itemIdx}
                      className={`rounded-2xl border transition-colors overflow-hidden ${
                        isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180 text-[#c85028]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 mt-1">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Help CTA */}
        <div
          className={`mt-12 p-6 rounded-2xl border text-center ${
            isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
          }`}
        >
          <h4 className="font-bold text-sm mb-1">Still have a question?</h4>
          <p className="text-xs text-gray-400 mb-4">
            Our support team is online daily to answer your questions.
          </p>
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
