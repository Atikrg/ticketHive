import React, { useEffect } from "react";
import { toast } from "react-toastify";

import socket from "../utils/socket";
import { useLayoutStore } from "../store/useLayout.store";
import { useUserStore } from "../store/userStore.store";

import ConfirmBookingModal from "./ConfirmBookingModal/confirmBookingModal.component";
import { isContiguousSeatSelection } from "../handler";
import type { Seat, UIStatus } from "../types/seatsBooking.types";
import type { LayoutState } from "../types/layout.types";
/* ---------------- helpers ---------------- */

const getRowLabel = (index: number) =>
  String.fromCharCode(65 + index);


const seatStyles: Record<UIStatus, string> = {
  available: "bg-green-500 hover:bg-green-600 cursor-pointer",
  selected: "bg-amber-500 hover:bg-amber-600",
  locked: "bg-gray-400 cursor-not-allowed",
  booked: "bg-red-500 cursor-not-allowed",
};


const SeatsGrid = () => {
  const { layout, setLayout } = useLayoutStore();
  const { userUniqueId, selectedSeat, setSelectedSeat } = useUserStore();



  useEffect(() => {
    const handleSeatUpdate = (updatedLayout: LayoutState) => {
      setLayout(updatedLayout);
    };

    const handleSeatUpdateFailed = ({ reason }: { reason: string }) => {
      toast.error(reason);
    };

    socket.on("SEAT_UPDATED", handleSeatUpdate);
    socket.on("SEAT_UPDATE_FAILED", handleSeatUpdateFailed);

    return () => {
      socket.off("SEAT_UPDATED", handleSeatUpdate);
      socket.off("SEAT_UPDATE_FAILED", handleSeatUpdateFailed);
    };
  }, []); // ✅ empty dependency



  const seats = layout?.seats;

  const seatMap = seats
    ? new Map(Object.values(seats).map(seat => [seat.seat, seat]))
    : new Map<string, Seat>();


  const handleSeatClick = (seatId: string) => {
    if (!layout) return;

    const seat = seatMap.get(seatId);

    if (!seat || seat.status === "booked") return;

    if (
      seat.status === "reserved" &&
      seat.lockedBy !== userUniqueId
    ) {
      toast.warning("Seat already reserved");
      return;
    }

    if (
      seat.status !== "reserved" &&
      !isContiguousSeatSelection(layout.seats, seat)
    ) {
      toast.error("Please select contiguous seats");
      return;
    }

    setSelectedSeat(seatId);
  };

  const emitSeatAction = (
    action: "BOOK_SEAT" | "RESERVE_SEAT"
  ) => {
    if (!selectedSeat) return;

    socket.emit("UPDATE_USER_SEAT", {
      seatId: selectedSeat,
      userId: userUniqueId,
      action,
    });

    setSelectedSeat(null);
  };

  const getUIStatus = (seat?: Seat): UIStatus => {
    if (!seat) return "available";
    if (seat.status === "booked") return "booked";
    if (seat.status === "reserved") {
      return seat.lockedBy === userUniqueId
        ? "selected"
        : "locked";
    }
    return "available";
  };



  if (!layout) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="inline-block bg-gray-100 p-4 rounded-xl">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `30px repeat(${layout.cols}, 44px)`,
          }}
        >
          <div />
          {Array.from({ length: layout.cols }).map((_, c) => (
            <div
              key={c}
              className="text-xs text-center text-gray-500"
            >
              {c + 1}
            </div>
          ))}

          {Array.from({ length: layout.rows }).map((_, r) => (
            <React.Fragment key={r}>
              <div className="text-xs font-semibold text-gray-500 flex items-center">
                {getRowLabel(r)}
              </div>

              {Array.from({ length: layout.cols }).map((_, c) => {
                const seatId = `${getRowLabel(r)}${c + 1}`;
                const seat = seatMap.get(seatId);
                const uiStatus = getUIStatus(seat);

                return (
                  <div
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    className={`h-10 w-10 rounded-lg text-white text-xs flex items-center justify-center transition ${seatStyles[uiStatus]}`}
                  >
                    {seatId}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {selectedSeat && (
        <ConfirmBookingModal
          cancelBooking={() => setSelectedSeat(null)}
          confirmBooking={() => emitSeatAction("BOOK_SEAT")}
          confirmHold={() => emitSeatAction("RESERVE_SEAT")}
        />
      )}
    </div>
  );
};

export default SeatsGrid;