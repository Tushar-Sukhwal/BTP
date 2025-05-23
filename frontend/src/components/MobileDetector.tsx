import { useEffect, useState } from 'react';

export const useMobileDetector = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = 
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};
