import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { auth } from '@/app/auth';
import { SignOutBtn } from './OauthButton';

export default async function Navbar() {
  const session = await auth();
  const user: User = session?.user;

  return (
    <nav className="bg-gray-900 p-4 text-white shadow-md md:p-6">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <Link href="/" className="mb-4 text-xl font-bold md:mb-0">
          True Feedback
        </Link>
        {session ? (
          <div className="flex flex-row items-center gap-4">
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-black md:w-auto">
                Dashboard
              </Button>
            </Link>
            <SignOutBtn className="w-full text-black md:w-auto" />
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full bg-slate-100 text-black md:w-auto" variant={'outline'}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
