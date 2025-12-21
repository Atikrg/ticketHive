import { create } from "zustand";
import type { SeatStoreState, Seat, SeatStatus } from "../types/seatsBooking.types";

export const useLayoutStore = create<SeatStoreState>((set) => ({
  seats: [],
  error: "",
  layout: null,

  setLayout: (layout) =>
    set((state) => ({
      layout:
        typeof layout === "function"
          ? layout(state.layout)
          : layout,
    })),

  setError: (error: string) => set({ error }),

  setSeats: (seats: Seat[]) => set({ seats }),

  updateSeat: (seatId: string, status: SeatStatus) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.seat === seatId ? { ...seat, status } : seat
      ),
    })),
}));
