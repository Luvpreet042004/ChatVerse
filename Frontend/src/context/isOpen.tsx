import React,{ReactNode , useState} from "react";
import { IsOpenContext } from "./IsOpenContext";

export const IsOpenProvider: React.FC<{children : ReactNode}> = ({ children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </IsOpenContext.Provider>
    );
}; 