// This component is deprecated as we are using Environment Variables for authentication.
import React from 'react';

export const ApiKeyChecker: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  // Immediately report ready if this component is accidentally used, but return null to render nothing.
  React.useEffect(() => {
    onReady();
  }, [onReady]);
  
  return null;
};