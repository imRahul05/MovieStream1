import { useState } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import { Rating, RatingItem } from '@ui-sdk/react/rating';
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
  const [rating, setRating] = useState<number>(5);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.trim()) {
      const review = await addMovieReview(movieId, {
        content: newReview.trim(),
        rating,
      });
      setReviews([review, ...reviews]);
      setNewReview('');
      setRating(5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Composer */}
      <form
        onSubmit={handleSubmitReview}
        className="rounded-2xl border border-border bg-surface-elevated/60 p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            Rate &amp; Review
          </span>
          <div className="flex items-center gap-2">
            <Rating
              aria-label="Your movie rating"
              value={rating}
              onValueChange={(next) => {
                if (next !== null) setRating(next);
              }}
              className="inline-flex items-center gap-1"
            >
              <RatingItem className="cursor-pointer text-muted-foreground/40 transition-colors data-filled:text-gold">
                {({ fill }) => (
                  <Star
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill={fill === 1 ? 'currentColor' : 'none'}
                  />
                )}
              </RatingItem>
            </Rating>
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {rating}/5
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts on the cinematography, pacing, or performances..."
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newReview.trim()}
            className="inline-flex items-center justify-center gap-2 self-end sm:self-end rounded-xl bg-brand hover:bg-brand-hover px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3.5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-border bg-surface-elevated/40 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 font-display text-xs font-bold text-brand">
                    {review.author.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {review.author}
                    </h4>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {review.rating && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-gold">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{review.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                {review.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">
          <MessageSquare className="h-7 w-7 opacity-40 mb-2" />
          <p className="text-sm font-medium text-foreground">No reviews yet</p>
          <p className="text-xs mt-0.5">Be the first to share your thoughts on this title.</p>
        </div>
      )}
    </div>
  );
}