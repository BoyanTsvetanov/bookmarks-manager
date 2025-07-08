import React from 'react'

const Header = () => {
  return (
    <header>
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold font-jl">Bookmarks * Manager</h1>
                <div className='flex items-baseline text-sm font-doomsday text-nowrap'>
                    <a href="/bookmarks" className="text-white mr-4">Bookmarks</a>
                    <a href="/bookmarks/new" className="text-white">Add New</a>
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Header