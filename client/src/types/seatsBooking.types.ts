export type SeatStatus = 'available' | 'locked' | 'booked' | 'reserved';
import type { LayoutState } from "./layout.types";
export interface Seat {
    seat: string;
    status: SeatStatus;
    lockedBy?: string;
}

export interface SeatStoreState {
    seats: Seat[];
    error: string;
    layout: LayoutState | null;

    setLayout: (
        layout:
            | LayoutState
            | null
            | ((prev: LayoutState | null) => LayoutState | null)
    ) => void;

    setError: (error: string) => void;
    setSeats: (seats: Seat[]) => void;
    updateSeat: (seatId: string, status: SeatStatus) => void;
}






