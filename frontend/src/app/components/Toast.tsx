'use client';
import React from 'react'
import Image from 'next/image'

// Stores
import { useAppStore, IToast } from '../store/AppStore';

const Toast = (toast:IToast) => {
  const appStore = useAppStore()


  return (
    <div className='w-[30vw] bg-white border border-primary-border shadow-lg rounded-2xl h-fit flex gap-3 px-3 py-2 items-center justify-between select-none'>
      <Image
      src={toast.icon}
      alt='Error Icon'
      width={45}
      height={45}
      />

      <div className='flex flex-col gap-1 items-start justify-center w-full'>
        <span className='font-bold text-lg text-black'>{toast.title}</span>
        <span className='font-medium text-black text-sm'>{toast.msg}</span>
      </div>

      <button className='bg-black hover:bg-gray-900 transition-all duration-500 text-white outline-none shadow-lg rounded-lg px-4 py-1 cursor-pointer' onClick={() => {
        appStore.removeToast(toast.id)
      }}>
        Dismiss
      </button>
    </div>
  )
}

export default Toast