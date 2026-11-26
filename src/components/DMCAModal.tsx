import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { dialogBackdropClass, dialogPanelMotion, focusRing } from './details/dialogStyles';
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@ui-sdk/react/dialog';

interface DMCAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DMCAModal: React.FC<DMCAModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogBackdrop className={dialogBackdropClass} />
      <DialogContent className={`fixed left-1/2 top-1/2 z-50 m-0 w-[calc(100%-1.5rem)] max-w-2xl max-h-[88dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-border-strong bg-surface p-0 text-foreground shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ${dialogPanelMotion}`}>
        <div className="relative p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(60%_100%_at_20%_0%,var(--brand-soft),transparent)]" aria-hidden="true" />
        <div className="relative mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/30">
              <span className="animate-blip absolute inset-0 rounded-xl bg-brand/20" aria-hidden="true" />
              <ShieldAlert className="relative h-5 w-5" aria-hidden="true" />
            </span>
            <DialogTitle className="font-display text-xl font-extrabold tracking-tight text-foreground">
              DMCA Notice
            </DialogTitle>
          </div>
          <DialogClose
            aria-label="Close DMCA Notice"
            className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-border text-muted-foreground transition-all duration-300 hover:rotate-90 hover:bg-surface-hover hover:text-foreground ${focusRing}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </DialogClose>
        </div>

        <DialogDescription className="relative mb-5 text-sm leading-relaxed text-muted-foreground">
          We take the intellectual property rights of others seriously and require that our users do the same. The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you believe that any content on our website is infringing upon your copyrights, please send us an email. Please allow up to 2–5 business days for a response.
        </DialogDescription>

        <h3 className="relative mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
          DMCA Report Requirements
        </h3>
        <ul className="relative mb-5 list-disc space-y-2 pl-5 text-sm text-muted-foreground marker:text-brand">
          <li>A description of the copyrighted work that you claim is being infringed;</li>
          <li>
            A description of the material you claim is infringing and that you want removed or access to which you want disabled with a URL and proof you are the original owner;
          </li>
          <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
          <li>
            The following statements:
            <ul className="mt-1.5 list-disc space-y-1 pl-5 marker:text-brand">
              <li>
                &ldquo;I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use).&rdquo;
              </li>
              <li>
                &ldquo;The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed.&rdquo;
              </li>
              <li>
                &ldquo;I understand that I am subject to legal action upon submitting a DMCA request without solid proof.&rdquo;
              </li>
            </ul>
          </li>
          <li>
            An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner&rsquo;s behalf.
          </li>
        </ul>

        <div className="relative flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
          <p className="text-xs font-mono text-muted-foreground">
            Contact:{' '}
            <a href="mailto:dmca@coen.ovh" className={`rounded text-foreground underline underline-offset-2 hover:text-brand ${focusRing}`}>
              dmca@coen.ovh
            </a>
          </p>
          <DialogClose className={`inline-flex cursor-pointer items-center justify-center rounded-sm bg-brand px-5 py-2.5 text-xs font-semibold text-brand-foreground transition-all duration-300 hover:bg-brand-hover hover:shadow-[0_0_24px_var(--brand-glow)] active:scale-95 ${focusRing}`}>
            Close Notice
          </DialogClose>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DMCAModal;
