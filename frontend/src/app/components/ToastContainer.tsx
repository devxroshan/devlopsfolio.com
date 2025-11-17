'use client';
import React from 'react'

// Components
import Toast from './Toast';

// Stores
import { useAppStore } from '../store/AppStore';

const ToastContainer = () => {
  const appStore = useAppStore()
  
  
  return (
    <section className='fixed z-50 pl-3 flex flex-col gap-2 h-fit w-fit -mt-[18vh] overflow-x-hidden overflow-y-auto max-h-[98vh]'>
      {appStore.toasts.map(toast => (
        <Toast key={toast.id} title={toast.title} msg={toast.msg} icon={toast.icon} id={toast.id}/>
      ))}
    </section>
  )
}

export default ToastContainer