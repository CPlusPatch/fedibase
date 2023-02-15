/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import InfiniteScrollPosts, { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";

export const Conversation = ({ id }) => {
	const [ancestors, setAncestors] = useState<Entity.Status[]>([]);
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const [descendants, setDescendants] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);

	useEffect(() => {
		client.getStatus(id).then(data => {
			setPosts([data.data]);

			client.getStatusContext(id).then(context => {
				setAncestors([...context.data.ancestors]);
				setDescendants([...context.data.descendants]);
				console.log([...context.data.descendants]);
				//setPosts([...context.data.ancestors, ...postsRef.current, ...context.data.descendants]);
			});
		});

		return () => setPosts([]);
	}, [client, id]);

	return (
		<WithLoader variable={posts}>
			<div className="flex overflow-y-auto flex-col gap-y-5 px-6 py-4 w-full h-full">
				{ancestors.map(post => (
					<Post post={post} key={post.id} />
				))}
				{posts.map(post => (
					<Post post={post} key={post.id} />
				))}
				<div className="pl-6 border-l-4">
					{descendants.map(post => (
						<Post post={post} key={post.id} />
					))}
				</div>
			</div>
		</WithLoader>
	);
};
