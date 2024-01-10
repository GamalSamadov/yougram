"use server"

import { revalidatePath } from 'next/cache'
import Post from '../models/post.model'
import User from '../models/user.model'
import { connectToDB } from '../mongoose'

interface Params {
	userId: string,
	username: string,
	name: string,
	bio: string,
	image: string,
	path: string,
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path,
}: Params): Promise<void> {
	connectToDB()

	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{ 
				username: username.toLowerCase(),
				name,
				bio, 
				image,
				onboarded: true,
			},
			{ upsert: true },
		
		)
	
		if (path === "/profile/edit") {
			revalidatePath(path)
		}
	} catch (err: any) {
		throw new Error(`Failed to create/update user: ${err.message}`)
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB()

		return await User
			.findOne({ id: userId })
			// .populate({
			// 	path: "communities",
			// 	model: Community,
			// })
	} catch (err: any) {
		throw new Error(`Failed to fetch user: ${err.message}`)
	}
}

export async function fetchUserPosts(userId: string) {
	try {
		connectToDB()

		// find all posts posted by user with given id

		// TODO: populate community

		 const posts = await User.findOne({ id: userId })
		 	.populate({
				path: "posts",
				model: Post,
				populate: {
					path: "children",
					model: Post,
					populate: {
						path: "poster",
						model: User,
						select: "name image id"
					}
				}
			})

			return posts
			
	} catch (err: any) {
		throw new Error(`Failed to fetch user posts: ${err.message}`)
	}

}