import {create} from "zustand";

interface IUserStore {
    name: string;
    email: string;
    username: string;
    profile_pic: string;
    setUser: (user: Partial<IUserStore>) => void;
}

const defaultUser: Omit<IUserStore, "setUser"> = {
    name: "",
    email: "",
    username: "",
    profile_pic: "",
}

export const useUserStore = create<IUserStore>((set) => ({
    ...defaultUser,
    setUser: (user: Partial<IUserStore>) => set((state) => ({...state, ...user})),
}))