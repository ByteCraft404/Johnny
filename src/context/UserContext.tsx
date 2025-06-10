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
  // Initialize state with default empty values
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: '',
    role: '',
    department: '', // Initialize department as well
  });

  useEffect(() => {
    // Load user from sessionStorage after component mounts
    // This makes user data session-specific, clearing on tab/browser close
    const storedUser = sessionStorage.getItem('user'); // <-- Changed to sessionStorage
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure all properties match the User interface, provide defaults if missing
        setUser({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          avatar: parsedUser.avatar || '',
          role: parsedUser.role || '',
          department: parsedUser.department || '', // Ensure department is parsed/defaulted
        });
      } catch (error) {
        console.error("Failed to parse user from sessionStorage:", error);
        // Clear invalid data if parsing fails
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};