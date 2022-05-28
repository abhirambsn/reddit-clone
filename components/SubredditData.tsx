import { ChevronUpIcon } from '@heroicons/react/solid'
import React from 'react'
import Avatar from './Avatar'
import Link from 'next/link'

type Props = {
    sub: Subreddit
    index: number
}

export default function SubredditData({sub, index}: Props) {
  return (
    <div className='flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b'>
        <p>{index+1}</p>
        <ChevronUpIcon className='h-4 w-4 flex-shrink-0 text-green-400' />
        <Avatar seed={`/subreddit/${sub?.topic}`} />
        <p className='flex-1 truncate'>r/{sub?.topic}</p>
        <Link href={`/subreddit/${sub?.topic}`}>
            <div className='cursor-pointer rounded-full bg-blue-500 px-3 text-white'>View</div>
        </Link>
    </div>
  )
}
