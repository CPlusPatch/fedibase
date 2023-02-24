/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import { arrayToTree } from "performant-array-to-tree";
import { useState, useContext, useEffect } from "preact/hooks";

export const Conversation = ({ id, mode }) => {
	const [ancestors, setAncestors] = useState<Entity.Status[]>([]);
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const [descendants, setDescendants] = useState([]);
	const client = useContext(AuthContext);

	function findParentElements(array, elementId) {
		let parentElements = [];
		let currentElement = array.find(element => element.id === elementId);
		while (currentElement && currentElement.in_reply_to_id !== false) {
			let parentElement = array.find(element => element.id === currentElement.in_reply_to_id);
			if (parentElement) {
				parentElements.push(parentElement);
				currentElement = parentElement;
			} else {
				currentElement = null;
			}
		}
		return parentElements;
	}

	useEffect(() => {
		client.getStatus(id).then(data => {
			setPosts([data.data]);

			client.getStatusContext(id).then(context => {
				setAncestors(findParentElements([...context.data.ancestors, data.data], data.data.id).reverse());
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
		<>
			<h3 className="px-5 py-4 text-xl font-bold dark:text-gray-50">
				Conversation
			</h3>
			{posts.length > 0 ? (
				<div className="flex overflow-y-scroll flex-col gap-y-5 py-4 w-full h-full no-scroll">
					<div className="flex flex-col gap-y-4 px-6">
						{ancestors.map(post => (
							<Post entity={post} mode={mode} key={post.id} />
						))}
					</div>
					<div className="px-6 py-4 border-y-2 dark:border-gray-700 bg-gray-300/10">
						{posts.map(post => (
							<Post entity={post} mode={mode} key={post.id} />
						))}
					</div>
					<div className="flex flex-col gap-y-4 px-6 mb-20">
						{descendants.map(post => (
							<PostWithChildren mode={mode} post={post} key={post.id} />
						))}
					</div>
				</div>
			) : (
				<div className="flex overflow-y-auto flex-col gap-y-4 px-6 py-4 w-full h-full no-scroll">
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
				</div>
			)}
		</>
	);
};

function PostWithChildren({ post, mode }) {
	return (
		<>
			{post.children.length > 0 ? (
				<>
					<Post entity={post} />
					<div className="flex flex-col gap-y-4 pl-2 border-l-4 dark:border-gray-500">
						{post.children.map(postChild => (
							<PostWithChildren post={postChild} key={postChild.id} mode={mode} />
						))}
					</div>
				</>
			) : (
				<Post mode={mode} entity={post} />
			)}
		</>
	);
}
