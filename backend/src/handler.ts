import type { Seat } from "./types/seat.types";

export function generateSeats(
  rows: number,
  cols: number
): Record<string, Seat> {
  const seats: Record<string, Seat> = {};

  for (let r = 0; r < rows; r++) {
    const rowChar = String.fromCharCode(65 + r);
    for (let c = 1; c <= cols; c++) {
      const id = `${rowChar}${c}`;

      seats[id] = {
        seat: id,
        status: "available",
      };
    }
  }

  return seats;
}
