import { Entity } from "megalodon";
import { useContext, useRef, useState } from "preact/hooks";
import { classNames, fromNow, smoothNavigate, withEmojis } from "utils/functions";
import InteractionBar from "./InteractionBar";
import PostAttachments from "./PostAttachments";
import ReplyTo from "./ReplyTo";
import SensitiveTextSpoiler from "./SensitiveTextSpoiler";
import useLineClamp from "use-line-clamp";
import { JSXInternal } from "preact/src/jsx";
import { StatusPoll } from "./StatusPoll";
import { useStore } from "utils/store";
import { AuthContext } from "components/context/AuthContext";
import { toast } from "react-hot-toast";

export enum StatusType {
	Notification = "notification",
	Post = "post",
}

interface StatusProps {
	status: Entity.Status;
	type: StatusType;
	showInteraction?: boolean;
}

export default function Status({ status: statusProp, type, showInteraction = true }: StatusProps) {
	const [expand, setExpand] = useState(false);
	const [status, setStatus] = useState(statusProp);
	const [showText, setShowText] = useState(false);
	const textElementRef = useRef<HTMLParagraphElement>(null);
	const client = useContext(AuthContext);
	const clamps = useLineClamp(textElementRef, {
		lines: 6,
	});

	const ownId = localStorage.getItem("accountId");

	const [state, setState] = useStore();

	const handleUserClick = (e: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			smoothNavigate(`/users/${status.account.id}`, setState);
		}
	};

	const handlePostClick = (e: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			smoothNavigate(`/posts/${status.id}`, setState);
		}
	};

	const toggleExpand = () => {
		setExpand(prev => !prev);
	};

	return (
		<div className="flex flex-col max-w-full font-inter">
			<div className="flex flex-row max-w-full">
				<div className="flex flex-col min-w-0 grow gap-y-1">
					<div className="gap-x-2 text-[0.95rem] flex flex-row justify-between">
						<div className="flex flex-row overflow-hidden text-ellipsis">
							<a
								href={`/users/${status.account.id}`}
								onClick={handleUserClick}
								className="flex-shrink-0 mr-2">
								<img
									loading="lazy"
									alt={`${status.account.acct}'s avatar`}
									src={status.account.avatar}
									className={`${
										type == StatusType.Post ? "w-12 h-12" : "w-10 h-10"
									} bg-white overflow-hidden bg-dark rounded border border-gray-300 dark:border-gray-700 `}
								/>
							</a>
							<span
								className={classNames(
									"flex flex-col whitespace-nowrap md:inline",
									type === StatusType.Notification && "text-sm",
								)}>
								<h4
									className="font-bold dark:text-gray-200"
									title={status.account.display_name}>
									{withEmojis(status.account.display_name, status.account.emojis)}
								</h4>
								<h5
									title={status.account.acct}
									className="overflow-hidden ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400">
									@{status.account.acct}
								</h5>
							</span>
						</div>
						<div className="whitespace-nowrap">
							<a
								href={`/posts/${status.id}`}
								onClick={handlePostClick}
								className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
								{fromNow(new Date(status.created_at))}
							</a>
						</div>
					</div>
					<div className={`${type === StatusType.Notification && "flex flex-row"}`}>
						<div className="flex flex-col gap-y-1">
							{status.in_reply_to_id && <ReplyTo status={status} statusType={type} />}

							{status.sensitive && (
								<SensitiveTextSpoiler
									status={status}
									showText={showText}
									setShowText={setShowText}
								/>
							)}

							{/* Actual text */}
							<div className="relative w-full text-sm">
								<p
									ref={textElementRef}
									className={`mt-1 rounded duration-200 status-text dark:text-gray-50 break-all ${
										status.sensitive && !showText && "filter blur-lg"
									} ${clamps && !expand && "line-clamp-6"}`}>
									{withEmojis(status.content, status.emojis)}
								</p>
							</div>

							{/* Show More / Show Less button */}
							{clamps && (textElementRef?.current?.textContent?.length ?? 0) > 0 && (
								<>
									<hr />
									<button
										className="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline"
										onClick={toggleExpand}>
										{expand === true ? "Less" : "More"}
									</button>
								</>
							)}

							{status.emoji_reactions && (
								<div className="w-full flex flex-row gap-3">
									{status.emoji_reactions.map(reaction => (
										<button
											onClick={e => {
												if (reaction.me)
													return toast.error("Already reacted to this!");

												client
													?.createEmojiReaction(status.id, reaction.name)
													.then(res => {
														toast.success("Added reaction!");
														reaction.me = true;
													})
													.catch(err => {
														console.error(err);
														toast.error(
															"Couldn't add that reaction :(",
														);
													});
											}}
											className={classNames(
												"text-2xl flex items-center dark:text-gray-200 gap-x-2 justify-center bg-blue-100 dark:bg-blue-800 px-3 py-1",
												reaction.me &&
													"bg-blue-300 dark:bg-blue-600 rounded",
												!reaction.me &&
													"no-bad-scale hover:scale-95 duration-200 rounded-2xl",
											)}>
											{(reaction as any).url ? (
												<img
													loading="lazy"
													src={(reaction as any).url}
													className="w-[1em] h-[1em]"
													alt={`Emoji reaction ${reaction.name}`}
												/>
											) : (
												<span>{reaction.name}</span>
											)}
											{reaction.count}
										</button>
									))}
								</div>
							)}

							{status.poll && <StatusPoll status={status} setStatus={setStatus} />}
						</div>
						{status.media_attachments.length > 0 && (
							<div
								className={`mt-2 ${
									type === StatusType.Notification &&
									"flex overflow-hidden justify-center w-28 ml-auto h-20 border dark:border-gray-700 rounded"
								}`}>
								<PostAttachments type={type} status={status} />
							</div>
						)}
					</div>
				</div>
			</div>

			{showInteraction && <InteractionBar status={status} />}
		</div>
	);
}
