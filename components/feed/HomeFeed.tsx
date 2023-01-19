/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import generator, { Entity, Response } from "megalodon";
import { LegacyRef, MutableRefObject, useContext, useEffect, useRef, useState } from "react";

const postDemo = [
	{
		id: 1,
		author: {
			name: "John Doe",
			username: "@johndoe@social.cpluspatch.com"
		},
		text: "Hey, what's up?",
	}
]

export const HomeFeed = () => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);

	useEffect(() => {
		client.getHomeTimeline().then((res: Response<Array<Entity.Status>>) => {
			setPosts(res.data);
		});

		setInterval(() => {
			client.getHomeTimeline().then((res: Response<Array<Entity.Status>>) => {
				setPosts(res.data);
			});
		}, 10000);
	}, [client]);

	return (
		<div className="flex flex-col gap-y-5 px-2 mt-10 w-full h-full">
			{posts.map(post => (
				<Post key={post.id} post={post}/>
			))}
		</div>
	);
};

const Post = ({ post }: {
	post: Entity.Status
}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className="flex font-inter">
			<div className="flex-shrink-0 mr-4">
				<img
					alt=""
					src={post.account.avatar}
					className="w-16 h-16 text-gray-300 bg-white rounded border border-gray-300"
				/>
			</div>
			<div>
				<div className="flex flex-col gap-x-2 md:items-center md:flex-row">
					<h4 className="text-lg font-bold">{post.account.username}</h4>
					<h6 className="text-gray-500 text-md">{post.account.acct}</h6>
				</div>
				<div className="flex flex-col gap-y-1">
					<div
						className="w-full"
						style={{
							maskSize: "auto 8em auto auto",
							maskPosition: "0 0,0 0",
							maskRepeat: "repeat-x,repeat",
							maskImage: expand ? "" : "linear-gradient(to bottom, white 2em, transparent 8em)",
							maskComposite: "excluse",
							overflow: expand ? "" : "hidden",
							maxHeight: expand ? "" : "8rem"
						}}>
						<p
							ref={textRef}
							className="mt-1"
							dangerouslySetInnerHTML={{ __html: post.content }}></p>
					</div>
					{textRef?.current?.offsetHeight > 128 && (
						<>
							<hr />
							<button
								className="mx-auto w-full text-blue-800 hover:underline"
								onClick={() => {
									setExpand(!expand);
								}}>
								{expand === true ? "Less" : "More"}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
