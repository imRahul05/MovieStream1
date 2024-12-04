import { useState } from 'react';
import { Star } from 'lucide-react';
import { addMovieReview, getLocalReviews } from '../services/api';

interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
}

interface ReviewSectionProps {
  movieId: string;
  initialReviews: Review[];
}

export default function ReviewSection({ movieId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const localReviews = getLocalReviews(movieId);
    return [...localReviews, ...initialReviews];
  });
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.trim()) {
      const review = await addMovieReview(movieId, {
        content: newReview,
        rating,
      });
      setReviews([review, ...reviews]);
      setNewReview('');
      setRating(5);
    }
  };

  return (
    <div className="border-t border-gray-800 pt-8">
      <h3 className="text-xl font-semibold text-white mb-6">Reviews & Comments</h3>

      <form onSubmit={handleSubmitReview} className="mb-8">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredStar ?? rating)
                    ? 'fill-yellow-400 stroke-yellow-400'
                    : 'stroke-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="flex-1 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newReview.trim()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-white">{review.author}</h4>
                <p className="text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              {review.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-white">{review.rating}</span>
                </div>
              )}
            </div>
            <p className="text-white/80">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}