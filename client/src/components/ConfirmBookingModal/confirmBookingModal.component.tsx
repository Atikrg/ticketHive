import { useUserStore } from "../../store/userStore.store";
import type { ConfirmBookingModalProps } from "./confirmBookingModal.typs";

function ConfirmBookingModal({
    cancelBooking,
    confirmBooking,
    confirmHold,
}: ConfirmBookingModalProps) {
    const { selectedSeat } = useUserStore();

    if (!selectedSeat) return null; // hide modal if no seat is selected

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Confirm Booking/Holding Seat</h2>
                <p className="mb-6">
                    <strong>{selectedSeat}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                        onClick={cancelBooking}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        onClick={confirmBooking}
                    >
                        Book
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                        onClick={confirmHold}
                    >
                        Hold
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmBookingModal;
