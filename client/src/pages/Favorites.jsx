import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';

export default function Favorites() {
  const { currentUser } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/favorite/user/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setFavorites(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const res = await fetch(`/api/favorite/remove/${favoriteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto min-h-screen'>
      <h1 className='text-3xl font-semibold text-center my-7 flex items-center justify-center gap-2'>
        <FaHeart className="text-red-500" /> Your Saved Properties
      </h1>

      {loading && <p className='text-center text-slate-700'>Loading...</p>}
      {error && <p className='text-center text-red-700'>{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p className='text-center text-slate-700'>
          You have not saved any properties to your favorites yet.
        </p>
      )}

      <div className='flex flex-col gap-4 mt-7'>
        {favorites.map((fav) => {
          const listing = fav.listingRef;
          // Handle case where listing was deleted but favorite remains
          if (!listing) return null;

          return (
            <div
              key={fav._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-sm'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-cover rounded-md'
                />
              </Link>
              <div className='flex-1 truncate'>
                <Link
                  className='text-slate-700 font-semibold hover:underline truncate text-lg'
                  to={`/listing/${listing._id}`}
                >
                  {listing.name}
                </Link>
                <p className='text-slate-500 text-sm truncate'>
                  {listing.address}
                </p>
              </div>

              <div className='flex flex-col items-center gap-2'>
                <button
                  onClick={() => handleRemoveFavorite(fav._id)}
                  className='text-red-700 uppercase hover:text-red-900 flex items-center gap-1 text-sm'
                >
                  <FaTrash /> Remove
                </button>
                <Link to={`/listing/${listing._id}`}>
                  <button className='bg-slate-700 text-white rounded-lg px-3 py-1 uppercase text-sm hover:opacity-95'>
                    View
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
