// ============================================================================
// The Indian Rasoi — Contact & Location Section
// Location in Connaught Place, contact coordinates, opening hours,
// and interactive inquiry / catering request form.
// ============================================================================

import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ContactSection() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry / Table Booking',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields (name, email, message)', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Your inquiry has been successfully sent to The Indian Rasoi concierge.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry / Table Booking',
        message: ''
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0909] border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concierge & Atelier Location</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Contact & Private Dining
          </h2>
          <p className="text-sm text-stone-400 font-sans leading-relaxed">
            For bespoke event catering, private cellar allocations, or any question regarding our gourmet delivery service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Coordinates & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#141211] border border-amber-950/40 space-y-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-white">
                The Indian Rasoi · Connaught Place
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Located near Connaught Place in central New Delhi, our royal kitchen prepares each order fresh to the minute using heirloom spice blends and traditional tandoor techniques.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Kitchen Address</strong>
                    <span>Block B, Connaught Place, New Delhi, Delhi 110001, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Direct Line</strong>
                    <span>+91 98765 43210 (Guest Relations & Orders)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Digital Concierge</strong>
                    <span>namaste@theindianrasoi.com</span>
                  </div>
                </div>
              </div>

              {/* Service Hours */}
              <div className="pt-4 border-t border-stone-850 space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-serif uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Kitchen & Delivery Hours</span>
                </div>
                <div className="text-xs text-stone-400 space-y-1">
                  <div className="flex justify-between py-1 border-b border-stone-850">
                    <span className="text-stone-300">Monday — Friday</span>
                    <span className="font-mono text-stone-400">11:30 - 23:00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-850">
                    <span className="text-stone-300">Saturday — Sunday</span>
                    <span className="font-mono text-stone-400">11:30 - 23:30</span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic pt-1">
                    Open 7 days a week for lunch, afternoon tea, and royal dinner service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-xl space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Message Our Hospitality Team
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Inquiries regarding allergens, bespoke event catering, or cellar allocations?
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl text-white">Message Delivered</h4>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                    Thank you for contacting The Indian Rasoi. Our hospitality team will reply within two business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-stone-800 text-xs text-stone-300 hover:text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-stone-300 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rohan Verma"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-stone-300 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-stone-300 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-stone-300 block">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry / Table Booking">General Inquiry / Table Booking</option>
                        <option value="Private Event & Rasoi Catering">Private Event & Rasoi Catering</option>
                        <option value="Wine Cellar Allocation & Vintages">Wine Cellar Allocation & Vintages</option>
                        <option value="Allergens & Dietary Requirements">Allergens & Dietary Requirements</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300 block">
                      Your Message or Instructions *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How may our hospitality team assist you today?"
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting inquiry...' : 'Send to Concierge'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
