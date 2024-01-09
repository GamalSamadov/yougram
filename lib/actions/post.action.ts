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
	try {
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
	} catch (err: any) {
		console.log(`Error creating post: ${err.message}`)
	}
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
	connectToDB();
  
	// Calculate the number of posts to skip based on the page number and page size.
	const skipAmount = (pageNumber - 1) * pageSize;
  
	// Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
	const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
	  .sort({ createdAt: "desc" })
	  .skip(skipAmount)
	  .limit(pageSize)
	  .populate({
		path: "poster",
		model: User,
	  })
	  .populate({
		path: "children", // Populate the children field
		populate: {
		  path: "poster", // Populate the author field within children
		  model: User,
		  select: "_id name parentId image", // Select only _id and username fields of the author
		},
	  });
  
	// Count the total number of top-level posts (threads) i.e., threads that are not comments.
	const totalPostsCount = await Post.countDocuments({
	  parentId: { $in: [null, undefined] },
	}); // Get the total count of posts
  
	const posts = await postsQuery.exec();
  
	const isNext = totalPostsCount > skipAmount + posts.length;
  
	return { posts, isNext };
  }

export async function fetchPostById(id: string) {
	connectToDB()
	try {

		// TODO: Populate community 


		const post = await Post.findById(id)
			.populate({
				path: "poster", 
				model: User,
				select: "_id id name image"
			})
			.populate({
				path: "children",
				populate: [
					{
						path: "poster",
						model: User,
						select: "_id id name parentId image",
					},
					{
						path: "children",
						model: Post,
						populate: {
							path: "poster",
							model: User,
							select: "_id id name parentId image",
						}
						
					},
				]
			}).exec()

			return post
	} catch (err: any) {
		throw new Error(`Error: ${err.message}`)
	}	
}