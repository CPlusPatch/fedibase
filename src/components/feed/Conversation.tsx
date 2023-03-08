import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { StatusType } from "components/posts/Status";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import { useState, useContext, useEffect, useRef } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

interface ConversationProps {
	id: string;
	mode: StatusType;
	showTitle?: boolean
}

export const Conversation = ({ id, mode, showTitle = true}: ConversationProps) => {
	const [ancestors, setAncestors] = useState<Entity.Status[]>([]);
	const [post, setPost] = useState<Entity.Status>();
	const [descendants, setDescendants] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const mainPostRef = useRef<HTMLDivElement>(null);

	function findParentElements(array: Entity.Status[], elementId: string) {
		const parentElements = [];
		let currentElement = array.find(element => element.id === elementId);
  
		while (currentElement && currentElement.in_reply_to_id !== "") {
			parentElements.push(currentElement);
			currentElement = array.find(element => element.id === currentElement?.in_reply_to_id);
		}
  
		return parentElements;
	}

	useEffect(() => {
		setPost(undefined);
		setAncestors([]);
		setDescendants([]);

		client?.getStatus(id).then(data => {
			setPost(data.data);

			client.getStatusContext(id).then(context => {
				setAncestors(
					findParentElements(
						[...context.data.ancestors, data.data],
						data.data.id,
					).reverse().slice(0, -1), // Slice because it includes the post, so remove last element
				);
				setDescendants(
					context.data.descendants,
				);
			});
		});

		return () => {
			setPost(undefined);
			setAncestors([]);
			setDescendants([]);
		};
	}, [id]);

	return (
		<>
			{showTitle && (
				<h3 className="px-5 py-4 text-xl font-bold dark:text-gray-50">Conversation</h3>
			)}
			{post ? (
				<div className="flex overflow-y-scroll flex-col gap-y-5 py-4 w-full h-full no-scroll">
					<div className="flex flex-col gap-y-4 px-6">
						{ancestors.map(ancestor => {
							return <Post entity={ancestor} mode={mode} key={ancestor.id} />;
						})}
					</div>
					<div
						className="px-6 py-4 border-y-2 dark:border-gray-700 bg-gray-300/10"
						ref={mainPostRef}>
						<Post entity={post} mode={mode} />
					</div>
					<div className="flex flex-col gap-y-4 pr-6 pl-4 mb-20">
						<ChildPost posts={descendants} mode={mode} parentId={post.id} />
					</div>
				</div>
			) : (
				<div className="flex overflow-y-auto flex-col gap-y-4 px-6 py-4 w-full h-full no-scroll">
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
				</div>
			)}
		</>
	);
};

type ChildPostProps = {
  posts: Entity.Status[];
  parentId?: string;
  mode: StatusType;
};

function ChildPost({ posts, parentId, mode }: ChildPostProps) {
	const children = posts.filter((post) => post.in_reply_to_id === parentId);

	return (
		<div className="flex flex-col gap-y-4 pl-2 border-l-4 dark:border-gray-500 rounded">
			{children.map((post) => (
				<Fragment key={post.id}>
					<Post mode={mode} entity={post} />
					<ChildPost posts={posts} parentId={post.id} mode={mode} />
				</Fragment>
			))}
		</div>
	);
}