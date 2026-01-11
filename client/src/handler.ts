import type { Seat } from "./types/seatsBooking.types";

const parseSeat = (seat?: string) => {
    if (typeof seat !== "string") return null;
    const matched = seat.match(/^([A-Z]+)(\d+)$/);
    return matched ? { row: matched[1], num: Number(matched[2]) } : null;
};


const filterReservedBookedSeats = (seats: Seat[]) => {
    return seats.filter((seat) => seat.status === "reserved" || seat.status === "booked");
};


export const isContiguousSeatSelection = (
    seats: Seat[],
    selectedSeat: Seat
): boolean => {

    const next = parseSeat(selectedSeat.seat);
    if (!next) return false;

    const selectedSeats = filterReservedBookedSeats(seats);
    if (selectedSeats.length === 0) return true;

    const parsed = selectedSeats
        .map(s => parseSeat(s.seat))
        .filter(
            (s): s is { row: string; num: number } =>
                !!s && s.row === next.row
        );


    if (parsed.length === 0) return true;

    const nums = parsed.map(s => s.num);

    const min = Math.min(...nums);
    const max = Math.max(...nums);

    const distanceFromMin = Math.abs(next.num - min);
    const distanceFromMax = Math.abs(next.num - max);

    const maxDistance = Math.min(distanceFromMin, distanceFromMax);

    return maxDistance === 1;
};
