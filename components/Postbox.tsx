import { PhotographIcon } from '@heroicons/react/outline'
import { LinkIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import React from 'react'
import Avatar from './Avatar'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_POST_LIST, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type PostFormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}

function Postbox({ subreddit }: Props) {
  const { data: session } = useSession()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormData>()
  const [imageBoxOpen, setImageBoxOpen] = React.useState(false)
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_POST_LIST, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('Creating New Post...')

    try {
      // Query for subreddit
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      })

      const subRedditExist = getSubredditListByTopic.length > 0
      if (!subRedditExist) {
        // Create Subreddit
        toast.loading('Creating new Subreddit as it is new...', {id: notification})
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })

        toast.loading('Subreddit created, Now posting...', {id: notification})
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            subreddit_id: newSubreddit.id,
            image: image,
            title: formData.postTitle,
            user_email: session?.user?.name,
          },
        })
      } else {
        // use Existing subreddit
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            subreddit_id: getSubredditListByTopic[0].id,
            image: image,
            title: formData.postTitle,
            user_email: session?.user?.name,
          },
        })
      }

      // After Post added clear form values
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
      toast.success('Posted Successfully', {
        id: notification,
      })
    } catch (err) {
      toast.error('Whoops!! Error occurred', {
        id: notification,
      })
      console.error(err)
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-40 rounded-md border border-gray-300 bg-white p-2 mx-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar />

        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title'
              : 'Sign in to create post'
          }
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer ${
            imageBoxOpen ? 'text-blue-300' : 'text-gray-300 '
          }`}
        />
        <LinkIcon className={`h-6 text-gray-300`} />
      </div>

      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          {/* Post Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <textarea
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              placeholder="Text (optional)"
            ></textarea>
          </div>
          {/* Subreddit */}
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                type="text"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('subreddit', { required: true })}
                placeholder="i.e. nextjs, reactjs,..."
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                type="url"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                placeholder="URL (optional)"
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>- A Post title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>- A Subreddit is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button
              className="w-full rounded-full bg-blue-400 p-2 text-white"
              type="submit"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default Postbox
