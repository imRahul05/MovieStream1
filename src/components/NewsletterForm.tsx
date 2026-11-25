import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  if (subscribed) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs font-medium text-foreground">
        <Check className="h-4 w-4 text-emerald-500" />
        <span>You&rsquo;re on the list! Thanks for subscribing.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        aria-label="Email address for newsletter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-10 rounded-full border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-brand hover:bg-brand-hover px-5 text-xs font-semibold text-brand-foreground transition-colors cursor-pointer shrink-0"
      >
        <span>Subscribe</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
};

export default NewsletterForm;
