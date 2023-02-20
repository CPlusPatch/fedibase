/* eslint-disable @next/next/no-img-element */
import { IconList, IconListDetails, IconRocket, IconStarFilled } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import SmallSelect, { SelectDirection } from "components/forms/SmallSelect";
import DummyStatus from "components/posts/DummyStatus";
import InfiniteScrollNotifications from "components/scroll/InfiniteScrollNotifications";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const modes = [
	{
		icon: IconList,
		text: "All posts",
		value: "all",
		description: "Show all posts",
	},
	{
		icon: IconListDetails,
		text: "Mentions",
		value: "mention",
		description: "Only show mentions",
	},
	{
		icon: IconRocket,
		text: "Boosts",
		value: "reblogs",
		description: "Only show boosts",
	},
	{
		icon: IconStarFilled,
		text: "Favourites",
		value: "favourites",
		description: "Only show favourites",
	},
];

export default function NotificationsFeed({ withTitle = true }: { withTitle?: boolean }) {
	const [notifications, setNotifications] = useState<Entity.Notification[]>([]);
	const client = useContext(AuthContext);
	const notifsRef = useRef(notifications);
	const [mode, setMode] = useState(modes[0]);

	useEffect(() => {
		client
			?.getNotifications({
				limit: 20,
			})
			.then((res: Response<Entity.Notification[]>) => {
				setNotifications(res.data);
				notifsRef.current = res.data;
			})
			.catch(e => {
				console.log(e);
				toast.error("Couldn't load notifications :(");
			});

		const interval = setInterval(() => {
			if (notifsRef.current.length > 0)
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
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-lg font-bold dark:text-gray-50">Notifications</h3>
					<SmallSelect
						items={modes}
						selected={mode}
						setSelected={setMode}
						direction={SelectDirection.Left}
					/>
				</div>
			)}
			{notifications.length > 0 ? (
				<InfiniteScrollNotifications
					notifs={notifications}
					mode={mode.value}
					loadNewNotifs={async () => {
						console.log("loading more notifs...");

						const res = await client?.getNotifications({
							max_id: notifsRef.current[notifsRef.current.length - 1].id,
						});

						setNotifications(n => [...n, ...res.data]);
						notifsRef.current = [...notifications, ...res.data];
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
