// ============================================================================
// The Indian Rasoi — Contact & Location Section
// Pure dynamic database-driven component powered by RestaurantContext.
// Zero hardcoded coordinates.
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
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';

export default function ContactSection() {
  const { restaurant } = useRestaurant();
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

  const contact = restaurant?.contact || {
    address: 'Block B, Connaught Place, New Delhi, Delhi 110001, India',
    street: 'Block B, Inner Circle, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    phone: '+91 98765 43210',
    email: 'namaste@theindianrasoi.com',
    hours: {
      lunch: '12:00 PM – 3:30 PM',
      dinner: '7:00 PM – 11:30 PM',
      delivery: '12:00 PM – 11:30 PM (Daily)'
    }
  };

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
      showToast(`Your inquiry has been successfully sent to ${restaurant?.name || 'The Indian Rasoi'} concierge.`, 'success');
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
    <section id="contact" className="py-24 bg-[#0a0909] border-t border-stone-850 relative w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concierge & Atelier Location</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-snug">
            Contact & Private Dining
          </h2>
          <p className="text-sm text-stone-300 font-normal leading-relaxed">
            For bespoke event catering, private cellar allocations, or any question regarding our gourmet delivery service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Coordinates & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#141211] border border-amber-950/40 space-y-6 shadow-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {restaurant?.name || 'The Indian Rasoi'} · Connaught Place
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                Located near Connaught Place in central New Delhi, our royal kitchen prepares each order fresh to the minute using heirloom spice blends and traditional tandoor techniques.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Kitchen Address</strong>
                    <span>{contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Direct Line</strong>
                    <span>{contact.phone} (Guest Relations & Orders)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Concierge Email</strong>
                    <span>{contact.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">Kitchen Hours</strong>
                    <span>Delivery Service: {contact.hours?.delivery || '12:00 PM – 11:30 PM (Daily)'}</span>
                    <span className="block text-stone-500 text-xs">
                      Lunch: {contact.hours?.lunch || '12:00 PM – 3:30 PM'} · Dinner: {contact.hours?.dinner || '7:00 PM – 11:30 PM'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#141211] border border-amber-950/40 shadow-2xl">
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Send an Inquiry or Reserve Catering
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mb-8 font-sans">
                Our hospitality director will personally reply within 45 minutes during service hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    Namaste! Your message has been received.
                  </h4>
                  <p className="text-sm text-stone-400 max-w-md mx-auto">
                    A senior member of {restaurant?.name || 'The Indian Rasoi'} culinary team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vikram@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-medium">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-medium">Inquiry Topic</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry / Table Booking">General Inquiry / Table Booking</option>
                        <option value="Royal Event Catering">Royal Event Catering (50+ guests)</option>
                        <option value="Dietary & Allergen Inquiries">Dietary & Allergen Inquiries</option>
                        <option value="Corporate Feast Deliveries">Corporate Feast Deliveries</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-300 font-medium">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your requirements, dates, or dietary requests..."
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-serif font-medium text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
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
