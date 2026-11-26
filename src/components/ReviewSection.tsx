import { useRef, useState } from 'react';
import { Star, Send, MessageSquare, ChevronDown } from 'lucide-react';
import { Rating, RatingItem } from '@ui-sdk/react/rating';
import { addMovieReview, getLocalReviews } from '../services/api';
import { focusRing } from './details/dialogStyles';

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

const COLLAPSED = '4.6rem';
const LONG = 220;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '');
  return letters.toUpperCase();
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState<string>(COLLAPSED);
  const isLong = review.content.length > LONG;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    setHeight(next ? `${bodyRef.current?.scrollHeight ?? 600}px` : COLLAPSED);
  };

  return (
    <article
      className="animate-fade-up rounded-2xl border border-border bg-surface-elevated/50 p-4 transition-colors hover:border-border-strong sm:p-5"
      style={{ '--i': Math.min(index, 8) } as React.CSSProperties}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-soft font-display text-xs font-bold text-brand ring-1 ring-brand/30"
          >
            {initials(review.author)}
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">{review.author}</h4>
            <p className="font-mono text-[11px] text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {!!review.rating && (
          <div
            className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-gold"
            aria-label={`Rated ${review.rating}`}
          >
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            <span>{review.rating}</span>
          </div>
        )}
      </div>

      <div
        ref={bodyRef}
        id={`review-${review.id}`}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-(--ease-out-expo)"
        style={isLong ? { maxHeight: height } : undefined}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85 wrap-anywhere">
          {review.content}
        </p>
        {isLong && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-surface-elevated to-transparent transition-opacity duration-300 ${expanded ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={`review-${review.id}`}
          className={`mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md py-1 text-xs font-semibold text-brand hover:text-brand-hover ${focusRing}`}
        >
          {expanded ? 'Show less' : 'Read more'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      )}
    </article>
  );
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
        className="space-y-4 rounded-2xl border border-border bg-surface-elevated/60 p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">Rate &amp; Review</span>
          <div className="flex items-center gap-2.5">
            <Rating
              aria-label="Your movie rating"
              value={rating}
              onValueChange={(next) => {
                if (next !== null) setRating(next);
              }}
              className="inline-flex items-center gap-0.5"
            >
              <RatingItem className="cursor-pointer rounded text-muted-foreground/40 transition-all duration-200 ease-(--ease-spring) hover:scale-125 data-filled:text-gold data-highlighted:text-gold focus-within:ring-2 focus-within:ring-ring">
                {({ fill }) => (
                  <Star
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill={fill === 1 ? 'currentColor' : 'none'}
                  />
                )}
              </RatingItem>
            </Rating>
            <span className="font-mono text-xs font-semibold text-muted-foreground">{rating}/5</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            aria-label="Write your review"
            placeholder="Share your thoughts on the cinematography, pacing, or performances..."
            className="flex-1 resize-none rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newReview.trim()}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 self-end rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-all duration-300 hover:bg-brand-hover hover:shadow-[0_0_24px_var(--brand-glow)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none max-sm:w-full ${focusRing}`}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3.5">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong py-10 text-center text-muted-foreground">
          <MessageSquare className="mb-2 h-7 w-7 opacity-50" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">No reviews yet</p>
          <p className="mt-0.5 text-xs">Be the first to share your thoughts on this title.</p>
        </div>
      )}
    </div>
  );
}
