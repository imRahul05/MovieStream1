import React from 'react';
import { FaXTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa6';

const socialLinks = [
  { icon: FaXTwitter, href: "https://x.com/imrahul165", color: "text-white" },
  { icon: FaFacebook, href: "https://x.com/imrahul165", color: "text-blue-600" },
  { icon: FaInstagram, href: "https://www.instagram.com/imrahul165", color: "text-pink-400" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/imrahul05/", color: "text-blue-700" },
  { icon: FaGithub, href: "https://www.github.com/imRahul05", color: "text-gray-400" },
];

const SocialIcons: React.FC = () => {
  return (
    <div className="flex justify-center space-x-6 my-6">
      {socialLinks.map(({ icon: Icon, href, color }, index) => (
        <a
          key={index}
          href={href}
          className={`${color} transform transition-all duration-300 hover:scale-125 hover:rotate-12`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={28} />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;

