import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { Response } from "megalodon";
import { dedupeById } from "utils/functions";
import { useIsVisible } from "react-is-visible";
import { DummyNotification } from "components/scroll/InfiniteScrollNotifications";
import { useState, useRef, useContext, useCallback, useEffect } from "preact/hooks";
import { memo } from "preact/compat";

export enum FeedType {
	Home = "home",
	User = "user",
	Notifications = "notifications",
	Local = "local",
}

interface FeedProps {
	type: FeedType;
	entityElement: any;
	onChange: (entities: any) => void;
	options?: {
		id: string;
		filter?: string;
	};
}

function Feed<T>(props: FeedProps) {
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
			return dedupeById(res.data as any) as T[];
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
			return dedupeById(res.data as any) as T[];
		},
		[client, props.options.id, props.type],
	);

	useEffect(() => {
		async function fetchInitialData() {
			if (!loading.current) {
				const latestEntities = await getNewEntities("");

				entitiesRef.current = dedupeById(latestEntities as any) as T[];

				props.onChange(latestEntities);
				setEntities(entitiesRef.current);
			}
		}

		fetchInitialData();
	}, [client, getNewEntities]);

	useEffect(() => {
		const interval = window.setInterval(async () => {
			if (!loading.current) {
				const latestEntities = await getNewEntities((entitiesRef.current[0] as any).id);

				entitiesRef.current = dedupeById([
					...latestEntities,
					...entitiesRef.current,
				] as any) as T[];
				props.onChange(latestEntities);
				setEntities(entitiesRef.current);
			}
		}, 15000);

		return () => window.clearInterval(interval);
	}, [getNewEntities]);

	useEffect(() => {
		async function loadMoreEntities() {
			if (doLoadNewEntities && !loading.current) {
				const latestPosts = await loadEntitiesBefore(
					(entitiesRef.current[entitiesRef.current.length - 1] as any).id,
				);

				entitiesRef.current = dedupeById([
					...entitiesRef.current,
					...latestPosts,
				] as any) as T[];
				props.onChange(latestPosts);
				setEntities(entitiesRef.current);
			}
		}

		loadMoreEntities();
	}, [doLoadNewEntities, loadEntitiesBefore]);

	return (
		<>
			{props.type !== FeedType.Notifications &&
				entities.map((entity: any) => (
					<props.entityElement key={entity.id} entity={entity} />
				))}

			{props.type === FeedType.Notifications &&
				entities
					.filter(e => {
						switch (props.options.filter) {
							case "all":
								return true;
							case "reblogs":
								return (e as Entity.Notification).type === "reblog";
							case "mention":
								return (e as Entity.Notification).type === "mention";
							case "favourites":
								return (e as Entity.Notification).type === "favourite";
						}
					})
					.map((entity: any, index) => (
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

export default memo(Feed);
