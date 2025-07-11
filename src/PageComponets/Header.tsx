import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header>
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white sm:text-2xl text-xl font-bold font-jl">Bookmarks * Manager</Link>
                <div className='flex items-baseline sm:text-sm text-xs font-doomsday text-nowrap'>
                    <Link href="/bookmarks" className="text-white mr-4">Bookmarks</Link>
                    <Link href="/bookmarks/new" className="text-white">Add New</Link>
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Header