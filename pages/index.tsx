import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Postbox from '../components/Postbox'
import SubredditData from '../components/SubredditData'
import { GET_SUBREDDIT_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const {data} = useQuery(GET_SUBREDDIT_LIMIT, {
    variables: {limit: 10}
  })

  const subreddits: Subreddit[] = data?.getSubredditListLimit
  return (
    <div className='max-w-5xl my-7 mx-auto'>
      <Head>
        <title>Reddit Clone</title>
      </Head>
      <Postbox />
      <div className='flex'>
        {/* Feed */}
        <Feed />

        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline'>
          <p className='text-md mb-1 p-4 pb-3 font-bold'>Top Communities</p>
          <div>
            {/* Get top subreddits */}
            {subreddits?.map((subreddit, i) => (
              <SubredditData sub={subreddit} key={subreddit?.id} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
