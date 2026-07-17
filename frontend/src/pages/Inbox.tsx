import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaCalendarAlt, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import { Listing, Landlord } from '../types';
import { RootState } from '../redux/store';

interface Message {
  _id: string;
  type: 'INQUIRY' | 'TOUR_REQUEST' | 'OFFER';
  status: 'PENDING' | 'READ' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  senderRef: Landlord;
  receiverRef: Landlord;
  listingRef: Listing;
  amount?: number;
  date?: string;
  content: string;
}

export default function Inbox(): JSX.Element {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/message/get');
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setMessages(data);
        }
      } catch (err) {
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchMessages();
  }, [currentUser]);

  const handleUpdateStatus = async (id: string, newStatus: string): Promise<void> => {
    try {
      const res = await fetch(`/api/message/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success !== false) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m));
      }
    } catch (error) {
      console.log('Update failed', error);
    }
  };

  const getIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'INQUIRY': return <FaEnvelope className="text-slate-500" />;
      case 'TOUR_REQUEST': return <FaCalendarAlt className="text-blue-500" />;
      case 'OFFER': return <FaMoneyBillWave className="text-emerald-500" />;
      default: return <FaEnvelope />;
    }
  };

  const getStatusBadge = (status: string): JSX.Element | null => {
    switch (status) {
      case 'PENDING': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'READ': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Read</span>;
      case 'ACCEPTED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Accepted</span>;
      case 'REJECTED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-4 py-8 min-h-screen'>
      <h1 className='text-3xl font-bold text-slate-800 mb-8'>Your Inbox</h1>
      
      {loading ? (
        <p className='text-center text-slate-500'>Loading messages...</p>
      ) : error ? (
        <p className='text-center text-red-500'>{error}</p>
      ) : messages.length === 0 ? (
        <div className='text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100'>
          <p className='text-slate-500 text-lg'>Your inbox is empty.</p>
          <p className='text-slate-400 mt-2'>Interactions with your listings or offers you make will appear here.</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {messages.map((msg) => {
            const isReceived = msg.receiverRef._id === currentUser._id;
            return (
              <div key={msg._id} className={`bg-white p-5 rounded-2xl shadow-sm border ${isReceived && msg.status === 'PENDING' ? 'border-l-4 border-l-emerald-500 border-slate-100' : 'border-slate-100'}`}>
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                  
                  {/* Left Side: Context & Sender */}
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      {getIcon(msg.type)}
                      <span className='font-semibold text-slate-700'>
                        {msg.type === 'INQUIRY' ? 'Inquiry' : msg.type === 'TOUR_REQUEST' ? 'Tour Request' : 'Offer'}
                      </span>
                      {getStatusBadge(msg.status)}
                      <span className='text-xs text-slate-400 ml-auto sm:ml-0'>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className='text-sm text-slate-600 mb-3'>
                      <span className='font-medium'>{isReceived ? 'From: ' : 'To: '}</span>
                      {isReceived ? msg.senderRef.username : msg.receiverRef.username} 
                      <span className='text-slate-400 ml-2 text-xs'>
                        ({isReceived ? msg.senderRef.email : msg.receiverRef.email})
                      </span>
                    </div>

                    <Link to={`/listing/${msg.listingRef._id}`} className='flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors'>
                      <img src={msg.listingRef.imageUrls[0]} alt="listing" className='w-12 h-12 object-cover rounded' />
                      <span className='font-medium text-slate-700 hover:underline'>{msg.listingRef.name}</span>
                    </Link>
                  </div>

                  {/* Right Side: Content & Actions */}
                  <div className='flex-1 flex flex-col justify-between'>
                    <div className='bg-slate-50 p-4 rounded-xl'>
                      {msg.type === 'OFFER' && (
                        <p className='text-lg font-bold text-emerald-700 mb-2'>
                          Offered: Rs {msg.amount?.toLocaleString('en-PK')}
                        </p>
                      )}
                      {msg.type === 'TOUR_REQUEST' && (
                        <p className='text-sm font-semibold text-blue-700 mb-2'>
                          Requested Date: {new Date(msg.date).toLocaleString()}
                        </p>
                      )}
                      <p className='text-slate-600 text-sm whitespace-pre-wrap'>{msg.content || 'No additional notes provided.'}</p>
                    </div>

                    {/* Actions for receiver */}
                    {isReceived && msg.status === 'PENDING' && (
                      <div className='flex gap-2 mt-4 justify-end'>
                        <button 
                          onClick={() => handleUpdateStatus(msg._id, 'ACCEPTED')}
                          className='flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors'
                        >
                          <FaCheck /> Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(msg._id, 'REJECTED')}
                          className='flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors'
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                    
                    {/* Mark as read for simple inquiries */}
                    {isReceived && msg.status === 'PENDING' && msg.type === 'INQUIRY' && (
                       <div className='flex justify-end mt-4'>
                         <button 
                          onClick={() => handleUpdateStatus(msg._id, 'READ')}
                          className='text-slate-500 hover:text-slate-700 text-sm font-medium'
                        >
                          Mark as Read
                        </button>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
