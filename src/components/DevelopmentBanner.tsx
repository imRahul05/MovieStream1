import React, { useState, useEffect } from 'react';
import { Construction, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface DevelopmentBannerProps {
  message?: string;
  duration?: number;
}

const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({ 
  message = "This website is under active development. Some features may be incomplete.",
  duration = 10000
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        setVisible(false);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 w-[24rem] h-auto">
      <Alert className="w-full border-none bg-green-50/80 backdrop-blur-sm shadow-lg animate-fade-in px-2 py-2">
        <Construction className="h-2 w-2 text-green-600" />
        <AlertDescription className="text-green-700 px-2">
          {message}
        </AlertDescription>
        <button 
          onClick={() => setVisible(false)}
          className="ml-2 p-1 rounded-full hover:bg-green-100/80 transition-colors"
        >
          <X className="h-4 w-4 text-green-600" />
        </button>
      </Alert>
      <div className="h-1 bg-gray-200 rounded-full mt-1 w-full">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default DevelopmentBanner;