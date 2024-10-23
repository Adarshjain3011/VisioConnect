import React, { useMemo } from "react";
import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {

    return useContext(SocketContext);
    
}

export const SocketProvider = (props) => {

    const socket = useMemo(() => {

        return io("http://localhost:8001"); // Corrected the usage of useMemo

    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    );
}
