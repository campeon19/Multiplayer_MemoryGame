import { createContext, useEffect, useState } from "react";
import client from "socket.io-client";

const Context = createContext({});


export function ContextSocketProvider({ children }) {
    const [Socket, setSocket] = useState(null);
    useEffect(() => {
        const SOCKET_URI = process.env.REACT_APP_SOCKET
        // const socket = client(SOCKET_URI)
        const socket = client('http://143.198.188.42:5000')
        setSocket(socket)

    }, [])
    return <Context.Provider value={Socket}>{children}</Context.Provider>;

}


export default Context;