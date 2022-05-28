type Comment = {
  created_at: Date
  id: !ID
  post_id: ID
  text: string
  username: string
}

type Subreddit = {
  created_at: Date
  id: !ID
  topic: string
}

type Vote = {
  created_at: Date
  id: !ID
  post_id: ID
  upvote: boolean
  username: string
}

type Post = {
  body: string
  created_at: Date
  id: !ID
  image: string
  subreddit_id: ID
  title: string
  user_email: string
  votes: Vote[]
  comments: Comment[]
  subreddit: Subreddit[]
}
