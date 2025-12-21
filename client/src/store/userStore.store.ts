import { create } from "zustand";
import { persist } from "zustand/middleware";


interface UserStore {
    userUniqueId: string;
    setUserUniqueId: (value: string) => void;
    clearUserUniqueId: () => void;

    selectedSeat: string | null;
    setSelectedSeat: (seat: string | null) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            userUniqueId: "",
            setUserUniqueId: (value) => set({ userUniqueId: value }),
            clearUserUniqueId: () => set({ userUniqueId: "" }),

            selectedSeat: null,
            setSelectedSeat: (seat) => set({ selectedSeat: seat }),
        }),
        {
            name: "user-store",
            partialize: (state) => ({ userUniqueId: state.userUniqueId }),
        }
    )
);
