import http from "http";
import { Server } from "socket.io";
import app from "../app";
import { LayoutModel } from "../models/layout.model";
const server = http.createServer(app);
import { generateSeats } from "../handler";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


const layoutId = "101";

io.on("connection", async (socket) => {
    try {
        let layout = await LayoutModel.findById(layoutId);
        if (layout) {
            socket.emit("LAYOUT_CREATED", layout);
        }

        socket.on("CREATE_LAYOUT", async (layout) => {
            const { rows, cols } = layout;
            try {
                let layout = await LayoutModel.findById(layoutId);
                if (layout) {

                    const updatedSeats = generateSeats(rows, cols);
                    const seatsMap = new Map(Object.entries(updatedSeats));
                    layout.rows = rows;
                    layout.cols = cols;
                    layout.seats = seatsMap;
                    await layout.save();
                } else {
                    const seatsRecord = generateSeats(rows, cols);
                    layout = await LayoutModel.create({
                        _id: layoutId,
                        rows,
                        cols,
                        seats: seatsRecord,
                        createdAt: new Date(),
                    });
                }

                socket.emit("LAYOUT_CREATED", layout);
                socket.broadcast.emit("LAYOUT_CREATED", layout);
            } catch (error) {
                console.error(error);
                socket.emit("BUS_CREATE_ERROR", "Failed to create or update layout");
            }
        });


        socket.on("UPDATE_USER_SEAT", async ({ seatId, userId, action }) => {

            console.table({
                seatId,
                userId,
                action
            })

            const layout = await LayoutModel.findById(layoutId);
            if (!layout) return;

            const seat = layout.seats.get(seatId);
            if (!seat) return;


            if (action === "RESERVE_SEAT") {

                if (seat.status !== "available") return;

                seat.status = "reserved";
                seat.lockedBy = userId;
                seat.lockedUntil = new Date(Date.now() + 60000);
            }


            if (action === "UNSELECT_SEAT") {
                if (seat.lockedBy !== userId) return;

                seat.status = "available";
                seat.lockedBy = undefined;
                seat.lockedUntil = undefined;
            }


            if (action === "BOOK_SEAT") {
                seat.status = "booked";
                seat.bookedBy = userId;
                seat.lockedBy = undefined;
                seat.lockedUntil = undefined;
            }

            await layout.save();
            io.emit("SEAT_UPDATED", layout);
        });


        socket.on("GET_CURRENT_BUS", async () => {
            const layout = await LayoutModel.findById(layoutId);
            socket.emit("CURRENT_BUS", layout);
        });


    } catch (error) {
        console.error(error);
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const checkExpiredLocks = async () => {
    const layout = await LayoutModel.findById(layoutId);
    if (!layout) return;
    let changed = false;
    const seats = layout.seats instanceof Map ? Object.fromEntries(layout.seats) : layout.seats;
    Object.entries(seats).forEach(([seatId, seat]: any) => {
        if (seat.status === "reserved" && seat.lockedUntil && new Date(seat.lockedUntil) <= new Date()) {
            seat.status = "available";
            seat.lockedBy = undefined;
            seat.lockedUntil = undefined;
            changed = true;
        }
    });

    if (changed) {
        // If you use Map in Mongo, convert back
        layout.seats = new Map(Object.entries(seats));
        await layout.save();
        io.emit("SEAT_UPDATED", layout);
    }
};
setInterval(checkExpiredLocks, 1000);

export default server;
