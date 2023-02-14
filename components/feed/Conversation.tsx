/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import InfiniteScrollPosts, { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";

export const Conversation = ({ id }) => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);

	useEffect(() => {
		client.getStatus(id).then(data => {
			setPosts([data.data]);

			client.getStatusContext(id).then(context => {
				setPosts(p => [...context.data.ancestors, ...p, ...context.data.descendants]);
			});
		})
	}, []);

	return (
		<WithLoader variable={posts}>
			<div className="flex flex-col gap-y-5 px-6 py-4 w-full h-full">
				{posts.map(post => (
					<Post post={post} key={post.id} />
				))}
			</div>
		</WithLoader>
	);
};
