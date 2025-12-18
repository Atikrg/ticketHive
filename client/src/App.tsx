import { useEffect } from "react";
import socket from "./utils/socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 connected:", socket.id);
    });

    socket.on("seat-update", (data) => {
      console.log("seat update", data);
    });

    return () => {
      socket.off("seat-update");
    };
  }, []);

  return <div>App</div>;
}

export default App;
