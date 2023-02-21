/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { dedupeById } from "utils/functions";
import { useIsVisible } from "react-is-visible";
import { setInterval } from "timers";

export const HomeFeed = () => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const postsRef = useRef<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const loading = useRef<boolean>(false);
	const loadNewRef = useRef(null);
	const doLoadNewPosts = useIsVisible(loadNewRef);

	const getNewPosts = useCallback(
		async since_id => {
			loading.current = true;
			const res: Response<Entity.Status[]> = await client?.getHomeTimeline({
				limit: 30,
				since_id: since_id,
			});
			loading.current = false;
			return dedupeById(res.data) as Entity.Status[];
		},
		[client],
	);

	const loadPostsBefore = useCallback(
		async before_id => {
			if (loading.current) return [];
			loading.current = true;
			const res: Response<Entity.Status[]> = await client?.getHomeTimeline({
				limit: 30,
				max_id: before_id,
			});
			loading.current = false;
			return dedupeById(res.data) as Entity.Status[];
		},
		[client],
	);

	useEffect(() => {
		async function fetchInitialData() {
			if(!loading.current) {
				const latestPosts = await getNewPosts("");

				postsRef.current = (dedupeById(latestPosts) as Entity.Status[]);
				setPosts(postsRef.current);
			}
		}

		fetchInitialData();
		
	}, [client, getNewPosts]);

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!loading.current) {
				console.log(postsRef.current)
				const latestPosts = await getNewPosts(postsRef.current[0].id);

				postsRef.current = (dedupeById([...latestPosts, ...postsRef.current]) as Entity.Status[]);
				setPosts(postsRef.current);
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [getNewPosts])

	useEffect(() => {
		async function loadNewPosts() {
			if (doLoadNewPosts && !loading.current) {
				const latestPosts = await loadPostsBefore(postsRef.current[postsRef.current.length - 1].id);

				postsRef.current = (dedupeById([...postsRef.current, ...latestPosts]) as Entity.Status[]);
				setPosts(postsRef.current);
			}
		}

		loadNewPosts();
	}, [doLoadNewPosts, loadPostsBefore])

	return (
		<>
			<div className="flex overflow-y-scroll flex-col gap-y-5 px-6 py-4 pb-20 w-full h-full no-scroll md:mt-10">
				{posts.map((post, index) => (
					<Post key={post.id} post={post} />
				))}
				<div ref={loadNewRef}>
					<DummyStatus type="post" />
				</div>
				<DummyStatus type="post" />
				<DummyStatus type="post" />
				<DummyStatus type="post" />
				<DummyStatus type="post" />
				<DummyStatus type="post" />
				<DummyStatus type="post" />
			</div>
		</>
	);
};
