"use server"

import { revalidatePath } from 'next/cache'
import Post from '../models/post.model'
import User from '../models/user.model'
import { connectToDB } from '../mongoose'

interface Params {
	text: string;
	poster: string;
	communityId: string | null;
	path: string;
}

export async function createPost({ text, poster, communityId, path }: Params) {
	connectToDB()

	const createdPost = await Post.create({
		text,
		poster,
		community: null,
	})

	console.log("Created post......")

	// Update user model
	await User.findByIdAndUpdate(poster, {
		$push: { posts: createdPost._id }
	})

	revalidatePath(path)
}

