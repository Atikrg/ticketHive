import mongoose, { Schema, Document } from "mongoose";
import { SeatStatus, Seat } from "../types/seat.types";

export interface LayoutDoc {
  rows: number;
  cols: number;
  seats: Seat[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LayoutDocument extends LayoutDoc, Document { }

const SeatSchema = new Schema<Seat>({
  seat: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(SeatStatus),
    default: SeatStatus.available,
  },
  lockedBy: { type: String, default: null },
  lockedUntil: { type: Date, default: null },
  bookedBy: { type: String, default: null },
});

const LayoutSchema = new Schema<LayoutDocument>(
  {
    rows: { type: Number, required: true, min: 3, max: 20 },
    cols: { type: Number, required: true, min: 3, max: 20 },
    seats: { type: [SeatSchema], required: true },
  },
  { timestamps: true }
);

export const LayoutModel = mongoose.model<LayoutDocument>(
  "Layout",
  LayoutSchema
);
