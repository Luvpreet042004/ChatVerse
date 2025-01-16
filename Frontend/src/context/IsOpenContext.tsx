import React from "react";

// Define the shape of the context
export type IsOpenContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context
export const IsOpenContext = React.createContext<IsOpenContextType | undefined>(undefined);
