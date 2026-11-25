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
    <div className="flex items-center gap-2 pt-1">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground hover:border-border-strong hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
