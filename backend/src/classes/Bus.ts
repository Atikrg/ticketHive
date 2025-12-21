export type SeatStatus = "available" | "locked" | "booked";

export interface Seat {
  seat: string;
  status: SeatStatus;
}

export class Layout {
  public id: string;
  public rows: number;
  public cols: number;
  public seats: Seat[];

  constructor(
    id: string,
    rows: number,
    cols: number,
    seats: Seat[]
  ) {
    this.id = id;
    this.rows = rows;
    this.cols = cols;
    this.seats = seats;
  }


  

}
