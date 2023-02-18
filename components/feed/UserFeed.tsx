/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import UserProfile from "components/profile/UserProfile";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";

export const UserFeed = ({ account }: { account: Entity.Account }) => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);
	
	useEffect(() => {
		// 	Check if account exists, as it might be null when the page starts loading
		if (account) {
			client
				.getAccountStatuses(account.id.replace("@", ""), {
					limit: 20
				}) // Remove the @ from the id in the URl bar, I forgot why it's even there
				.then((res: Response<Entity.Status[]>) => {
					setPosts(res.data);
					postsRef.current = res.data;
				});

			const interval = setInterval(() => {
				client
					.getAccountStatuses(account.id.replace("@", ""), {
						since_id: postsRef.current[0].id,
					})
					.then((res: Response<Entity.Status[]>) => {
						setPosts(n => [...res.data, ...n]);
						postsRef.current = [...res.data, ...postsRef.current];
					});
			}, 15000);

			// Needed because React re-renders twice in development mode
			return () => clearInterval(interval);
		}
	}, [account, client]);

	return (
		<>
			{account && (
				<div className="flex flex-col w-full h-full">
					<InfiniteScrollPosts
						account={account}
						posts={posts}
						loadNewPosts={() => {
							console.log("loading more posts...");

							client
								?.getAccountStatuses(account.id.replace("@", ""), {
									max_id: posts[posts.length - 1].id,
								})
								.then(res => {
									setPosts([...posts, ...res.data]);
									postsRef.current = [...posts, ...res.data];
								});
						}}
					/>
				</div>
			)}
		</>
	);
};

export default function InfiniteScrollPosts({
	posts,
	loadNewPosts,
	account
}: {
	posts: Entity.Status[];
	loadNewPosts(): void;
	account: any;
}) {
	return (
		<div
			className="flex overflow-y-scroll flex-col gap-y-5 px-6 py-4 no-scroll"
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
			<UserProfile user={account} />
			{posts.map(post => (
				<Post key={post.id} post={post} />
			))}
		</div>
	);
}