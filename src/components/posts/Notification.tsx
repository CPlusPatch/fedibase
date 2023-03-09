import { IconStarFilled } from "@tabler/icons-preact";
import { withEmojis, withEmojiReactions } from "utils/functions";
import Status, { StatusType } from "./Status";
import { Link } from "components/transitions/Link";
import { memo } from "preact/compat";

export const Notification = memo(({ entity }: { entity: Entity.Notification }) => {
	return (
		<>
			{(entity.type == "mention" ||
				entity.type == "favourite" ||
				entity.type == "reblog" ||
				entity.type == "emoji_reaction") && (
				<li
					className={`flex flex-col gap-y-2 p-2 max-w-full rounded ${
						entity.type == "favourite" && "bg-yellow-500/10"
					} ${entity.type == "reblog" && "bg-blue-500/10"} ${
						entity.type == "emoji_reaction" && "bg-red-500/10"
					}`}>
					{entity.type == "favourite" && (
						<Link
							href={`/users/@${entity.account.id}`}
							className="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
							<IconStarFilled
								aria-hidden={true}
								className="inline mr-1 w-[1em] pb-0.5 text-yellow-500 hover:animate-spin"
							/>
							<img
								loading="lazy"
								src={entity.account.avatar}
								alt=""
								className="h-[1em] w-[1em] inline rounded mb-0.5 mr-2"
							/>
							{withEmojis(entity.account.display_name, entity.account.emojis)}{" "}
							favourited your post
						</Link>
					)}
					{entity.type == "emoji_reaction" && (
						<Link
							href={`/users/@${entity.account.id}`}
							className="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
							<img
								loading="lazy"
								src={entity.account.avatar}
								alt=""
								className="h-[1em] w-[1em] align-middle inline rounded mb-0.5 mr-2"
							/>
							{withEmojis(entity.account.display_name, entity.account.emojis)}
							{" reacted with "}
							{entity.status?.emoji_reactions &&
								withEmojiReactions(
									entity.emoji ?? "",
									entity.status?.emoji_reactions,
								)}
						</Link>
					)}
					{entity.type == "reblog" && (
						<Link
							href={`/users/@${entity.account.id}`}
							className="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
							<svg
								aria-hidden={true}
								xmlns="http://www.w3.org/2000/svg"
								className="text-blue-500 hover:animate-spin w-[1em] inline pb-0.5 mr-1"
								viewBox="0 0 576 512">
								<path
									fill="currentColor"
									d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 192 32.1 192h32v128c0 53 43 96 96 96H272zm32-320c-17.7 0-32 14.3-32 32s14.3 32 32 32h112c17.7 0 32 14.3 32 32v128h-32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S556.9 320 543.9 320h-32V192c0-53-43-96-96-96H304z"></path>
							</svg>
							<img
								loading="lazy"
								src={entity.account.avatar}
								alt=""
								className="h-[1em] w-[1em] inline rounded mb-0.5 mr-2"
							/>
							{withEmojis(entity.account.display_name, entity.account.emojis)} boosted
							your post
						</Link>
					)}
					{entity.status && (
						<Status
							showInteraction={entity.type == "mention"}
							status={entity.status}
							type={StatusType.Notification}
						/>
					)}
				</li>
			)}
			{entity.type === "follow" && (
				<li className={"flex flex-col gap-y-2 p-2 max-w-full rounded bg-green-500/10"}>
					<Link
						href={`/users/@${entity.account.id}`}
						className="overflow-hidden gap-x-2 max-w-full text-base text-gray-800 dark:text-gray-100 hover:underline">
						<img
							loading="lazy"
							src={entity.account.avatar}
							alt=""
							className="h-[1em] w-[1em] inline mb-0.5 mr-2"
						/>
						{withEmojis(entity.account.display_name, entity.account.emojis)} followed
						you
					</Link>
				</li>
			)}
		</>
	);
});