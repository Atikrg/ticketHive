import { useCallback, useEffect, useState } from "react";
import { useLayoutStore } from "../store/useLayout.store";
import socket from "../utils/socket";
import type { LayoutState } from "../types/layout.types";

const InputComponent = () => {
    const { layout, setLayout } = useLayoutStore();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        socket.emit("GET_CURRENT_LAYOUT");

        socket.on("CURRENT_LAYOUT", (layout: LayoutState) => {
            setLayout(layout);
        });

        return () => {
            socket.off("CURRENT_LAYOUT");
        };
    }, []);


    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();


            const formData = new FormData(e.currentTarget);
            const rowsNumber = Number(formData.get("rows"));
            const colsNumber = Number(formData.get("cols"));


            socket.emit("CREATE_LAYOUT", { rows: rowsNumber, cols: colsNumber });

            socket.once("LAYOUT_CREATED", (layout: LayoutState) => {
                setLayout(layout);
                setError("");
            });

            socket.once("LAYOUT_CREATE_ERROR", (msg) => {
                setError(msg);
            });
        },
        [setLayout, setError]
    );


    useEffect(() => {
        socket.on("LAYOUT_CREATED", (layout: LayoutState) => {
            setLayout(layout);
        });

        socket.on("LAYOUT_CREATE_ERROR", (msg: string) => {
            setError(msg);
        });

        return () => {
            socket.off("LAYOUT_CREATED");
            socket.off("LAYOUT_CREATE_ERROR");
        };
    }, [setLayout]);

    return (
        <>

            <form onSubmit={handleSubmit} className="grid gap-2 mt-4 ml-4">
                <input
                    type="number"
                    name="rows"
                    min={3}
                    max={20}
                    placeholder="Rows"
                    className="border p-2 w-64 cursor-pointer"
                />
                <input
                    type="number"
                    name="cols"
                    min={3}
                    max={20}
                    placeholder="Cols"
                    className="border p-2 w-64 cursor-pointer"
                />
                <div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded w-64 cursor-pointer">
                    Generate Seats
                </button>
            </form>


        </>
    );
};

export default InputComponent;
