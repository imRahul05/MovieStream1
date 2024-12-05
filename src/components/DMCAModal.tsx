import React from 'react';

interface DMCAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DMCAModal: React.FC<DMCAModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">DMCA Notice</h2>
        <p className="mb-4">
          We take the intellectual property rights of others seriously and require that our users do the same. The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you believe that any content on our website is infringing upon your copyrights, please send us an email. Please allow up to 2-5 business days for a response.
        </p>
        <h3 className="text-xl font-semibold mb-2">DMCA Report requirements:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>A description of the copyrighted work that you claim is being infringed;</li>
          <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled with a URL and proof you are the original owner or other location of that material;</li>
          <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
          <li>The following statements:</li>
          <ul className="list-disc list-inside ml-4">
            <li>"I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)"</li>
            <li>"The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed"</li>
            <li>"I understand that I am subject to legal action upon submitting a DMCA request without solid proof."</li>
          </ul>
          <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.</li>
        </ul>
        <p className="mb-4">Contact: dmca@coen.ovh</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DMCAModal;

