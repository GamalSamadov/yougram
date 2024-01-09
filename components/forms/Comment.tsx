"use client"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/ui/form"
import { addCommentToPost } from '@/lib/actions/post.action'
import { CommentValidation } from '@/lib/validations/post'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'


interface Props {
	postId: string;
	currentUserImage: string;
	currentUserId: string;
}

const Comment = ({ postId, currentUserImage, currentUserId }: Props) => {

	const pathname = usePathname()

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			post: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
				
		await addCommentToPost(
			postId,
			values.post,
			JSON.parse(currentUserId),
			pathname
		  );

		form.reset()
	}

	return (
		<Form {...form}>
			<form 
				onSubmit={form.handleSubmit(onSubmit)} 
				className="comment-form"
				>
					<FormField
					control={form.control}
					name="post"
					render={({ field }) => (
						<FormItem className='flex items-center gap-3 w-full'>
							<FormLabel>
								<Image 
									src={currentUserImage}
									alt="Profile photo"
									width={48}
									height={48}
									className='rounded-full object-cover'
								/>
							</FormLabel>
							<FormControl className='border-none bg-transparent'>
								<Input 
									type="text"
									placeholder='Comment...'
									className='no-focus text-light-1 outline-none' 
									{...field}
								/>
							</FormControl>						
						</FormItem>
					)}
				/>
				<Button type='submit' className='comment-form_btn'>Reply</Button>
			</form>
		</Form>
	)
}

export default Comment