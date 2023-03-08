import { AuthContext } from "components/context/AuthContext";
import DummyStatus from "components/posts/DummyStatus";
import { Response } from "megalodon";
import { dedupeById } from "utils/functions";
import { useIsVisible } from "react-is-visible";
import { useState, useRef, useContext, useCallback, useEffect, MutableRef } from "preact/hooks";
import { memo } from "preact/compat";
import { StatusType } from "components/posts/Status";

export enum FeedType {
	Home = "home",
	User = "user",
	Notifications = "notifications",
	Local = "local",
}

const DEFAULT_LOAD = 20;

interface FeedProps {
	type: FeedType;
	entityElement: any;
	onLoadNew: (entities: any) => void;
	options?: {
		id: string;
		filter?: string;
	};
	onLoadStart?: () => void;
	onLoadEnd?: () => void;
}

function Feed<T>(props: FeedProps) {
	const [entities, setEntities] = useState<T[]>([]);
	const entitiesRef = useRef<T[]>([]);
	const client = useContext(AuthContext);
	const loading = useRef<boolean>(false);
	const loadNewRef = useRef(null);
	const doLoadNewEntities = useIsVisible(loadNewRef);
	const [, setInitialLoadDone] = useState<boolean>(false);

	const getNewEntities = useCallback(
		async (since_id: string) => {
			if (loading.current) return;
			loading.current = true;
			props.onLoadStart && props.onLoadStart();
			let res: Response<T[]>;
			switch (props.type) {
			case FeedType.Home: {
				res = (await client?.getHomeTimeline({
					limit: DEFAULT_LOAD,
					since_id: since_id,
				})) as any;
				break;
			}
			case FeedType.User: {
				if (!props.options?.id)
					throw Error("Feed needs a user ID to work in user mode!");
				res = (await client?.getAccountStatuses(props.options.id, {
					limit: DEFAULT_LOAD,
					since_id: since_id,
				})) as any;
				break;
			}
			case FeedType.Notifications: {
				res = (await client?.getNotifications({
					limit: DEFAULT_LOAD,
					since_id: since_id,
				})) as any;
				break;
			}
			case FeedType.Local: {
				res = (await client?.getLocalTimeline({
					limit: DEFAULT_LOAD,
					since_id: since_id,
				})) as any;
				break;
			}
			}
			loading.current = false;
			props.onLoadEnd && props.onLoadEnd();
			return dedupeById(res.data as any) as T[];
		},
		[props.options?.id, props.type],
	);

	const loadEntitiesBefore = useCallback(
		async (before_id: string) => {
			if (loading.current) return [];
			loading.current = true;
			props.onLoadStart && props.onLoadStart();
			let res: Response<T[]>;
			switch (props.type) {
			case FeedType.Home: {
				res = (await client?.getHomeTimeline({
					limit: DEFAULT_LOAD,
					max_id: before_id,
				})) as any;
				break;
			}
			case FeedType.User: {
				if (!props.options?.id)
					throw Error("Feed needs a user ID to work in user mode!");
				res = (await client?.getAccountStatuses(props.options.id, {
					limit: DEFAULT_LOAD,
					max_id: before_id,
				})) as any;
				break;
			}
			case FeedType.Notifications: {
				res = (await client?.getNotifications({
					limit: DEFAULT_LOAD,
					max_id: before_id,
				})) as any;
				break;
			}
			case FeedType.Local: {
				res = (await client?.getLocalTimeline({
					limit: DEFAULT_LOAD,
					max_id: before_id,
				})) as any;
				break;
			}
			}
			loading.current = false;
			props.onLoadEnd && props.onLoadEnd();
			return dedupeById(res.data as any) as T[];
		},
		[props.options?.id, props.type],
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			async function fetchInitialData() {
				if (!loading.current) {
					const latestEntities = await getNewEntities("") ?? [];

					entitiesRef.current = dedupeById(latestEntities as any) as T[];
					setEntities(entitiesRef.current);
					setInitialLoadDone(true);
				}
			}

			fetchInitialData();
		}, 300);

		return () => clearTimeout(timeout);
	}, [getNewEntities]);

	useEffect(() => {
		const interval = window.setInterval(async () => {
			if (!loading.current) {
				const latestEntities = await getNewEntities((entitiesRef.current[0] as any).id) ?? [];

				entitiesRef.current = dedupeById([
					...latestEntities,
					...entitiesRef.current,
				] as any) as T[];
				props.onLoadNew(latestEntities);
				setEntities(entitiesRef.current);
			}
		}, 15000);

		return () => window.clearInterval(interval);
	}, [getNewEntities]);

	useEffect(() => {
		async function loadMoreEntities() {
			if (doLoadNewEntities && !loading.current && entitiesRef.current.length > 0) {
				const latestPosts = await loadEntitiesBefore(
					(entitiesRef.current[entitiesRef.current.length - 1] as any).id,
				);

				entitiesRef.current = dedupeById([
					...entitiesRef.current,
					...latestPosts,
				] as any) as T[];
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
						switch (props.options?.filter) {
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
					.map((entity: any) => (
						<props.entityElement key={entity.id} entity={entity} />
					))}
			{(props.type === FeedType.Home || props.type === FeedType.User) && (
				<>
					<DummyStatus statusType={StatusType.Post} reference={loadNewRef} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
					<DummyStatus statusType={StatusType.Post} />
				</>
			)}
			{props.type === FeedType.Notifications && (
				<>
					<DummyNotification reference={loadNewRef} />
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

const DummyNotification = ({ reference }: { reference?: MutableRef<any> | null }) => {
	return (
		<>
			<li
				ref={reference ?? undefined}
				className={"flex flex-col gap-y-2 p-2 max-w-full rounded"}>
				<DummyStatus statusType={StatusType.Notification} />
			</li>
		</>
	);
};

export default memo(Feed);
