import { LayoutModel } from "../models/layout.model";

export const createIndexes = async () => {
    await LayoutModel.collection.createIndex({
        "seats.seat": 1,
        "seats.status": 1,
        "seats.lockedUntil": 1

    });

    console.log("Mongo indexes ready");
};
