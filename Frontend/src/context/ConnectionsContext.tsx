import { createContext } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

export type ConnectionsContextType = {
    connections: User[];
    setConnections: React.Dispatch<React.SetStateAction<User[]>>;
};

export const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);
