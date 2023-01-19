/* eslint-disable @next/next/no-img-element */
import { AuthContext } from "components/context/AuthContext";
import { Entity, WebSocketInterface } from "megalodon";
import { useContext, useEffect, useRef, useState } from "react";
import { Bell, EnvelopePaperHeartFill, Globe, Hash, House, PeopleFill } from "react-bootstrap-icons";

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
		client.getNotifications().then((res) => {
			setNotifications(res.data);
		});

		/* setInterval(() => {
			client.getNotifications().then(res => {
				setNotifications(res.data);
			});
		}, 10000); */
	}, [client]);
	
	return (
		<div className="flex flex-col gap-y-6 w-full h-full font-inter">
			<h3 className="text-lg font-bold">Notifications</h3>
			<ul className="flex flex-col gap-y-4">
				{notifications.map(n => (
					<Notification key={n.id} n={n} />
				))}
			</ul>
		</div>
	);
}

const Notification = ({ n }: { n: Entity.Notification }) => {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<li className="flex">
			<div className="flex-shrink-0 mr-4">
				<img
					alt=""
					src={n.status.account.avatar}
					className="w-10 h-10 text-gray-300 bg-white rounded border border-gray-300"
				/>
			</div>
			<div>
				<div className="flex flex-col gap-x-2 md:items-center md:flex-row">
					<h4 className="text-lg font-bold">{n.status.account.username}</h4>
					<h6 className="text-gray-500 text-md">{n.status.account.acct}</h6>
				</div>
				<div className="flex flex-col gap-y-1">
					<div
						className="w-full"
						style={{
							maskSize: "auto 8em auto auto",
							maskPosition: "0 0,0 0",
							maskRepeat: "repeat-x,repeat",
							maskImage: expand
								? ""
								: "linear-gradient(to bottom, white 2em, transparent 8em)",
							maskComposite: "excluse",
							overflow: expand ? "" : "hidden",
							maxHeight: expand ? "" : "8rem",
						}}>
						<p
							ref={textRef}
							className="mt-1"
							dangerouslySetInnerHTML={{ __html: n.status.content }}></p>
					</div>
					{textRef?.current?.offsetHeight > 128 && (
						<>
							<hr />
							<button
								className="mx-auto w-full text-blue-800 hover:underline"
								onClick={() => {
									setExpand(!expand);
								}}>
								{expand === true ? "Less" : "More"}
							</button>
						</>
					)}
				</div>
			</div>
		</li>
	);
};