import { fetchUserPosts } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import PostCard from '../cards/PostCard'

interface Props {
	currentUserId: string;
	accountId: string;
	accountType: string;
}
const PostsTab = async ({ currentUserId, accountId, accountType}: Props) => {
	// TODO: Fetch profile posts

	let result = await fetchUserPosts(accountId)

	if (!result) redirect('/')

  return (

	<section className='mt-9 flex flex-col gap-10'>
		{result.posts.map((post: any) => (
			<PostCard 
				key={post._id}
				id={post._id}
				currentUserId={currentUserId}
				parentId={post.parentId}
				content={post.text}
				poster={
					accountType === "User"
					? { name: result.name, image: result.image, id: result.id }
					: { name: post.poster.name, image: post.poster.image, id: post.poster.id }
				} 
				community={post.community} // TODO:
				createdAt={post.createdAt}
				comments={post.children} 
			/>
		))}
	</section>
  )
}

export default PostsTab