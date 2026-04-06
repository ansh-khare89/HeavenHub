import { useState } from 'react';

const FAQS = [
  {
    category: "Booking Process",
    items: [
      { q: "How do I book a stay?", a: "Search for properties on the Hotels page, select your dates, and click 'Request Booking'. The host will review your request." },
      { q: "What does 'Pending' state mean?", a: "Once you request a booking, it stays 'Pending' until the host either accepts or rejects it. You won't be charged until it is accepted." },
      { q: "Can I cancel a booking?", a: "Yes, you can cancel a pending booking at any time. If confirmed, standard cancellation policies apply depending on the property." }
    ]
  },
  {
    category: "Payments",
    items: [
      { q: "When do I pay?", a: "You only pay after the host accepts your booking request. Your booking status will change from Pending to Accepted, enabling a 'Pay Now' button." },
      { q: "Is payment secure?", a: "Absolutely. We use industry-standard payment gateways (e.g., Razorpay) to process payments securely. We do not store your credit card information." }
    ]
  },
  {
    category: "Hosting",
    items: [
      { q: "How do I approve a guest?", a: "Go to your 'Host hub'. Under the bookings section, you will see pending requests. Click 'Accept' to confirm the stay." },
      { q: "When do I receive my payout?", a: "Payouts are initiated to your registered bank account 24 hours after the guest checks in." }
    ]
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl text-center mb-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-12">
          {FAQS.map((group, groupIdx) => (
            <div key={group.category}>
              <h2 className="text-xl font-bold text-sky-300 mb-4 pb-2 border-b border-white/10">{group.category}</h2>
              <div className="space-y-4">
                {group.items.map((item, itemIdx) => {
                  const globalIndex = `${groupIdx}-${itemIdx}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div 
                      key={globalIndex} 
                      className="rounded-2xl border border-white/10 bg-[#050b14]/50 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-white/5 focus:outline-none"
                      >
                        <span className="font-medium text-slate-200">{item.q}</span>
                        <span className={`text-sky-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      <div className={`px-5 text-sm text-slate-400 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                        {item.a}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
