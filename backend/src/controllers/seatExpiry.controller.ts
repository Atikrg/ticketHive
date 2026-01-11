import { LayoutModel } from "../models/layout.model";
import { SeatStatus } from "../types/seat.types";

export const startSeatExpiryWorker = async () => {
    setInterval(async () => {
        const now = new Date();

        await LayoutModel.updateMany(
            {
                "seats.status": SeatStatus.reserved,
                "seats.lockedUntil": { $lte: now },
            },
            {
                $set: {
                    "seats.$[seat].status": SeatStatus.available,
                    "seats.$[seat].lockedBy": null,
                    "seats.$[seat].lockedUntil": null,
                },
            },
            {
                arrayFilters: [
                    {
                        "seat.status": SeatStatus.reserved,
                        "seat.lockedUntil": { $lte: now },
                    },
                ],
            }
        );
    }, 5_000);
};
