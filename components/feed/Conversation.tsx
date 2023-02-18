/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import { arrayToTree } from "performant-array-to-tree";
import { useContext, useEffect, useState } from "react";

export const Conversation = ({ id }) => {
	const [ancestors, setAncestors] = useState<Entity.Status[]>([]);
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const [descendants, setDescendants] = useState([]);
	const client = useContext(AuthContext);

	useEffect(() => {
		client.getStatus(id).then(data => {
			setPosts([data.data]);

			client.getStatusContext(id).then(context => {
				setAncestors(context.data.ancestors);
				setDescendants(
					arrayToTree(context.data.descendants, {
						id: "id",
						parentId: "in_reply_to_id",
						rootParentIds: {
							[id]: true,
						},
						dataField: null,
					}) as any,
				);
			});
		});

		return () => setPosts([]);
	}, [client, id]);

	return (
		<WithLoader variable={posts}>
			<div className="flex overflow-y-auto flex-col gap-y-5 py-4 w-full h-full no-scroll">
				<div className="flex flex-col gap-y-4 px-6">
					{ancestors.map(post => (
						<Post post={post} key={post.id} />
					))}
				</div>
				<div className="px-6 py-4 border-y-2 dark:border-gray-700">
					{posts.map(post => (
						<Post post={post} key={post.id} />
					))}
				</div>
				<div className="flex flex-col gap-y-4 px-6">
					{descendants.map(post => (
						<PostWithChildren post={post} key={post.id} />
					))}
				</div>
			</div>
		</WithLoader>
	);
};

function PostWithChildren({ post }) {
	return (
		<>
			{post.children.length > 0 ? (
				<>
				<Post post={post} />
					<div className="flex flex-col gap-y-4 pl-2 border-l-4 dark:border-gray-500">
						{post.children.map(postChild => (
							<PostWithChildren post={postChild} key={postChild.id}/>
						))}
					</div>
				</>
			) : (
				<Post post={post} />
			)}
		</>
	);
}
