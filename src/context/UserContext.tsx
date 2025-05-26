import { createContext } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
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