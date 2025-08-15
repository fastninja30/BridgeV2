import React, { createContext, ReactNode, useContext, useState } from 'react';

export type User = {
  name: string;
  age: number;
  bio: string;
  photos: string[];
};

const defaultUser: User = {
  name: 'John Doe',
  age: 23,
  bio: 'Adventure seeker and coffee lover. Always up for a good conversation!',
  photos: [],
};

type Ctx = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (patch: Partial<User>) => void;
};

const UserContext = createContext<Ctx | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const updateUser = (patch: Partial<User>) => setUser(prev => ({ ...prev, ...patch }));
  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
