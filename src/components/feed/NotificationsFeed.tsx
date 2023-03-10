import {
	IconList,
	IconListDetails,
	IconRocket,
	IconStarFilled,
} from "@tabler/icons-preact";
import { SelectItem } from "components/forms/Select2";
import { Notification as NotificationElement } from "components/posts/Notification";
import { Entity } from "megalodon";
import { useState } from "preact/hooks";
import Feed, { FeedType } from "./Feed";
import { memo } from "preact/compat";
import SmallSelect, { SelectDirection } from "components/forms/SmallSelect";

const modes: SelectItem[] = [
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

function NotificationsFeed({ withTitle = true }: { withTitle?: boolean }) {
	const [mode, setMode] = useState(modes[0]);

	return (
		<div className="flex flex-col gap-y-6 w-full max-w-full min-h-full font-inter">
			{withTitle && (
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-lg font-bold dark:text-gray-50">
						Notifications
					</h3>
					<SmallSelect
						items={modes}
						defaultValue={0}
						onChange={item => {
							setMode(item);
						}}
						direction={SelectDirection.Left}
					/>
				</div>
			)}

			<ul className="flex overflow-y-scroll flex-col overflow-x-hidden gap-y-3 max-w-full h-full no-scroll">
				<Feed<Entity.Notification>
					type={FeedType.Notifications}
					onLoadNew={(entities: Entity.Notification[]) => {
						if (
							Notification.permission === "denied" ||
							Notification.permission === "default"
						)
							return;
						entities.forEach(entity => {
							let title;
							switch (entity.type) {
								case "favourite":
									title = `${entity.account.display_name} favourited your post`;
									break;
								case "reblog":
									title = `${entity.account.display_name} boosted your post`;
									break;
								case "follow":
									title = `${entity.account.display_name} followed you`;
									break;
								case "emoji_reaction":
									title = `${entity.account.display_name} reacted with ${entity.emoji}`;
									break;
								case "mention":
								default:
									title = `${entity.account.display_name}`;
									break;
							}

							const notif = new Notification(title, {
								body: entity.status?.plain_content ?? "",
								icon: entity.account.avatar_static,
							});

							notif.onclick = () => {
								window.parent.focus();
								notif.close();
							};
						});
					}}
					entityElement={NotificationElement}
					options={{
						id: "",
						filter: mode.value,
					}}
				/>
			</ul>
		</div>
	);
}

export default memo(NotificationsFeed);
