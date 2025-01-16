import React from "react";
import { IsOpenContext } from "../context/IsOpenContext";


export const useIsOpenContext = () => {
    const context = React.useContext(IsOpenContext);
    if (context === undefined) {
        throw new Error("useIsOpen must be used within a IsOpenProvider");
    }
    return context;
};