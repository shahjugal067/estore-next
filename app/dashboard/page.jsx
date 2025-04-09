'use client'
import React from 'react'
import { signOut,useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button';

const page = () => {
    const {data: session } = useSession();

  return (
    <div className='min-h-screen py-20'>
        <div className='w-full max-w-2xl grid place-items-center mx-auto py-40 bg-scale-50 '>
            <span className='text-4xl tracking-wide capitalize text-slate-800'>
                Welcome to the dashboard
            </span>
            {session && (
                <span className='text-2xl tracking-normal py-10'>{session.user.name}</span>
            )}
            <Button onClick={()=> signOut()}
             variant='destructive' className='rounded-lg px-3 py-2'>
                LogOut
            </Button>
        </div>
    </div>
  )
}

export default page