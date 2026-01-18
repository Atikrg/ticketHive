import { create } from "zustand";
import type { SeatStoreState } from "../types/seatsBooking.types";

export const useLayoutStore = create<SeatStoreState>((set) => ({
  seats: [],
  error: "",
  layout: null,

  setLayout: (layout) =>
    set({
      layout: layout
        ? {
          ...layout,
          seats: Array.isArray(layout.seats)
            ? layout.seats
            : Object.values(layout.seats ?? {}),
        }
        : null,
    }),

  setError: (error) =>
    set({
      error,
    }),
}));
