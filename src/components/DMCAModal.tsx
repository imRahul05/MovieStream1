import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
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
      <DialogBackdrop className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border-strong bg-surface p-6 sm:p-8 text-foreground shadow-2xl transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              DMCA Notice
            </DialogTitle>
          </div>
          <DialogClose
            aria-label="Close DMCA Notice"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        <DialogDescription className="text-sm leading-relaxed text-muted-foreground mb-5">
          We take the intellectual property rights of others seriously and require that our users do the same. The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you believe that any content on our website is infringing upon your copyrights, please send us an email. Please allow up to 2–5 business days for a response.
        </DialogDescription>

        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-2.5">
          DMCA Report Requirements
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-5">
          <li>A description of the copyrighted work that you claim is being infringed;</li>
          <li>
            A description of the material you claim is infringing and that you want removed or access to which you want disabled with a URL and proof you are the original owner;
          </li>
          <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
          <li>
            The following statements:
            <ul className="list-disc pl-5 mt-1.5 space-y-1">
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs font-mono text-muted-foreground">
            Contact:{' '}
            <a href="mailto:dmca@coen.ovh" className="text-foreground underline hover:text-brand">
              dmca@coen.ovh
            </a>
          </p>
          <DialogClose className="inline-flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover px-5 py-2 text-xs font-semibold text-brand-foreground transition-colors cursor-pointer">
            Close Notice
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DMCAModal;
