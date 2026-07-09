import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import ContactWidget from '../components/ContactWidget';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation modules={[Navigation]}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col md:flex-row max-w-6xl mx-auto p-3 my-7 gap-8'>
            {/* Left Column: Listing Details */}
            <div className='flex-1 flex flex-col gap-4'>
              <p className='text-3xl font-bold text-slate-800'>
                {listing.name} 
              </p>
              <p className='text-2xl font-semibold text-emerald-600'>
                Rs{' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-PK')
                  : listing.regularPrice.toLocaleString('en-PK')}
                {listing.type === 'rent' && <span className='text-sm text-slate-500 font-normal'> / month</span>}
              </p>
              <p className='flex items-center gap-2 text-slate-600 font-medium'>
                <FaMapMarkerAlt className='text-emerald-500' />
                {listing.address}
              </p>
              <div className='flex gap-4 mt-2'>
                <p className='bg-blue-100 text-blue-800 px-4 py-1.5 font-semibold rounded-full'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-orange-100 text-orange-800 px-4 py-1.5 font-semibold rounded-full'>
                    Save Rs {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-PK')}
                  </p>
                )}
              </div>
              
              <div className='bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4'>
                <h3 className='text-lg font-bold text-slate-800 mb-3'>Description</h3>
                <p className='text-slate-600 leading-relaxed whitespace-pre-wrap'>
                  {listing.description}
                </p>
              </div>

              <ul className='text-slate-700 bg-white shadow-sm border border-slate-100 rounded-2xl p-6 font-medium flex flex-wrap gap-x-8 gap-y-4'>
                <li className='flex items-center gap-2'>
                  <div className='p-2 bg-emerald-50 text-emerald-600 rounded-lg'><FaBed className='text-lg' /></div>
                  {listing.bedrooms} Beds
                </li>
                <li className='flex items-center gap-2'>
                  <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'><FaBath className='text-lg' /></div>
                  {listing.bathrooms} Baths
                </li>
                <li className='flex items-center gap-2'>
                  <div className='p-2 bg-purple-50 text-purple-600 rounded-lg'><FaParking className='text-lg' /></div>
                  {listing.parking ? 'Parking available' : 'No parking'}
                </li>
                <li className='flex items-center gap-2'>
                  <div className='p-2 bg-orange-50 text-orange-600 rounded-lg'><FaChair className='text-lg' /></div>
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>
            </div>

            {/* Right Column: Contact Widget */}
            <div className='md:w-[400px] shrink-0'>
              <div className='sticky top-24'>
                {currentUser?._id === listing.userRef ? (
                  <div className='bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-2xl'>
                    <h3 className='font-bold text-lg mb-2'>This is your listing</h3>
                    <p className='text-sm mb-4'>You can update or delete this property from your profile dashboard.</p>
                    <Link to='/profile' className='inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <ContactWidget listing={listing} currentUser={currentUser} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
