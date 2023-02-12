/* eslint-disable @next/next/no-img-element */
import { IconStarFilled } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import WithLoader from "components/loaders/WithLoader";
import Status from "components/posts/Status";
import Spinner from "components/spinners/Spinner";
import { Entity } from "megalodon";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { GridFill, List, StarFill } from "react-bootstrap-icons";
import { isEmpty } from "utils/functions";

const modes = [
	{ name: "Large", icon: GridFill, value: true },
	{ name: "Small", icon: List, value: false },
];

export default function NotificationsFeed() {
	const [notifications, setNotifications] = useState<Entity.Notification[]>([]);
	const client = useContext(AuthContext);

	useEffect(() => {
		client?.getNotifications({
			limit: 20
		}).then(res => {
			setNotifications(res.data);
		});

		/* const interval = setInterval(() => {
			client
				?.getNotifications({
					since_id: notifications[0].id,
				})
				.then(res => {
					setNotifications(n => [
						...res.data,
						...n
					]);
				});
		}, 15000);

		// Needed because React re-renders twice in development mode
		return () => clearInterval(interval); */

	}, [client]);
	return (
		<WithLoader variable={notifications}>
			<div className="flex flex-col gap-y-6 w-full max-w-full h-full font-inter">
				<div className="flex-row justify-between">
					<h3 className="text-lg font-bold">Notifications</h3>
				</div>
				<ul onScroll={(e) => {
					if (e.currentTarget) {
						// Check if scrolled to bottom
						const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
						if (scrollTop + clientHeight === scrollHeight) {
							// Load more notifications
							client
								?.getNotifications({
									max_id: notifications[notifications.length - 1].id,
								})
								.then(res => {
									setNotifications(notifications.concat(res.data));
								});
						}
					}
				}} className="flex overflow-y-auto flex-col gap-y-2 max-w-full divide-y-2">
					{notifications.map(n => (
						<Notification key={n.id} n={n} />
					))}
				</ul>
			</div>
		</WithLoader>
	);
}

const Notification = ({ n }: { n: Entity.Notification }) => {
	return (
		<>
			{(n.type == "mention" || n.type == "favourite" || n.type == "reblog") && (
				<li className="flex flex-col gap-y-2 p-2 max-w-full">
					{n.type == "favourite" && (
						<Link
							href={`/users/@${n.account.id}`}
							className="flex overflow-hidden flex-row gap-x-2 items-center max-w-full text-sm italic text-gray-500 overflow-ellipsis hover:underline">
							<IconStarFilled className="w-4 h-4 text-yellow-500 hover:animate-spin" />
							{n.account.display_name} favourited your post
						</Link>
					)}
					{n.type == "reblog" && (
						<Link
							href={`/users/@${n.account.id}`}
							className="flex overflow-hidden flex-row gap-x-2 items-center max-w-full text-sm italic text-gray-500 overflow-ellipsis hover:underline">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4 text-blue-500 hover:animate-spin"
								viewBox="0 0 576 512">
								<path
									fill="currentColor"
									d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 192 32.1 192h32v128c0 53 43 96 96 96H272zm32-320c-17.7 0-32 14.3-32 32s14.3 32 32 32h112c17.7 0 32 14.3 32 32v128h-32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S556.9 320 543.9 320h-32V192c0-53-43-96-96-96H304z"></path>
							</svg>
							{n.account.display_name} boosted your post
						</Link>
					)}
					<Status
						showInteraction={n.type == "mention"}
						status={n.status}
						type="notification"
					/>
				</li>
			)}
		</>
	);
};
