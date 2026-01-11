import { Seat } from "./types/seat.types";
import { SeatStatus } from "./types/seat.types";


export function generateSeats(rows: number, cols: number): Seat[] {
  const seats: Seat[] = [];

  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r); // A, B, C...

    for (let c = 0; c < cols; c++) {
      const seatId = `${rowLetter}${c + 1}`; // A1, A2, B1...

      seats.push({
        seat: seatId,
        status: SeatStatus.available,
        lockedBy: undefined,
        lockedUntil: undefined,
      });
    }
  }

  return seats;
}

