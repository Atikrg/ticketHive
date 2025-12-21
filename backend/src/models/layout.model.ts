import mongoose, { Schema, Document } from "mongoose";

/* ---------- Types ---------- */
export type SeatStatus = "available" | "locked" | "booked" | "selected" | "reserved";

export interface Seat {
    seat: string;
    status: SeatStatus;
    lockedBy?: string;
    lockedUntil?: Date;
    bookedBy?: string;
}

export interface LayoutDoc extends Document<string> {  // <--- string _id
    rows: number;
    cols: number;
    seats: Map<string, Seat>;
    createdAt: Date;
}


const SeatSchema = new Schema<Seat>(
    {
        seat: { type: String, required: true },
        status: { type: String, enum: ["available", "locked", "booked", "selected", "reserved"], required: true },
        lockedBy: { type: String },
        lockedUntil: { type: Date },
        bookedBy: { type: String },
    },
    { _id: false }
);


const layoutSchema = new Schema<LayoutDoc>({
    _id: { type: String, required: true }, // <--- Use _id, not layoutId
    rows: { type: Number, required: true, min: 3, max: 20 },
    cols: { type: Number, required: true, min: 3, max: 20 },
    seats: { type: Map, of: SeatSchema, required: true },
    createdAt: { type: Date, default: Date.now },
});


export const LayoutModel = mongoose.model<LayoutDoc>("Bus", layoutSchema);
