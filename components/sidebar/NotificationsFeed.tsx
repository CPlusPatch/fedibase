/* eslint-disable @next/next/no-img-element */
import { IconStarFilled } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import Status, { DummyStatus } from "components/posts/Status";
import InfiniteScrollNotifications from "components/scroll/InfiniteScrollNotifications";
import { Entity, Response } from "megalodon";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { withEmojis } from "utils/functions";

export default function NotificationsFeed({ withTitle = true }: { withTitle?: boolean }) {
	const [notifications, setNotifications] = useState<Entity.Notification[]>([]);
	const client = useContext(AuthContext);
	const notifsRef = useRef(notifications);

	useEffect(() => {
		client
			?.getNotifications({
				limit: 20,
			})
			.then((res: Response<Entity.Notification[]>) => {
				setNotifications(res.data);
				notifsRef.current = res.data;
			});

		const interval = setInterval(() => {
			client
				?.getNotifications({
					since_id: notifsRef.current[0].id,
				})
				.then(res => {
					setNotifications(n => [...res.data, ...n]);
					notifsRef.current = [...res.data, ...notifsRef.current];
				});
		}, 15000);

		return () => clearInterval(interval);
	}, [client]);

	return (
		<div className="flex flex-col gap-y-6 w-full max-w-full h-full font-inter">
			{withTitle && (
				<div className="flex-row justify-between">
					<h3 className="text-lg font-bold dark:text-gray-50">Notifications</h3>
				</div>
			)}
			{notifications.length > 0 ? (
				<InfiniteScrollNotifications
					notifs={notifications}
					loadNewNotifs={() => {
						console.log("loading more notifs...");

						client
							?.getNotifications({
								max_id: notifications[notifications.length - 1].id,
							})
							.then(res => {
								setNotifications(n => [...n, ...res.data]);
								notifsRef.current = [...notifications, ...res.data];
							});
					}}></InfiniteScrollNotifications>
			) : (
				<div className="flex overflow-y-auto flex-col gap-y-4 max-w-full no-scroll">
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
					<DummyStatus type="notification" />
				</div>
			)}
		</div>
	);
}
