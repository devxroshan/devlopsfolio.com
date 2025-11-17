import { create } from "zustand";

export interface IToast {
  title: string;
  msg: string;
  icon: string;
  id: string;
}

interface IAppStoreActions {
  addToast: (toast: IToast) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;
}

interface IAppStore extends IAppStoreActions {
  toasts: IToast[];
  isToast: boolean;
}

export const useAppStore = create<IAppStore>((set) => ({
  toasts: [],
  isToast: false,
  addToast: (toast: IToast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
      isToast: true,
    })),
  removeToast: (toastId: string) =>
    set((state) => {
      const newToasts = state.toasts.filter((toast) => toast.id !== toastId);
      return {
        toasts: newToasts,
        isToast: newToasts.length > 0,
      };
    }),
  clearToasts: () => set(() => ({ toasts: [], isToast: false })),
}));
