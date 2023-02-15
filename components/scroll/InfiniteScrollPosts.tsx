/* eslint-disable @next/next/no-img-element */
import { Entity } from "megalodon";
import Link from "next/link";
import Status from "components/posts/Status";
import { withEmojis } from "utils/functions";
import { useState } from "react";

export default function InfiniteScrollPosts({ posts, loadNewPosts }: {
	posts: Entity.Status[];
	loadNewPosts(): void
}) {
	return (
		<div
			className="flex overflow-y-auto flex-col gap-y-5 px-6 py-4 md:mt-10"
			onScroll={e => {
				if (e.currentTarget) {
					// Check if scrolled to bottom
					const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

					if (scrollTop + clientHeight >= scrollHeight) {
						// Load more notifications
						loadNewPosts();
					}
				}
			}}>
			{posts.map(post => (
				<Post key={post.id} post={post} />
			))}
		</div>
	);
}

export const Post = ({ post, highlight = false }: { post: Entity.Status; highlight?: boolean }) => {
	return (
		<div className={`flex flex-col gap-y-2 ${highlight && "bg-gray-400"}`}>
			{post.reblog && (
				<Link
					href={`/users/@${post.account.id}`}
					className="flex overflow-hidden flex-row gap-x-2 items-center max-w-full italic text-gray-500 overflow-ellipsis hover:underline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-4 h-4 text-blue-500 hover:animate-spin"
						viewBox="0 0 576 512">
						<path
							fill="currentColor"
							d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 192 32.1 192h32v128c0 53 43 96 96 96H272zm32-320c-17.7 0-32 14.3-32 32s14.3 32 32 32h112c17.7 0 32 14.3 32 32v128h-32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S556.9 320 543.9 320h-32V192c0-53-43-96-96-96H304z"></path>
					</svg>
					<img src={post.account.avatar} className="w-5 h-5 rounded" alt="" />
					{withEmojis(post.account.display_name, post.account.emojis)} boosted
				</Link>
			)}
			<Status status={post.reblog !== null ? post.reblog : post} type="post" />
		</div>
	);
};