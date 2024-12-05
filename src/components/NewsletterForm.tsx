import React, { useState } from 'react';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex flex-col sm:flex-row justify-center items-center">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />
        <button
          type="submit"
          className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-300"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
};

export default NewsletterForm;

