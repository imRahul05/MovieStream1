import React from 'react';
import { FaXTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa6';

const socialLinks = [
  { icon: FaXTwitter, href: 'https://x.com/imrahul165', label: 'X (Twitter)' },
  { icon: FaInstagram, href: 'https://www.instagram.com/imrahul165', label: 'Instagram' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/imrahul05/', label: 'LinkedIn' },
  { icon: FaGithub, href: 'https://www.github.com/imRahul05', label: 'GitHub' },
  { icon: FaFacebook, href: 'https://x.com/imrahul165', label: 'Facebook' },
];

const SocialIcons: React.FC = () => {
  return (
    <ul className="flex flex-wrap items-center gap-2 pt-1" aria-label="Social links">
      {socialLinks.map(({ icon: Icon, href, label }, i) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transitionDelay: `${i * 12}ms` }}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-all duration-300 ease-(--ease-spring) hover:-translate-y-1 hover:border-brand hover:bg-brand-soft hover:text-brand hover:shadow-[0_10px_22px_-10px_var(--brand-glow)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialIcons;
