import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FaEnvelope, FaLock, FaUser, FaHome } from 'react-icons/fa';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Form panel */}
      <div className='flex-1 flex items-center justify-center p-6 bg-slate-50'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-slate-800'>Create Account</h1>
              <p className='text-slate-500 text-sm mt-1'>Join thousands finding their perfect home</p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='relative'>
                <FaUser className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  placeholder='Username'
                  className='w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm'
                  id='username'
                  onChange={handleChange}
                />
              </div>
              <div className='relative'>
                <FaEnvelope className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  type='email'
                  placeholder='Email address'
                  className='w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div className='relative'>
                <FaLock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  type='password'
                  placeholder='Password'
                  className='w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm'
                  id='password'
                  onChange={handleChange}
                />
              </div>

              <button
                disabled={loading}
                className='w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 mt-1'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-4 w-4' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className='relative flex items-center gap-3'>
                <div className='flex-1 border-t border-slate-200' />
                <span className='text-slate-400 text-xs'>or continue with</span>
                <div className='flex-1 border-t border-slate-200' />
              </div>

              <OAuth />
            </form>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center'>
                {error}
              </div>
            )}

            <p className='text-center text-sm text-slate-500'>
              Already have an account?{' '}
              <Link to='/sign-in' className='text-slate-700 font-semibold hover:underline'>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div className='hidden lg:flex w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 items-center justify-center p-12 text-white'>
        <div className='max-w-sm text-center flex flex-col items-center gap-6'>
          <div className='w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center'>
            <FaHome className='text-3xl' />
          </div>
          <h2 className='text-3xl font-bold'>Start Your Journey</h2>
          <p className='text-slate-300 leading-relaxed'>
            Create a free account to list your property, browse thousands of homes,
            and connect with verified landlords across Pakistan.
          </p>
          <ul className='text-left text-slate-300 text-sm flex flex-col gap-3'>
            {['Free to list your property', 'Verified property listings', 'Direct landlord contact', 'Nationwide coverage'].map((f) => (
              <li key={f} className='flex items-center gap-2'>
                <span className='w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xs'>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
