import { Link } from 'react-router-dom';
import { MdLocationOn, MdBed, MdBathtub } from 'react-icons/md';
import { FaParking, FaCouch, FaTag } from 'react-icons/fa';
import { Listing } from '../types';

interface ListingItemProps {
  listing: Listing;
}

export default function ListingItem({ listing }: ListingItemProps): JSX.Element {
  return (
    <div className='bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl w-full sm:w-[320px] group'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative overflow-hidden'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'
            }
            alt='listing cover'
            className='h-[200px] w-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
          {/* Badge */}
          <div className='absolute top-3 left-3 flex gap-2'>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow ${
                listing.type === 'rent'
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              }`}
            >
              For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </span>
            {listing.offer && (
              <span className='px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-orange-500 shadow flex items-center gap-1'>
                <FaTag className='text-[10px]' /> Offer
              </span>
            )}
          </div>
        </div>

        <div className='p-4 flex flex-col gap-2'>
          <p className='truncate text-base font-bold text-slate-800 group-hover:text-slate-600 transition-colors'>
            {listing.name}
          </p>

          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-emerald-500 shrink-0' />
            <p className='text-xs text-slate-500 truncate'>{listing.address}</p>
          </div>

          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>

          <div className='flex items-center justify-between mt-1 pt-2 border-t border-slate-100'>
            <p className='text-slate-800 font-bold text-base'>
              Rs {listing.offer
                ? listing.discountPrice.toLocaleString('en-PK')
                : listing.regularPrice.toLocaleString('en-PK')}
              {listing.type === 'rent' && (
                <span className='text-xs font-normal text-slate-500'>/mo</span>
              )}
            </p>

            <div className='flex items-center gap-3 text-slate-500'>
              <span className='flex items-center gap-1 text-xs font-medium'>
                <MdBed className='text-base text-slate-400' />
                {listing.bedrooms}
              </span>
              <span className='flex items-center gap-1 text-xs font-medium'>
                <MdBathtub className='text-base text-slate-400' />
                {listing.bathrooms}
              </span>
              {listing.parking && (
                <span className='flex items-center gap-1 text-xs font-medium'>
                  <FaParking className='text-slate-400' />
                </span>
              )}
              {listing.furnished && (
                <span className='flex items-center gap-1 text-xs font-medium'>
                  <FaCouch className='text-slate-400' />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
