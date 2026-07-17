import { useState, useEffect, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { Review } from '../types';
import { RootState } from '../redux/store';

interface ReviewSectionProps {
  listingId: string;
}

export default function ReviewSection({ listingId }: ReviewSectionProps): JSX.Element {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setReviews(data);
        if (currentUser) {
          const userReview = data.find((r) => r.userRef._id === currentUser._id);
          if (userReview) setHasReviewed(true);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchReviews();
  }, [listingId, currentUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to leave a review.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, rating, comment }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setReviews([data, ...reviews]);
      setHasReviewed(true);
      setComment('');
      setRating(5);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const res = await fetch(`/api/review/delete/${reviewId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) return;
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setHasReviewed(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Reviews ({reviews.length})</h2>

      {/* Review Form */}
      {!hasReviewed && currentUser && (
        <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-600">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-xl ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 mb-3"
            rows="3"
            placeholder="Share your experience with this property..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            disabled={loading}
            className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-80"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {!currentUser && (
        <div className="mb-8 p-4 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
          Please log in to leave a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={review.userRef.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-800">{review.userRef.username}</p>
                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
            <p className="text-slate-700 mt-3">{review.comment}</p>
            {currentUser && currentUser._id === review.userRef._id && (
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-500 text-sm mt-3 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-slate-500">No reviews yet. Be the first to review!</p>}
      </div>
    </div>
  );
}
