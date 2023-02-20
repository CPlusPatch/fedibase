/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import DummyStatus from "components/posts/DummyStatus";
import InfiniteScrollPosts from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export const HomeFeed = () => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);

	useEffect(() => {
		client
			?.getHomeTimeline({
				limit: 20,
			})
			.then((res: Response<Array<Entity.Status>>) => {
				setPosts(res.data);
				postsRef.current = res.data;
			})
			.catch(e => {
				console.log(e);
				toast.error("Couldn't load timeline :(");
			});

		const interval = setInterval(() => {
			if (postsRef.current.length > 0)
				client
					?.getHomeTimeline({
						since_id: postsRef.current[0].id,
					})
					.then(res => {
						setPosts(n => [...res.data, ...n]);
						postsRef.current = [...res.data, ...postsRef.current];
					});
		}, 15000);

		return () => clearInterval(interval);
	}, [client]);

	return (
		<>
			{posts.length > 0 ? (
				<div className="flex flex-col gap-y-5 w-full h-full">
					<InfiniteScrollPosts
						posts={posts}
						loadNewPosts={() => {
							console.log("loading more posts...");

							client
								?.getHomeTimeline({
									max_id: posts[posts.length - 1].id,
								})
								.then(res => {
									setPosts([...posts, ...res.data]);
									postsRef.current = [...posts, ...res.data];
								});
						}}
					/>
				</div>
			) : (
				<div className="flex flex-col gap-y-5 w-full h-full">
					<div className="flex overflow-y-auto flex-col gap-y-5 px-6 py-4 md:mt-10 no-scroll">
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
						<DummyStatus type="post" />
					</div>
				</div>
			)}
		</>
	);
};
