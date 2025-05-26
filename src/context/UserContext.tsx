import React, { createContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
  department?: string; // <-- Add this line
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType>({
  user: {
    name: '',
    email: '',
    avatar: '',
    role: ''
  },
  setUser: () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    role: '',
  });

  useEffect(() => {
    // Load user from localStorage or backend after login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};