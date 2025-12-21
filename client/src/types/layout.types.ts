import type { Seat } from "./seatsBooking.types";


export interface LayoutState {
  id: string;
  rows: number;
  cols: number;
  seats: Record<string, Seat>;
}

export interface Layout {
    id: string;
    rows: number;
    cols: number;
    seats: Record<string, Seat>;
}