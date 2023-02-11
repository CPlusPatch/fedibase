/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import Status from "components/posts/Status";
import UserProfile from "components/profile/UserProfile";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";

export const UserFeed = ({ account }: { account: Entity.Account }) => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);

	useEffect(() => {
		// 	Check if account exists, as it might be null when the page starts loading
		if (account) {
			client
				.getAccountStatuses(account.id.replace("@", "")) // Remove the @ from the id in the URl bar, I forgot why it's even there
				.then((res: Response<Entity.Status[]>) => {
					setPosts(res.data);
				});

			const interval = setInterval(() => {
				client
					.getAccountStatuses(account.id.replace("@", ""))
					.then((res: Response<Entity.Status[]>) => {
						setPosts(res.data);
					});
			}, 15000);

			// Needed because React re-renders twice in development mode
			return () => clearInterval(interval);
		}
	}, [account, client]);

	return (
		<>
			{account && (
				<div className="flex flex-col gap-y-5 px-2 mt-5 w-full h-full">
					<UserProfile user={account} />
					{posts.map(post => (
						<Post key={post.id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

const Post = ({ post }: { post: Entity.Status }) => {
	return <Status status={post} type="post" />;
};
