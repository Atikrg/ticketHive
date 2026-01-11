

export enum SeatStatus {
  available = "available",
  reserved = "reserved",
  booked = "booked",
}


export enum SeatAction {
  BOOK_SEAT = "BOOK_SEAT",
  RESERVE_SEAT = "RESERVE_SEAT",
  AVAILABLE_SEAT = "AVAILABLE_SEAT"

}


export type SeatStatusValue = `${SeatStatus}`;

export type MongoStatusFilter =
  | SeatStatusValue
  | { $in: SeatStatusValue[] };

export interface Seat {
  seat: string;
  status: SeatStatus;
  lockedBy?: string;
  lockedUntil?: Date;
  bookedBy?: string;
}


export interface SeatUpdatePayload {
  seatId: string;
  userId: string;
  action: SeatAction;
}



export interface SeatUpdateFilter {
  "seats.seat": string;
  "seats.status"?: "available" | "reserved" | "booked";
  "seats.lockedBy"?: string | null;
}

export interface SeatUpdate {
  $set: Partial<{
    "seats.$[seat].status": "available" | "reserved" | "booked";
    "seats.$[seat].lockedBy": string | null;
    "seats.$[seat].lockedUntil": Date | null;
  }>;
}

export interface SeatArrayFilter {
  "seat.seat": string;
  "seat.status"?: "available" | "reserved" | "booked";
  "seat.lockedBy"?: string | null;
}
