import React, { useState } from 'react';
import { ConnectionsContext } from './ConnectionsContext';

type User = {
    id: number;
    name: string;
    email: string;
};

export const ConnectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connections, setConnections] = useState<User[]>([]);

    return (
        <ConnectionsContext.Provider value={{ connections, setConnections }}>
            {children}
        </ConnectionsContext.Provider>
    );
};
