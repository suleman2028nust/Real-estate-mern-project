import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { FaEnvelope, FaLock, FaHome } from 'react-icons/fa';
import { RootState } from '../redux/store';

interface SignInFormData {
  email?: string;
  password?: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<SignInFormData>({});
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure((err as Error).message));
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left decorative panel */}
      <div className='hidden lg:flex w-1/2 bg-gradient-to-br from-slate-700 to-slate-900 items-center justify-center p-12 text-white'>
        <div className='max-w-sm text-center flex flex-col items-center gap-6'>
          <div className='w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center'>
            <FaHome className='text-3xl' />
          </div>
          <h2 className='text-3xl font-bold'>Welcome Back!</h2>
          <p className='text-slate-300 leading-relaxed'>
            Sign in to manage your listings, contact landlords, and find your
            perfect property across Pakistan.
          </p>
          <div className='flex gap-6 mt-4 text-center'>
            {(['500+', 'Listings'], ['15+', 'Cities'], ['1200+', 'Clients']) &&
              ([['500+', 'Listings'], ['15+', 'Cities'], ['1200+', 'Clients']] as [string, string][]).map(([v, l]) => (
                <div key={l}>
                  <p className='text-2xl font-bold'>{v}</p>
                  <p className='text-slate-400 text-sm'>{l}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className='flex-1 flex items-center justify-center p-6 bg-slate-50'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-slate-800'>Sign In</h1>
              <p className='text-slate-500 text-sm mt-1'>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
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
              Don't have an account?{' '}
              <Link to='/sign-up' className='text-slate-700 font-semibold hover:underline'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
