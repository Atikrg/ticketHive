export type SeatStatus = "available" | "locked" | "booked";


export interface Seat {
  seat: string;
  status: SeatStatus;
  lockedBy?: string;
  lockedUntil?: Date;
  bookedBy?: string;
}

export interface Bus {
  _id: string;
  rows: number;
  cols: number;
  seats: Record<string, Seat>;
  createdAt: Date;
}