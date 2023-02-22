/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { Response } from "megalodon";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { dedupeById } from "utils/functions";
import { useIsVisible } from "react-is-visible";
import { setInterval } from "timers";
import { DummyNotification } from "components/scroll/InfiniteScrollNotifications";

export enum FeedType {
	Home = "home",
	User = "user",
	Notifications = "notifications",
	Local = "local"
}

interface FeedProps {
	type: FeedType;
	entityElement: any;
	options?: {
		id: string;
	};
}

export default function Feed<T>(props: FeedProps) {
	const [entities, setEntities] = useState<T[]>([]);
	const entitiesRef = useRef<T[]>([]);
	const client = useContext(AuthContext);
	const loading = useRef<boolean>(false);
	const loadNewRef = useRef(null);
	const doLoadNewEntities = useIsVisible(loadNewRef);

	const getNewEntities = useCallback(
		async since_id => {
			loading.current = true;

			let res: Response<T[]>;
			switch (props.type) {
				case FeedType.Home: {
					res = (await client?.getHomeTimeline({
						limit: 30,
						since_id: since_id,
					})) as any;
					break;
				}
				case FeedType.User: {
					res = (await client?.getAccountStatuses(props.options.id, {
						limit: 30,
						since_id: since_id,
					})) as any;
					break;
				}
				case FeedType.Notifications: {
					res = (await client?.getNotifications({
						limit: 30,
						since_id: since_id,
					})) as any;
					break;
				}
				case FeedType.Local: {
					res = (await client?.getLocalTimeline({
						limit: 30,
						since_id: since_id,
					})) as any;
					break;
				}
			}
			loading.current = false;
			return dedupeById(res.data) as T[];
		},
		[client, props.options.id, props.type],
	);

	const loadEntitiesBefore = useCallback(
		async before_id => {
			if (loading.current) return [];
			loading.current = true;
			let res: Response<T[]>;
			switch (props.type) {
				case FeedType.Home: {
					res = (await client?.getHomeTimeline({
						limit: 30,
						max_id: before_id,
					})) as any;
					break;
				}
				case FeedType.User: {
					res = (await client?.getAccountStatuses(props.options.id, {
						limit: 30,
						max_id: before_id,
					})) as any;
					break;
				}
				case FeedType.Notifications: {
					res = (await client?.getNotifications({
						limit: 30,
						max_id: before_id,
					})) as any;
					break;
				}
				case FeedType.Local: {
					res = (await client?.getLocalTimeline({
						limit: 30,
						max_id: before_id,
					})) as any;
					break;
				}
			}
			loading.current = false;
			return dedupeById(res.data) as T[];
		},
		[client, props.options.id, props.type],
	);

	useEffect(() => {
		async function fetchInitialData() {
			if (!loading.current) {
				const latestEntities = await getNewEntities("");

				entitiesRef.current = dedupeById(latestEntities) as T[];
				setEntities(entitiesRef.current);
			}
		}

		fetchInitialData();
	}, [client, getNewEntities]);

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!loading.current) {
				const latestEntities = await getNewEntities((entitiesRef.current[0] as any).id);

				entitiesRef.current = dedupeById([
					...latestEntities,
					...entitiesRef.current,
				]) as T[];
				setEntities(entitiesRef.current);
			}
		}, 15000);

		return () => clearInterval(interval);
	}, [getNewEntities]);

	useEffect(() => {
		async function loadNewEntities() {
			if (doLoadNewEntities && !loading.current) {
				const latestPosts = await loadEntitiesBefore(
					(entitiesRef.current[entitiesRef.current.length - 1] as any).id,
				);

				entitiesRef.current = dedupeById([...entitiesRef.current, ...latestPosts]) as T[];
				setEntities(entitiesRef.current);
			}
		}

		loadNewEntities();
	}, [doLoadNewEntities, loadEntitiesBefore]);

	return (
		<>
			{entities.map((entity: any, index) => (
				<props.entityElement key={entity.id} entity={entity} />
			))}
			{(props.type === FeedType.Home || props.type === FeedType.User) && (
				<>
					<div ref={loadNewRef}>
						<DummyStatus type="post" />
					</div>
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
					<DummyStatus type="post" />
				</>
			)}
			{props.type === FeedType.Notifications && (
				<>
					<div ref={loadNewRef}>
						<DummyNotification />
					</div>
					<DummyNotification />
					<DummyNotification />
					<DummyNotification />
					<DummyNotification />
					<DummyNotification />
					<DummyNotification />
				</>
			)}
		</>
	);
}
