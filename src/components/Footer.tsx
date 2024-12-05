import React, { useState } from 'react';
import SocialIcons from './SocialIcons';
import NewsletterForm from './NewsletterForm'
import DMCAModal from '../components/DMCAModal';

const Footer: React.FC = () => {
  const [isDMCAModalOpen, setIsDMCAModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">MovieStream</h3>
            <p className="mb-4">Bringing the cinema experience to your home.</p>
            <SocialIcons />
          </div>
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Movies</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">TV Shows</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-xl font-semibold mb-4">Stay Updated</h4>
            <p className="mb-4">Subscribe to my newsletter.</p>
            <NewsletterForm />
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="text-center">
          <p className="mb-4">&copy; {currentYear} MovieStream. All rights reserved.</p>
          <p className="mb-4">Made with ❤️ by Rahul</p>
          <p className="mb-4 text-sm text-gray-400">This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p>
          <button
            onClick={() => setIsDMCAModalOpen(true)}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
          >
            DMCA Notice
          </button>
        </div>
      </div>
      <DMCAModal isOpen={isDMCAModalOpen} onClose={() => setIsDMCAModalOpen(false)} />
    </footer>
  );
};

export default Footer;

