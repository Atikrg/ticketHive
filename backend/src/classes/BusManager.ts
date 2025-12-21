import { Layout, SeatStatus } from "./Bus";

export class BusManager {
    private layout?: Layout;

    public static BUS_ROOM = "MAIN_BUS";

    constructor(layout?: Layout) {
        this.layout = layout;
    }

    addBus(layout: Layout) {
        this.layout = layout;
    }

    getBus(): Layout | undefined {
        return this.layout;
    }



    removeBus() {
        this.layout = undefined;
    }



    getMainBus() {
        return BusManager.BUS_ROOM;
    }

    sendMessage(socket: any, event: string, payload: any, room?: string) {
        if (room) socket.to(room).emit(event, payload);
        else socket.emit(event, payload);
    }
}
