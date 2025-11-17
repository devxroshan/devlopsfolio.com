'use client';
import { useAppStore, IToast } from "../store/AppStore";


export const useToast = () => {
    const appStore = useAppStore()

    const addToast = (toast: Omit<IToast, "id">) => {
        const toastId = crypto.randomUUID()
        appStore.addToast({
            ...toast,
            id: toastId
        })
    }

    const removeToast = (toastId:string) => {
        appStore.removeToast(toastId)
    }

    const clearToasts = () => {
        appStore.clearToasts();
    }

    return{
        toasts: appStore.toasts,
        addToast,
        removeToast,
        clearToasts
    }
}