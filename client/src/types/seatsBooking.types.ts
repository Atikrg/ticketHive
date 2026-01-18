export type SeatStatus = 'available' | 'locked' | 'booked' | 'reserved';
import type { LayoutState } from "./layout.types";


export type UIStatus = "available" | "selected" | "locked" | "booked";

export interface Seat {
  seat: string;
  status: SeatStatus;
  lockedBy?: string;
  lockedUntil?: number;
}

export interface SeatStoreState {
  seats: Seat[];
  error: string;
  layout: LayoutState | null;

  setLayout: (layout: LayoutState | null) => void;
  setError: (error: string) => void;
}


