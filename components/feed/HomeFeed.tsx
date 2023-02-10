/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import Status from "components/posts/Status";
import Spinner from "components/spinners/Spinner";
import generator, { Entity, Response, WebSocketInterface } from "megalodon";
import { LegacyRef, MutableRefObject, useContext, useEffect, useRef, useState } from "react";

export const HomeFeed = () => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext)

	useEffect(() => {
		client.getHomeTimeline().then((res: Response<Array<Entity.Status>>) => {
			setPosts(res.data);
		});

		const interval = setInterval(() => {
			client.getHomeTimeline().then((res: Response<Array<Entity.Status>>) => {
				setPosts(res.data);
			});
		}, 15000);

		return () => clearInterval(interval);
	}, [client]);

	return (
		<>
			{JSON.stringify(posts) == "[]" ? (
				<div className="flex justify-center items-center w-full h-full">
					<Spinner className="w-10 h-10 text-gray-400 fill-orange-600" />
				</div>
			) : (
				<div className="flex flex-col gap-y-5 px-2 mt-10 w-full h-full">
					{posts.map(post => (
						<Post key={post.id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

const Post = ({ post }: {
	post: Entity.Status
}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<>
			<Status status={post} type="post"/>
		</>
	);
};
