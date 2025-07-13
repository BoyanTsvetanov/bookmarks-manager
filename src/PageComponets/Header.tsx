import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header>
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white sm:text-2xl text-xl font-bold font-jl">Bookmarks * Manager</Link>
                <div className='flex items-baseline sm:text-sm text-xs font-doomsday text-nowrap'>
                  <SignedOut>
                    <div className='flex items-center gap-4 text-white font-doomsday'>
                      <SignInButton/>
                      <SignUpButton /> 
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className='flex items-center gap-4 text-white font-doomsday'>
                      <Link href="/bookmarks" className="text-white mr-4">Bookmarks</Link>
                      <Link href="/bookmarks/new" className="text-white">Add New</Link>
                      <UserButton showName appearance={{
                        elements: {
                          userButtonOuterIdentifier: {
                            color: 'white',
                          }
                        }
                      }}/>
                    </div>
                  </SignedIn>
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Header