import { useSession } from 'next-auth/react'
import React from 'react'
import Image from 'next/image';

type AvatarProps = {
    seed?: string,
    large?: boolean
}

function Avatar({seed, large}: AvatarProps) {
    const {data: session} = useSession();

  return (
    <div className={`relative overflow-hidden rounded-full border-gray-300 border bg-white ${large ? "h-20 w-20" : "h-10 w-10"}`}>
        <Image layout='fill'  src={`https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`} />
    </div>
  )
}

export default Avatar