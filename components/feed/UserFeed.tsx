/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import Status from "components/posts/Status";
import generator, { Entity, Response, WebSocketInterface } from "megalodon";
import { LegacyRef, MutableRefObject, useContext, useEffect, useRef, useState } from "react";

export const UserFeed = ({ id }: { id: string }) => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const [user, setUser] = useState<Entity.Account>();
	const client = useContext(AuthContext);

	useEffect(() => {
		client.getAccount(id.replace("@", "")).then((res: Response<Entity.Account>) => {
			setUser(res.data);
		});
		
		client.getAccountStatuses(id.replace("@", "")).then((res: Response<Entity.Status[]>) => {
			setPosts(res.data);
		});

		const interval = setInterval(() => {
			client
				.getAccountStatuses(id.replace("@", ""))
				.then((res: Response<Entity.Status[]>) => {
					setPosts(res.data);
				});
		}, 15000);

/* 		return () => clearInterval(interval); */
	}, [id, client]);

	return (
		<>
			{user && (
				<div className="flex flex-col gap-y-5 px-2 mt-5 w-full h-full">
					<UserProfile user={user} />
					{posts.map(post => (
						<Post key={post.id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

function UserProfile({ user }: {
	user: Entity.Account
}) {
	return (
		<div className="flex flex-col gap-y-4 p-3 w-full border-b-2">
			<div className="relative w-full">
				<div className="flex overflow-hidden justify-center items-center w-full h-44 rounded">
					<img src={user.header} className="w-full" />
				</div>
				<img className="absolute -bottom-5 left-5 w-20 rounded border" src={user.avatar} alt={user.acct} />
			</div>
			<div className="flex flex-row gap-x-4 px-4 mt-4 w-full">
				<div className="flex flex-row gap-x-2 items-center">
					<h4 className="flex-shrink text-2xl font-bold font-poppins">{user.display_name}</h4>
					<h6
						title={user.acct}
						className="overflow-hidden text-gray-500 overflow-ellipsis font-inter">
						{user.acct}
					</h6>
				</div>
			</div>
			<div className="p-3 w-full rounded-md border font-inter" dangerouslySetInnerHTML={{ __html: user.note }}></div>
		</div>
	);
}

const Post = ({ post }: { post: Entity.Status }) => {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<>
			<Status status={post} type="post" />
		</>
	);
};