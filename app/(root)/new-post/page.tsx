import PostNewPost from '@/components/forms/PostNewPost'
import { fetchUser } from '@/lib/actions/user.action'
import { currentUser } from "@clerk/nextjs"
import { redirect } from 'next/navigation'

const page = async () => {

	const user = await currentUser()

	if (!user) return null

	const userInfo = await fetchUser(user.id)

	if (!userInfo?.onboarded) return redirect("/onboarding")

  return (
	<>
		<h1 className='head-text'>New post</h1>

		<PostNewPost userId={userInfo._id}/>
	</>
  )
}

export default page