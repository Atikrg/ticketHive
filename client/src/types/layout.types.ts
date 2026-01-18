import type { Seat } from "./seatsBooking.types";


export interface LayoutState {
  id: string;
  rows: number;
  cols: number;
  createdAt: string;
  seats: Seat[];
}

