import { FaSearch, FaHome, FaInfoCircle, FaUser, FaPlus, FaInbox, FaHeart } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
    else setSearchTerm('');
  }, [location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-md'
      }`}
    >
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4 py-3 gap-3'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 shrink-0'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center'>
            <FaHome className='text-white text-sm' />
          </div>
          <h1 className='font-bold text-lg hidden sm:flex'>
            <span className='text-slate-500'>Sahand</span>
            <span className='text-slate-800'>Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl px-4 py-2 gap-2 flex-1 max-w-md'
        >
          <FaSearch className='text-slate-400 shrink-0' />
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent focus:outline-none text-sm w-full text-slate-700 placeholder-slate-400'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Nav */}
        <nav className='flex items-center gap-1'>
          <Link
            to='/'
            className='hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all text-sm font-medium'
          >
            <FaHome className='text-xs' />
            Home
          </Link>
          <Link
            to='/about'
            className='hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all text-sm font-medium'
          >
            <FaInfoCircle className='text-xs' />
            About
          </Link>
          <Link
            to='/search'
            className='hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all text-sm font-medium'
          >
            Properties
          </Link>

          {currentUser ? (
            <div className='flex items-center gap-2 ml-1'>
              <Link
                to='/create-listing'
                className='flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all'
              >
                <FaPlus className='text-xs' />
                <span className='hidden sm:inline'>List Property</span>
              </Link>
              <Link
                to='/favorites'
                className='flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-red-500 transition-all relative'
                title="Favorites"
              >
                <FaHeart />
              </Link>
              <Link
                to='/inbox'
                className='flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all relative'
                title="Inbox"
              >
                <FaInbox />
              </Link>
              <Link to='/profile'>
                <img
                  className='rounded-full h-9 w-9 object-cover ring-2 ring-slate-200 hover:ring-slate-400 transition-all'
                  src={currentUser.avatar}
                  alt='profile'
                />
              </Link>
            </div>
          ) : (
            <div className='flex items-center gap-2 ml-1'>
              <Link
                to='/sign-in'
                className='px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 text-sm font-medium transition-all'
              >
                Sign In
              </Link>
              <Link
                to='/sign-up'
                className='px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium transition-all'
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
