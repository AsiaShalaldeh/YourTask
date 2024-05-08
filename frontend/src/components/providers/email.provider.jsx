import { createContext, useContext, useState } from 'react';

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  const [email, setTempEmail] = useState(null);

  return (
    <EmailContext.Provider value={{ email, setTempEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
