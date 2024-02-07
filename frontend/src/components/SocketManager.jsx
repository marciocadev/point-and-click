import { createContext, useContext } from "react";
import useWebSocket from 'react-use-websocket';
import { atom, useAtom } from "jotai";

const URL = `${window.wingEnv.wsUrl.replace("127.0.0.1", "localhost")}`;
const SocketContext = createContext();

export const charactersAtom = atom([])

export const SocketManager = ({ children }) => {
  const [_characters, setCharacters] = useAtom(charactersAtom)

  const { sendMessage, lastMessage, readyState } = useWebSocket(URL, {
    onOpen: () => {
      console.log('connected')
      sendMessage(
        JSON.stringify({
          type: "broadcast"
        })
      )
    },
    onClose: () => {
      console.log('disconnected')
    },
    onMessage: (event) => {
      let obj = JSON.parse(event.data)
      if (obj["type"] === "characters") {
        console.log(obj["data"])
        setCharacters(obj["data"])
      }
    },
  });

  // Expose the sendMessage function through the context
  const contextValue = {
    sendMessage,
    lastMessage,
    readyState,
  };

  return (
    <SocketContext.Provider value={contextValue} >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}