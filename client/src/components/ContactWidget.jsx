import { useState } from 'react';
import { FaEnvelope, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

export default function ContactWidget({ listing, currentUser }) {
  const [activeTab, setActiveTab] = useState('INQUIRY'); // INQUIRY, TOUR_REQUEST, OFFER
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to contact the landlord.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = {
        listingRef: listing._id,
        receiverRef: listing.userRef,
        type: activeTab,
        content: message,
      };

      if (activeTab === 'OFFER') payload.amount = amount;
      if (activeTab === 'TOUR_REQUEST') payload.date = date;

      const res = await fetch('/api/message/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        setSuccess(true);
        setMessage('');
        setAmount('');
        setDate('');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-2xl shadow-lg border border-slate-100'>
      <h3 className='text-xl font-bold text-slate-800 mb-4'>Contact Landlord</h3>
      
      {/* Tabs */}
      <div className='flex border-b border-slate-200 mb-6'>
        <button
          onClick={() => { setActiveTab('INQUIRY'); setSuccess(false); setError(null); }}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'INQUIRY' ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FaEnvelope /> Inquiry
        </button>
        <button
          onClick={() => { setActiveTab('TOUR_REQUEST'); setSuccess(false); setError(null); }}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'TOUR_REQUEST' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FaCalendarAlt /> Tour
        </button>
        <button
          onClick={() => { setActiveTab('OFFER'); setSuccess(false); setError(null); }}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'OFFER' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FaMoneyBillWave /> Offer
        </button>
      </div>

      {success && (
        <div className='p-4 mb-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200'>
          {activeTab === 'INQUIRY' && 'Your message has been sent successfully!'}
          {activeTab === 'TOUR_REQUEST' && 'Your tour request has been sent! The landlord will confirm soon.'}
          {activeTab === 'OFFER' && 'Your offer has been submitted! Good luck.'}
        </div>
      )}

      {error && (
        <div className='p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200'>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {activeTab === 'OFFER' && (
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Offer Amount (Rs)</label>
            <input
              type='number'
              required
              min='0'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`e.g. ${listing.offer ? listing.discountPrice : listing.regularPrice}`}
              className='w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none'
            />
          </div>
        )}

        {activeTab === 'TOUR_REQUEST' && (
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Preferred Date & Time</label>
            <input
              type='datetime-local'
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            {activeTab === 'INQUIRY' ? 'Message' : 'Additional Notes (Optional)'}
          </label>
          <textarea
            required={activeTab === 'INQUIRY'}
            rows='3'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              activeTab === 'INQUIRY' ? "I'm interested in this property..." : "Any special requirements or terms..."
            }
            className='w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none resize-none'
          ></textarea>
        </div>

        <button
          disabled={loading || !currentUser}
          type='submit'
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all disabled:opacity-50 ${
            activeTab === 'INQUIRY' ? 'bg-slate-800 hover:bg-slate-900' :
            activeTab === 'TOUR_REQUEST' ? 'bg-blue-600 hover:bg-blue-700' :
            'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {loading ? 'Sending...' : 
            !currentUser ? 'Log in to interact' :
            activeTab === 'INQUIRY' ? 'Send Message' :
            activeTab === 'TOUR_REQUEST' ? 'Request Tour' :
            'Submit Offer'
          }
        </button>
      </form>
    </div>
  );
}
