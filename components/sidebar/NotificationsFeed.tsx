/* eslint-disable @next/next/no-img-element */
import { IconList, IconListDetails, IconRocket, IconStarFilled } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import SmallSelect, { SelectDirection } from "components/forms/SmallSelect";
import DummyStatus from "components/posts/DummyStatus";
import InfiniteScrollNotifications from "components/scroll/InfiniteScrollNotifications";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { dedupeById } from "utils/functions";

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
	const loading = useRef<boolean>(false);

	useEffect(() => {
		async function getInitialData() {
			const res: Response<Entity.Notification[]> = await client?.getNotifications({
				limit: 20,
			});
			const dedupedData: Entity.Notification[] = dedupeById(res.data) as any;
			setNotifications(dedupedData);
			notifsRef.current = dedupedData;
		}

		// Periodically fetch new notifications and add them to the beginning of the list
		const interval = setInterval(() => {
			if (notifsRef.current.length > 0) {
				console.log("[+] Fetching new notifications...");
					client
						?.getNotifications({
							since_id: notifsRef.current[0].id,
						})
						.then(res => {
							const deduped = dedupeById([
								...res.data,
								...notifsRef.current,
							]) as any;
							setNotifications(n => deduped);
							notifsRef.current = deduped;
						});
			}
		}, 15000);

		getInitialData();

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
			
				<InfiniteScrollNotifications
					notifs={notifications}
					mode={mode.value}
					loadNewNotifs={async () => {
						if (notifsRef.current.length > 0) {
							console.log("[+] Loading more notifications...");

							const res = await client?.getNotifications({
								max_id: notifsRef.current[notifsRef.current.length - 1].id,
							});

							setNotifications(n => dedupeById([...n, ...res.data]) as any);
							notifsRef.current = dedupeById([...notifications, ...res.data]) as any;
						}
					}}></InfiniteScrollNotifications>
		</div>
	);
}
