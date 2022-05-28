import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import moment from 'moment'
import {
  ChatIcon,
  GiftIcon,
  SaveIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'
import { GET_VOTES_BY_POST_ID } from '../graphql/queries'

type Props = {
  post: Post
}

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>()
  const { data: session } = useSession()

  const { data, loading } = useQuery(GET_VOTES_BY_POST_ID, {
    variables: { post_id: post?.id },
  })
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTES_BY_POST_ID, 'getVotesByPostId'],
  })

  const upVote = async (isUpvote: boolean) => {
    const notification = toast.loading('Your vote is being recorded...')
    try {
      if (!session) {
        toast.error('Please Sign in to vote', { id: notification })
        return
      }

      if (vote && isUpvote) return
      if (vote === false && !isUpvote) return

      const {
        data: { insertVote: newVote },
      } = await addVote({
        variables: {
          post_id: post?.id,
          username: session?.user?.name,
          upvote: isUpvote,
        },
      })
      toast.success('Vote Recorded Successfully', { id: notification })
    } catch (err) {
      toast.error('Error Occured!!', { id: notification })
      console.error(err)
    }
  }

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId
    if (votes?.length === 0) return 0
    const nVotes = votes?.reduce(
      (total, vote) => (vote?.upvote ? (total += 1) : (total -= 1)),
      0
    )
    if (nVotes === 0) {
      return votes[0]?.upvote ? 1 : -1
    }
    return nVotes
  }

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId
    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote

    setVote(vote)
  }, [data])

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )
  return (
    <Link href={`/post/${post?.id}`}>
      <div className="group flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600">
        {/* Votes */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButton hover:text-blue-500 ${
              vote && 'text-blue-500'
            }`}
          />
          <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButton hover:text-red-500 ${
              vote === false && 'text-red-500'
            }`}
          />
        </div>

        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post?.subreddit[0]?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post?.subreddit[0]?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post?.subreddit[0]?.topic}
                </span>
              </Link>{' '}
              · Posted by u/{post?.user_email}{' '}
              {moment(post?.created_at).fromNow()}
            </p>
          </div>

          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post?.title}</h2>
            <p className="mt-2 text-sm font-light">{post?.body}</p>
          </div>
          {/* Image */}
          <img src={post?.image} alt="" className="w-full" />
          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButton">
              <ChatIcon className="h-6 w-6" />
              <p className="hidden sm:inline">
                {post?.comments?.length} Comments
              </p>
            </div>
            <div className="postButton">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <SaveIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Post
