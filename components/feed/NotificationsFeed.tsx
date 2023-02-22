/* eslint-disable @next/next/no-img-element */
import { IconList, IconListDetails, IconRocket, IconStarFilled } from "@tabler/icons-react";
import SmallSelect, { SelectDirection } from "components/forms/SmallSelect";
import { Notification } from "components/scroll/InfiniteScrollNotifications";
import { Entity } from "megalodon";
import { useState } from "react";
import Feed, { FeedType } from "./Feed";

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
	const [mode, setMode] = useState(modes[0]);

	return (
		<div className="flex flex-col gap-y-6 w-full max-w-full min-h-full font-inter">
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
			
				<div className="flex overflow-y-scroll flex-col gap-y-2 max-w-full h-full divide-y-2 dark:divide-gray-700 no-scroll">
					<Feed<Entity.Notification> type={FeedType.Notifications} entityElement={Notification} options={{
						id: "",
						filter: mode.value
					}}/>
				</div>
		</div>
	);
}
