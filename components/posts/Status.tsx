/* eslint-disable @next/next/no-img-element */
import { StateContext } from "components/context/StateContext";
import { Entity } from "megalodon";
import { useContext, useRef, useState } from "react";
import { fromNow, withEmojis } from "utils/functions";
import InteractionBar from "./InteractionBar";
import PostImages from "./PostImages";
import ReplyTo from "./ReplyTo";
import SensitiveTextSpoiler from "./SensitiveTextSpoiler";

export enum StatusType {
	Notification = "notification",
	Post = "post",
}

interface StatusProps {
	status: Entity.Status;
	type: StatusType;
	showInteraction?: boolean;
}

export default function Status({ status, type, showInteraction = true }: StatusProps) {
	const [expand, setExpand] = useState(false);
	const [showText, setShowText] = useState(false);
	const textElementRef = useRef<HTMLParagraphElement>(null);
	const [state, setState] = useContext(StateContext);

	const handleUserClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			setState(s => ({
				...s,
				path: `/users/${status.account.id}`,
				notificationsOpened: false,
			}));
			history.pushState(null, null, `/users/${status.account.id}`);
		}
	};

	const handlePostClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			setState(s => ({
				...s,
				path: `/posts/${status.id}`,
				notificationsOpened: false,
			}));
			history.pushState(null, null, `/posts/${status.id}`);
		}
	};

	const toggleExpand = () => {
		setExpand(prev => !prev);
	};

	const isTextExpanded = expand || textElementRef?.current?.offsetHeight <= 128;

	return (
		<div className="flex flex-col max-w-full">
			<div className="flex flex-row max-w-full">
				<a
					href={`/users/${status.account.id}`}
					onClick={handleUserClick}
					className="flex-shrink-0 mr-4">
					<img
						loading="lazy"
						alt={`${status.account.acct}'s avatar`}
						src={status.account.avatar}
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} bg-white bg-dark rounded border border-gray-300 dark:border-gray-700 `}
					/>
				</a>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col whitespace-nowrap md:inline text-ellipsis">
							<h4
								className="inline font-bold dark:text-gray-200"
								title={status.account.display_name}>
								{withEmojis(status.account.display_name, status.account.emojis)}
							</h4>
							<h6
								title={status.account.acct}
								className="inline overflow-hidden ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400 md:ml-2">
								@{status.account.acct}
							</h6>
						</span>
						<div className="whitespace-nowrap">
							<a
								href={`/posts/${status.id}`}
								onClick={handlePostClick}
								className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
								{fromNow(new Date(status.created_at))}
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						{status.in_reply_to_id && <ReplyTo status={status} />}
						<SensitiveTextSpoiler
							status={status}
							showText={showText}
							setShowText={setShowText}
						/>

						<div
							className="relative w-full text-sm"
							style={{
								overflow: expand ? "" : "hidden",
								maxHeight: expand ? "" : "8rem",
							}}>
							<p
								ref={textElementRef}
								className={`mt-1 rounded duration-200 status-text dark:text-gray-50 ${
									status.sensitive && !showText && "filter blur-lg"
								}`}>
								{withEmojis(status.content, status.emojis)}
							</p>
						</div>

						{textElementRef?.current?.offsetHeight > 128 && (
							<>
								<hr />
								<button
									className="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline"
									onClick={toggleExpand}>
									{expand === true ? "Less" : "More"}
								</button>
							</>
						)}
					</div>
					<PostImages status={status} />
				</div>
			</div>

			{showInteraction && <InteractionBar status={status} />}
		</div>
	);
}