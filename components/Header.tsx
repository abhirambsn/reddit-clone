import Image from 'next/image'
import React, { useState } from 'react'
import {
  BeakerIcon,
  ChevronDownIcon,
  FireIcon,
  HomeIcon,
  SearchIcon,
} from '@heroicons/react/solid'
import {
  ArrowCircleUpIcon,
  BellIcon,
  ChartBarIcon,
  LogoutIcon,
  ChatIcon,
  MenuIcon,
  PlusIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import { slide as Menu } from 'react-burger-menu'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    toast.error('Burger menu is under development')
    setIsMenuOpen(false);
  }
  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer items-center">
        <Link href="/" passHref>
          <Image
            objectFit="contain"
            layout="fill"
            src="https://res.cloudinary.com/dm0muijpa/image/upload/v1653554563/reddit-clone/reddit-logo_abvgvk.png"
          />
        </Link>
      </div>

      <div className="mx-7 flex items-center rounded-lg hover:cursor-pointer hover:border hover:border-gray-300 xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="ml-2 hidden flex-1 md:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      {/* Search Box */}
      <form className="ml-7 flex flex-1 items-center space-x-3 rounded-sm border border-gray-200 bg-gray-100">
        <SearchIcon className="ml-2 h-6 w-6 text-gray-400" />
        <input
          type="search"
          className="flex-1 bg-transparent outline-none"
          name="text"
          id="search"
          placeholder="Search Reddit"
        />
        <button hidden type="submit" />
      </form>

      {/* Right Row */}

      <div className="mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex">
        <ArrowCircleUpIcon className="icon" />
        <ChartBarIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon onClick={handleMenuOpen} className="icon" />
        
        {/* TODO: Implement Burger Menu */}
      </div>

      {/* Auth Area */}
      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className="relative h-6 w-6 flex-shrink-0">
            <Image
              objectFit="contain"
              src={
                session?.user?.image ||
                'https://res.cloudinary.com/dm0muijpa/image/upload/v1653560431/reddit-clone/reddit-logo-17_qsa4as.png'
              }
              layout="fill"
              alt="logo"
            />
          </div>

          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <div className="flex items-center space-x-1">
              <FireIcon className="h-3 w-3 text-red-600" />
              <p className="text-gray-400">1 Karma</p>
            </div>
          </div>

          <LogoutIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={() => signIn('github')}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className="relative h-6 w-6 flex-shrink-0">
            <Image
              objectFit="contain"
              src="https://res.cloudinary.com/dm0muijpa/image/upload/v1653560431/reddit-clone/reddit-logo-17_qsa4as.png"
              layout="fill"
              alt="logo"
            />
          </div>

          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  )
}

export default Header
