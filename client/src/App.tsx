import { useEffect } from "react";
import socket from "./utils/socket";
import InputComponent from "./components/Input.component";
import GenerateSeats from "./components/Seats.component";
import { useUserStore } from "./store/userStore.store";
function App() {
  const { userUniqueId, setUserUniqueId } = useUserStore();


  useEffect(() => {
    socket.on("connect", () => {
      if (!userUniqueId) {
        const userId = socket.id;
        if (!userId) return;
        setUserUniqueId(userId);
      }

    });

    return () => {
      socket.off("connect");
    };
  }, [])


  return <div className="place-items-center">
    <h4 className="mt-4 text-[24px]">TICKET HIVE</h4>
    <InputComponent />
    <GenerateSeats />
  </div>;
}

export default App;
