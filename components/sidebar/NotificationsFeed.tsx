/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import Status from "components/posts/Status";
import { Entity } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";
import { Bell, EnvelopePaperHeartFill, Globe, Hash, House, PeopleFill, StarFill } from "react-bootstrap-icons";

const sidebarLinks = [
	{
		name: "Home",
		icon: House,
		href: "/web",
	},
	{
		name: "Public",
		icon: Bell,
		href: "/web",
	},
	{
		name: "Federated",
		icon: Globe,
		href: "/web",
	},
];

export default function NotificationsFeed() {
	const [notifications, setNotifications] = useState<Entity.Notification[]>([]);
	const client = useContext(AuthContext);

	useEffect(() => {
		client.getNotifications().then(res => {
			setNotifications(res.data);
		});
		
		const interval = setInterval(() => {
			client.getNotifications().then(res => {
				setNotifications(res.data);
			});
		}, 15000);

		return () => clearInterval(interval); 
	}, [client]);
	
	return (
		<div className="flex flex-col gap-y-6 w-full max-w-full h-full font-inter">
			<h3 className="text-lg font-bold">Notifications</h3>
			<ul className="flex flex-col gap-y-2 max-w-full divide-y-2">
				{notifications.map(n => (
					<Notification key={n.id} n={n} />
				))}
			</ul>
		</div>
	);
}

const Notification = ({ n }: { n: Entity.Notification }) => {
	return (
		<>
			{(n.type == "mention" || n.type == "favourite" || n.type == "boost") && (
				<li className="flex overflow-hidden flex-col gap-y-2 p-2 max-w-full">
					{n.type == "favourite" && (
						<span className="flex overflow-hidden flex-row gap-x-2 items-center max-w-full italic text-gray-500 overflow-ellipsis">
							<StarFill className="w-4 h-4 fill-yellow-500" />
							{n.account.display_name} favourited your post
						</span>
					)}
					<Status status={n.status} type="notification"/>
				</li>
			)}
		</>
	);
};