import { io } from "socket.io-client";
import type { Seat } from "../../types/seatsBooking.types";

async function testDoubleBooking() {
  console.log("start");

  const clientA = io("http://localhost:5000");
  const clientB = io("http://localhost:5000");

  clientA.on("SEAT_UPDATE_FAILED", (data) =>
    console.log("A failed:", data)
  );

  clientB.on("SEAT_UPDATE_FAILED", (data) =>
    console.log("B failed:", data)
  );

  clientA.on("SEAT_UPDATED", (layout) =>
    console.log(
      "A updated:",
      layout.seats.find((s: Seat) => s.seat === "A3")
    )
  );

  clientB.on("SEAT_UPDATED", (layout) =>
    console.log(
      "B updated:",
      layout.seats.find((s: Seat) => s.seat === "A3")
    )
  );

  const payloadA = {
    seatId: "A3",
    userId: "d9c372fc-427e-4385-907a-290e337bc9ad",
    action: "BOOK_SEAT",
  };

  const payloadB = {
    seatId: "A3",
    userId: "HJBWBriZ_U8iopuQAAAB",
    action: "BOOK_SEAT",
  };

  await Promise.all([
    clientA.emit("UPDATE_USER_SEAT", payloadA),
    clientB.emit("UPDATE_USER_SEAT", payloadB),
  ]);

  setTimeout(() => {
    clientA.disconnect();
    clientB.disconnect();
  }, 2000);
}

testDoubleBooking();
