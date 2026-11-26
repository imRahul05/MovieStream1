import React, { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

type Status = 'idle' | 'pending' | 'done';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status !== 'idle') return;
    setStatus('pending');
    timer.current = setTimeout(() => {
      setStatus('done');
      setEmail('');
    }, 650);
  };

  if (status === 'done') {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border border-brand/40 bg-brand-soft px-4 py-3 text-sm font-medium text-foreground animate-scale-in"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground animate-pop">
          <Check className="h-4 w-4" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-brand animate-blip"
          />
        </span>
        <span>You&rsquo;re on the list. Thanks for subscribing.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate={false}>
      <div className="group/field flex items-center gap-1 rounded-full border border-border bg-surface-elevated p-1 transition-all duration-300 focus-within:border-brand focus-within:shadow-[0_0_0_4px_var(--brand-soft),0_8px_30px_-10px_var(--brand-glow)]">
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address for newsletter"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'pending'}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand px-4 text-xs font-semibold text-brand-foreground transition-all duration-200 cursor-pointer hover:bg-brand-hover hover:shadow-[0_6px_18px_-6px_var(--brand-glow)] active:scale-95 disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {status === 'pending' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/field:translate-x-0.5" aria-hidden="true" />
            </>
          )}
          <span className="sr-only">{status === 'pending' ? 'Subscribing' : ''}</span>
        </button>
      </div>
    </form>
  );
};

export default NewsletterForm;
