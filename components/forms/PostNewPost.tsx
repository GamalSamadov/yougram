"use client"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { createPost } from '@/lib/actions/post.action'
import { PostValidation } from '@/lib/validations/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface Props {
	userId: string;
}

const PostNewPost = ({ userId }: Props) => {

	const router = useRouter()
	const pathname = usePathname()

	const form = useForm({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			post: "",
			accountId: userId,

		},
	})

	const onSubmit = async (values: z.infer<typeof PostValidation>) => {
				
		await createPost({
			text: values.post,
			poster: userId,
			communityId: null,
			path: pathname,
		})

		router.push("/")
	}

  return (
	<Form {...form}>
		<form 
			onSubmit={form.handleSubmit(onSubmit)} 
			className="flex flex-col justify-start gap-10"
			>
				<FormField
				control={form.control}
				name="post"
				render={({ field }) => (
					<FormItem className='flex flex-col gap-3 w-full'>
						<FormLabel className='text-base-semibold text-gray-200'>
							Post
						</FormLabel>
						<FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
							<Textarea 
								rows={15}
								className='account-form_input' 
								{...field}
							/>
						</FormControl>
						<FormMessage />
					
					</FormItem>
				)}
			/>
			<Button type='submit' className='bg-primary-500 text-light-1'>Post</Button>
		</form>
	</Form>
  )
}

export default PostNewPost