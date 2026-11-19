import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ContactPage: React.FC = () => {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', contact: '', subject: '', message: '' });
    }, 700);
  };

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb Header */}
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
          <span className="text-[#c85028] font-bold">Contact Us</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Have questions about sizes, campus deliveries, or bulk society orders? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Priority Card */}
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    WhatsApp Instant Support
                  </h3>
                  <p className="text-[11px] text-gray-400">Fastest response for student inquiries</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Chat directly with our campus hub team for urgent sizing questions or delivery ETA.
              </p>
              <a
                href="https://wa.me/254712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message +254 712 345 678</span>
              </a>
            </div>

            {/* Physical Location */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#c85028]/15 text-[#c85028] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Egerton Campus Hub</h3>
                  <p className="text-[11px] text-gray-400">Main Campus, Njoro</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Sinatra Collection Hub, Egerton University Student Centre, Ground Floor Room 12.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Clock className="w-3.5 h-3.5 text-[#c85028]" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM</span>
              </div>
            </div>

            {/* Email & Phone */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8]'
              }`}
            >
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#c85028]" />
                  <div>
                    <p className="font-bold">Phone Calls</p>
                    <p className="text-gray-400">+254 712 345 678 / +254 700 123 456</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#c85028]" />
                  <div>
                    <p className="font-bold">Direct Email</p>
                    <p className="text-gray-400">egerton.store@sinatra.co.ke</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 sm:p-8 rounded-2xl border ${
                isDark ? 'bg-[#121926] border-[#1e293b]' : 'bg-white border-[#ede4d8] shadow-sm'
              }`}
            >
              <h3 className="font-bold text-lg mb-1">Send Us a Direct Message</h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill in the form below and we'll reply to your phone/email promptly.
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Thank you! Your message has been sent to our campus support team.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Joy Chebet"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">
                    Phone Number or Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. 0712 345 678 or joy@egerton.ac.ke"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Sizing inquiry / Order status"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-400">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                      isDark
                        ? 'bg-[#1a2334] border-[#1e293b] text-white focus:border-[#c85028]'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#c85028]'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#c85028] hover:bg-[#b3441e] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-75"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
