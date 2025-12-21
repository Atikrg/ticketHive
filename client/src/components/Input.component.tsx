import { useCallback, useEffect, useState } from "react";
import { useLayoutStore } from "../store/useLayout.store";
import { v4 as uuidv4 } from "uuid";
import socket from "../utils/socket";

import type { Seat } from "../types/seatsBooking.types";
import type { LayoutState } from "../types/layout.types";

const InputComponent = () => {
    const { setLayout } = useLayoutStore();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        socket.emit("GET_CURRENT_BUS");

        socket.on("CURRENT_BUS", (layout: LayoutState) => {
            setLayout(layout);
        });

        return () => {
            socket.off("CURRENT_BUS");
        };
    }, [setLayout]);


    // Generate seats
    const generateSeats = useCallback((rows: number, cols: number): Seat[] => {
        const seats: Seat[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                seats.push({
                    seat: `${String.fromCharCode(65 + row)}${col + 1}`,
                    status: "available",
                });
            }
        }
        return seats;
    }, []);

    // Submit handler
    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const rowsNumber = Number(formData.get("rows"));
            const colsNumber = Number(formData.get("cols"));

            if (!rowsNumber || !colsNumber || rowsNumber < 3 || rowsNumber > 20 || colsNumber < 3 || colsNumber > 20) {
                setError("Rows and columns must be between 3 and 20");
                return;
            }

            const seats = generateSeats(rowsNumber, colsNumber);
            const newBusId = uuidv4();

            const seatsRecord: Record<string, Seat> = seats.reduce((acc, seat) => {
                acc[seat.seat] = seat;
                return acc;
            }, {} as Record<string, Seat>);

            const newBusData: LayoutState = {
                id: newBusId,
                rows: rowsNumber,
                cols: colsNumber,
                seats: seatsRecord,
            };

            setLayout(newBusData);
            setError("");

            // Emit the CREATE_LAYOUT event directly on submit
            socket.emit("CREATE_LAYOUT", newBusData);
        },
        [generateSeats, setLayout]
    );

    useEffect(() => {
        socket.on("LAYOUT_CREATED", (layout: LayoutState) => {
            setLayout(layout);
        });

        socket.on("BUS_CREATE_ERROR", (msg: string) => {
            setError(msg);
        });

        return () => {
            socket.off("LAYOUT_CREATED");
            socket.off("BUS_CREATE_ERROR");
        };
    }, [setLayout]);



    return (
        <form onSubmit={handleSubmit} className="grid gap-2 mt-4 ml-4">
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="number"
                name="rows"
                placeholder="Rows"
                className="border p-2 w-64 cursor-pointer"
            />
            <input
                type="number"
                name="cols"
                placeholder="Cols"
                className="border p-2 w-64 cursor-pointer"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded w-64 cursor-pointer">
                Generate Seats
            </button>
        </form>
    );
};

export default InputComponent;
