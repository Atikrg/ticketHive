import http from "http";
import { Server } from "socket.io";
import app from "../app";
import { LayoutModel } from "../models/layout.model";
const server = http.createServer(app);
import { generateSeats } from "../handler";
import { layoutSchema } from "../schemas/seat.schema";
import { CreateOrUpdateLayoutPayload } from "../types/layout.types";
import { SeatStatus, SeatAction, SeatUpdateFilter, SeatArrayFilter, SeatUpdate } from "../types/seat.types";
import { MongoStatusFilter } from "../types/seat.types";
import { array } from "zod";

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});



io.on("connection", async (socket) => {
    try {
        let layout = await LayoutModel.findOne();

        if (layout) {
            socket.emit("LAYOUT_CREATED", JSON.stringify(layout));
        }

        socket.on("CREATE_LAYOUT", async (layout: CreateOrUpdateLayoutPayload) => {
            const { rows, cols } = layout;
            const parsed = layoutSchema.safeParse(layout);

            if (!parsed.success) {
                socket.emit("LAYOUT_CREATE_ERROR", parsed.error.issues.map(e => e.message).join(", "));
                return;
            }

            try {
                let layout = await LayoutModel.findOne();


                if (layout) {
                    const updatedSeats = generateSeats(rows, cols);

                    layout.rows = rows;
                    layout.cols = cols;
                    layout.seats = updatedSeats;
                    await layout.save();
                } else {
                    const seatsRecord = generateSeats(rows, cols);

                    layout = await LayoutModel.create({
                        rows,
                        cols,
                        seats: seatsRecord,
                    });
                }


                socket.emit("LAYOUT_CREATED", layout);
                socket.broadcast.emit("LAYOUT_CREATED", layout);
            } catch (error) {
                console.error(error);
                socket.emit("LAYOUT_CREATE_ERROR", "Failed to create or update layout");
            }
        });

        socket.on("UPDATE_USER_SEAT", async ({ seatId, userId, action }) => {

            const lockDuration = 60_000;
            const now = new Date();

            let filter;
            let arrayFilters;
            let update;

            if (action === SeatAction.RESERVE_SEAT) {
                filter = {
                    "seats.seat": seatId,
                    "seats.status": SeatStatus.available,
                    "seats.lockedBy": null
                };

                update = {
                    $set: {
                        "seats.$[seat].status": SeatStatus.reserved,
                        "seats.$[seat].lockedBy": userId,
                        "seats.$[seat].lockedUntil": new Date(now.getTime() + lockDuration),
                    }
                };

                arrayFilters = [
                    {
                        "seat.seat": seatId,
                        "seat.status": SeatStatus.available,
                        "seat.lockedBy": null
                    }
                ];
            }


            if (action === SeatAction.BOOK_SEAT) {
                filter = {
                    seats: {
                        $elemMatch: {
                            seat: seatId,
                            status: { $in: [SeatStatus.available, SeatStatus.reserved] }
                        }
                    }
                };

                update = {
                    $set: {
                        "seats.$[seat].status": SeatStatus.booked,
                        "seats.$[seat].bookedBy": userId,
                        "seats.$[seat].lockedBy": userId,
                        "seats.$[seat].lockedUntil": null
                    }
                };

                arrayFilters = [
                    {
                        "seat.seat": seatId,
                        "seat.status": { $in: [SeatStatus.available, SeatStatus.reserved] }
                    }
                ];
            }



            try {
                if (!filter || !update || !arrayFilters) {
                    socket.emit("SEAT_UPDATE_FAILED", {
                        seatId,
                        reason: "Invalid action",
                    });
                    return;
                }

                const updatedLayout = await LayoutModel.findOneAndUpdate(
                    filter,
                    update,
                    {
                        arrayFilters,
                        returnDocument: 'after',
                        new: true
                    }
                );

                if (!updatedLayout) {
                    socket.emit("SEAT_UPDATE_FAILED", {
                        seatId,
                        reason: "Seat not available or already taken",
                    });
                    return;
                }


                io.emit("SEAT_UPDATED", updatedLayout);
            } catch (err: any) {
                console.error("Seat update error:", err);
                socket.emit("SEAT_UPDATE_FAILED", {
                    seatId,
                    reason: "Something went wrong",
                });
            }
        });

        socket.on("GET_CURRENT_LAYOUT", async () => {
            const layout = await LayoutModel.findOne();
            socket.emit("CURRENT_LAYOUT", layout);
        });


    } catch (error) {
        console.error(error);
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


export default server;