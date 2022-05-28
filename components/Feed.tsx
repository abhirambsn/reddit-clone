import { useQuery } from '@apollo/client'
import { Jelly } from '@uiball/loaders'
import React from 'react'
import { GET_ALL_POST_BY_TOPIC, GET_POST_LIST } from '../graphql/queries'
import Post from './Post'

type Props = {
  topic?: string
}

function Feed({ topic }: Props) {
  const { data, error } = !topic
    ? useQuery(GET_POST_LIST)
    : useQuery(GET_ALL_POST_BY_TOPIC, {
        variables: { topic },
      })
  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic
  if (!posts) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )
  }

  return (
    <div className="mt-5 space-y-4 w-full mx-2">
      {posts?.map((post) => (
        <Post post={post} key={post?.id} />
      ))}
    </div>
  )
}

export default Feed
