import { Entity } from "megalodon";
import { useRef, useState } from "preact/hooks";
import { classNames, fromNow, withEmojis } from "utils/functions";
import InteractionBar from "./InteractionBar";
import PostAttachments from "./PostAttachments";
import ReplyTo from "./ReplyTo";
import SensitiveTextSpoiler from "./SensitiveTextSpoiler";
import useLineClamp from "use-line-clamp";
import { StatusPoll } from "./StatusPoll";
import { Reactions } from "./Reaction";
import { Link } from "components/transitions/Link";
import { memo } from "preact/compat";

export enum StatusType {
	Notification = "notification",
	Post = "post",
}

interface StatusProps {
	status: Entity.Status;
	type: StatusType;
	showInteraction?: boolean;
}

const Status = memo(({
	status: statusProp,
	type,
	showInteraction = true,
}: StatusProps) => {
	const [expand, setExpand] = useState(false);
	const [status, setStatus] = useState(statusProp);
	const [showText, setShowText] = useState(false);
	const textElementRef = useRef<HTMLParagraphElement>(null);
	const clamps = useLineClamp(textElementRef, {
		lines: 6,
	});

	const toggleExpand = () => {
		setExpand(prev => !prev);
	};

	return (
		<div className="flex flex-col max-w-full font-inter cursor-pointer">
			<div className="flex flex-col min-w-0 grow gap-y-1">
				<div className="flex flex-row overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap w-full">
					<Link
						href={`/users/${status.account.id}`}
						className="flex-shrink-0 mr-2">
						<img
							loading="lazy"
							alt={`${status.account.acct}'s avatar`}
							src={status.account.avatar}
							className={`${
								type == StatusType.Post
									? "w-12 h-12"
									: "w-10 h-10"
							} bg-white overflow-hidden dark:dark:bg-dark-800-800 rounded border border-gray-300 dark:border-gray-700 `}
						/>
					</Link>
					<div
						className={classNames(
							"flex flex-col grow",
							type === StatusType.Notification && "text-sm"
						)}>
						<h4
							className="font-bold dark:text-gray-200"
							title={status.account.display_name}>
							{withEmojis(
								status.account.display_name,
								status.account.emojis
							)}
						</h4>
						<h5
							title={status.account.acct}
							className="overflow-hidden ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400">
							@{status.account.acct}
						</h5>
					</div>
					<Link
						href={`/posts/${status.id}`}
						sidebar={status.id}
						className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
						{fromNow(new Date(status.created_at))}
					</Link>
				</div>
				<div className="flex flex-col gap-y-1">
					{status.in_reply_to_id && <ReplyTo status={status} />}

					{status.sensitive && (
						<SensitiveTextSpoiler
							status={status}
							showText={showText}
							setShowText={setShowText}
						/>
					)}

					{/* Actual text */}

					<p
						ref={textElementRef}
						className={`mt-1 status-text rounded text-sm duration-200 status-text dark:text-gray-50 break-words w-full ${
							status.sensitive && !showText && "filter blur-lg"
						} ${clamps && !expand && "line-clamp-6"}`}>
						{withEmojis(status.content, status.emojis)}
					</p>

					{/* Show More / Show Less button */}
					{clamps && (
						<>
							<button
								className="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline"
								onClick={toggleExpand}>
								{expand === true ? "Less" : "More"}
							</button>
						</>
					)}

					{status.emoji_reactions && (
						<Reactions status={status} setStatus={setStatus} />
					)}

					{status.poll && (
						<StatusPoll status={status} setStatus={setStatus} />
					)}
				</div>
				{status.media_attachments.length > 0 && (
					<div className={"mt-2"}>
						<PostAttachments status={status} />
					</div>
				)}
			</div>

			{showInteraction && (
				<InteractionBar status={status} setStatus={setStatus} />
			)}
		</div>
	);
});

export default Status;
