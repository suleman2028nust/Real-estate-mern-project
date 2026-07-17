import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight, FaSearch, FaHome, FaKey } from 'react-icons/fa';
import { MdApartment } from 'react-icons/md';
import { Listing } from '../types';

export default function Home(): JSX.Element {
  const [offerListings, setOfferListings] = useState<Listing[]>([]);
  const [saleListings, setSaleListings] = useState<Listing[]>([]);
  const [rentListings, setRentListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl'></div>
        </div>
        <div className='relative max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-6'>
          <div className='inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm'>
            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
            Pakistan's Trusted Real Estate Platform
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl'>
            Find Your{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'>
              Perfect Home
            </span>{' '}
            in Pakistan
          </h1>
          <p className='text-slate-300 text-lg max-w-xl leading-relaxed'>
            Browse thousands of properties for sale and rent across Karachi,
            Lahore, Islamabad, and beyond.
          </p>
          <div className='flex flex-wrap gap-3 justify-center mt-2'>
            <Link
              to='/search?type=sale'
              className='flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:scale-105'
            >
              <FaHome /> Browse for Sale
            </Link>
            <Link
              to='/search?type=rent'
              className='flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-sm hover:scale-105'
            >
              <FaKey /> Browse for Rent
            </Link>
            <Link
              to='/search?offer=true'
              className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/30 hover:scale-105'
            >
              🔥 Hot Deals
            </Link>
          </div>
          {/* Stats */}
          <div className='flex flex-wrap gap-8 justify-center mt-8 pt-8 border-t border-white/10 w-full max-w-lg'>
            {[
              { label: 'Properties', value: '500+' },
              { label: 'Happy Clients', value: '1,200+' },
              { label: 'Cities', value: '15+' },
            ].map((s) => (
              <div key={s.label} className='text-center'>
                <p className='text-2xl font-bold text-white'>{s.value}</p>
                <p className='text-slate-400 text-sm'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider */}
      {offerListings && offerListings.length > 0 && (
        <section className='relative'>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            modules={[Navigation, Autoplay, Pagination]}
            className='h-[480px]'
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                    className='h-[480px] relative'
                  >
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8'>
                      <div className='text-white'>
                        <span className='bg-orange-500 text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block'>
                          Special Offer
                        </span>
                        <p className='text-2xl font-bold mt-1'>{listing.name}</p>
                        <p className='text-slate-300 text-sm mt-1 flex items-center gap-1'>
                          📍 {listing.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* Category Quick Links */}
      <section className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { icon: <FaHome className='text-2xl' />, label: 'Houses', link: '/search?type=sale', color: 'from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200' },
            { icon: <MdApartment className='text-2xl' />, label: 'Apartments', link: '/search?type=rent', color: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200' },
            { icon: <FaKey className='text-2xl' />, label: 'For Rent', link: '/search?type=rent', color: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200' },
            { icon: <span className='text-2xl'>🔥</span>, label: 'Hot Deals', link: '/search?offer=true', color: 'from-orange-50 to-orange-100 text-orange-700 border-orange-200' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.link}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-br ${cat.color} hover:scale-105 transition-all shadow-sm hover:shadow-md`}
            >
              {cat.icon}
              <span className='font-semibold text-sm'>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Listing Sections */}
      <div className='max-w-7xl mx-auto px-4 pb-16 flex flex-col gap-12'>
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h2 className='text-2xl font-bold text-slate-800'>🔥 Recent Offers</h2>
                <p className='text-slate-500 text-sm mt-1'>Limited-time discounted properties</p>
              </div>
              <Link
                to='/search?offer=true'
                className='flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium text-sm border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-all'
              >
                View All <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {rentListings && rentListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h2 className='text-2xl font-bold text-slate-800'>🏠 Places for Rent</h2>
                <p className='text-slate-500 text-sm mt-1'>Find your next rental home</p>
              </div>
              <Link
                to='/search?type=rent'
                className='flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium text-sm border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-all'
              >
                View All <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {saleListings && saleListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h2 className='text-2xl font-bold text-slate-800'>🏡 Places for Sale</h2>
                <p className='text-slate-500 text-sm mt-1'>Own your dream property</p>
              </div>
              <Link
                to='/search?type=sale'
                className='flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium text-sm border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-all'
              >
                View All <FaArrowRight className='text-xs' />
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Banner */}
      <section className='bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16'>
        <div className='max-w-3xl mx-auto text-center px-4 flex flex-col gap-5'>
          <h2 className='text-3xl font-bold'>Ready to list your property?</h2>
          <p className='text-slate-300'>
            Reach thousands of buyers and renters across Pakistan. It's fast, free, and easy.
          </p>
          <div className='flex gap-3 justify-center flex-wrap'>
            <Link
              to='/create-listing'
              className='bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg'
            >
              List a Property
            </Link>
            <Link
              to='/about'
              className='border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-semibold transition-all'
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
