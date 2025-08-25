"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { signOut } from '@/lib/auth-client';
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const {
    data: session,
  } = authClient.useSession();

  return (
    <div className="flex justify-between items-center px-8 h-20 bg-gray-100">
      <Link href='/' className='flex gap-5 items-center p-5 hover:bg-gray-200'>
        <div className='w-10 h-10 relative'>
          <Image src='/beaver.png' alt='beaver' fill />
        </div>
        <h1>BeaverHacks Official Judging Platform</h1>
      </Link>
      {session?.user ? (
        <Button onClick={async () => {await signOut();}}>
          Sign Out
        </Button>
      ) : (
        <>
          <Link href='/Login' className='flex items-center px-5 hover:bg-gray-200'>Login</Link>
          <Link href='/SignUp' className='flex items-center px-5 hover:bg-gray-200'>Sign Up</Link>
        </>
      )}
    </div>
  )
}
