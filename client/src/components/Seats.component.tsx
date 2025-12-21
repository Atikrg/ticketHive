import React, { useEffect } from "react";
import { useLayoutStore } from "../store/useLayout.store";
import socket from "../utils/socket"; // your socket.io client instance
import { useUserStore } from "../store/userStore.store";
import ConfirmBookingModal from "./ConfirmBookingModal/confirmBookingModal.component";
import type { Seat } from "../types/seatsBooking.types";

import type { LayoutState } from "../types/layout.types";

export default function Seats() {
  const { layout, setLayout, } = useLayoutStore();
  const { userUniqueId, selectedSeat, setSelectedSeat } = useUserStore();

  useEffect(() => {
    socket.on("LAYOUT_CREATED", (layout) => {
      setLayout(layout);
    });

    socket.on("SEAT_UPDATED", ({ seatId, newStatus, lockedBy }) => {
      setLayout((prev: LayoutState | null) => {
        if (!prev) return prev;

        return {
          ...prev,
          seats: {
            ...prev.seats,
            [seatId]: {
              ...prev.seats[seatId],
              status: newStatus,
              lockedBy,
            },
          },
        };
      });
    });


    return () => {
      socket.off("LAYOUT_CREATED");
      socket.off("SEAT_UPDATED");
    };
  }, [setLayout]);


  const getRowLabel = (index: number) => String.fromCharCode(65 + index);

  const handleSeatClick = (seatId: string) => {
    if (!layout) return;

    const seat = layout.seats[seatId];
    if (!seat || seat?.status === "booked" || seat?.status === "locked") return;

    // Open modal to confirm booking
    setSelectedSeat(seatId);
  };

  const confirmBooking = () => {

    if (!selectedSeat) return;
    // emit the BOOK_SEAT event
    socket.emit("UPDATE_USER_SEAT", {
      seatId: selectedSeat,
      userId: userUniqueId,
      action: "BOOK_SEAT",
    });

    socket.on("SEAT_UPDATED", (layout) => {
      setLayout(layout);
    });

    setSelectedSeat(null); // close modal
  };

  const cancelBooking = () => {
    setSelectedSeat(null);
  };



  const confirmHold = () => {
    if (!selectedSeat) return;
    socket.emit("UPDATE_USER_SEAT", {
      seatId: selectedSeat,
      userId: userUniqueId,
      action: "RESERVE_SEAT",
    });

    socket.on("SEAT_UPDATED", (layout) => {

      setLayout(layout);
    });

    setSelectedSeat(null); // close modal
  }



  return (
    <div className="p-6 space-y-6">
      {layout && (
        <div className="inline-block bg-gray-100 p-4 rounded-xl mt-4">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `30px repeat(${layout.cols}, 44px)` }}
          >
            <div />
            {Array.from({ length: layout.cols }).map((_, c) => (
              <div key={`col-${c}`} className="text-xs text-center text-gray-500">
                {c + 1}
              </div>
            ))}

            {Array.from({ length: layout.rows }).map((_, r) => (
              <React.Fragment key={r}>
                <div className="text-xs font-semibold text-gray-500 flex items-center">
                  {getRowLabel(r)}
                </div>
                {Array.from({ length: layout.cols }).map((_, c) => {
                  const seatId: string = `${getRowLabel(r)}${c + 1}`;
                  const seat: Seat & { lockedBy?: string } = layout.seats[seatId];

                  // Determine UI status
                  let uiStatus: "available" | "selected" | "locked" | "booked" = "available";

                  if (seat?.status === "available") uiStatus = "available";
                  else if (seat?.status === "reserved")
                    uiStatus = seat?.lockedBy === userUniqueId ? "selected" : "locked";
                  else if (seat?.status === "booked") uiStatus = "booked";

                  // Map UI status to Tailwind colors
                  const bgColor =
                    uiStatus === "available"
                      ? "bg-green-500 hover:bg-green-600"
                      : uiStatus === "selected"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : uiStatus === "locked"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 cursor-not-allowed";

                  return (
                    <div
                      key={seatId}
                      className={`h-10 w-10 rounded-lg text-white text-xs flex items-center justify-center transition ${bgColor}`}
                      onClick={() => handleSeatClick(seatId)}
                    >
                      {seatId}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedSeat && (
        <ConfirmBookingModal cancelBooking={cancelBooking} confirmBooking={confirmBooking} confirmHold={confirmHold} />
      )}
    </div>
  );
}
