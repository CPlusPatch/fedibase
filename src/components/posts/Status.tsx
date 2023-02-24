import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { Entity } from "megalodon";
import { useContext, useRef, useState } from "preact/hooks";
import { fromNow, smoothNavigate, withEmojis } from "utils/functions";
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

export default function Status({ status: statusProp, type, showInteraction = true }: StatusProps) {
	const [expand, setExpand] = useState(false);
	const [status, setStatus] = useState(statusProp);
	const [showText, setShowText] = useState(false);
	const textElementRef = useRef<HTMLParagraphElement>(null);
	const client = useContext(AuthContext);

	const handleUserClick = (e) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			smoothNavigate(`/users/${status.account.id}`);
		}
	};

	const handlePostClick = (e) => {
		if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			smoothNavigate(`/posts/${status.id}`);
		}
	};

	const toggleExpand = () => {
		setExpand(prev => !prev);
	};

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
							type == StatusType.Post ? "w-14 h-14" : "w-8 h-8"
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
					<div className={`${type === StatusType.Notification && "flex flex-row"}`}>
						<div className="flex flex-col gap-y-1">
							{status.in_reply_to_id && <ReplyTo status={status} statusType={type} />}
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

							{status.poll && (
								<form
									onSubmit={e => {
										e.preventDefault();
										let value = [];

										for (let i = 0; i < e.target["poll"].length; i++) {
											if (e.target["poll"][i].checked)
												value.push(e.target["poll"][i].value);
										}
										client
											?.votePoll(status.poll.id, value, status.id)
											.then(res => {
												setStatus(s => ({
													...s,
													poll: res.data,
												}));
											});
									}}
									action="#"
									className="list-inside flex-col gap-y-2 flex">
									<fieldset>
										{status.poll.options.map((option, index) => (
											<li
												key={index}
												className="flex flex-row gap-x-1 items-center relative dark:text-gray-100">
												<div
													style={{
														width: `${Math.round(
															(option.votes_count /
																status.poll.votes_count) *
																100,
														)}%`,
													}}
													className="absolute bg-orange-200 dark:bg-orange-800 rounded h-full z-0"></div>
												<span className="w-10 z-10">
													{Number.isNaN(
														Math.round(
															(option.votes_count /
																status.poll.votes_count) *
																100,
														),
													)
														? 0
														: Math.round(
																(option.votes_count /
																	status.poll.votes_count) *
																	100,
														  )}
													%
												</span>
												{!status.poll.voted && (
													<input
														type={status.poll.multiple ? "checkbox" : "radio"}
														name="poll"
														className="z-10 focus:outline-none focus:ring-0 rounded outline-none m-0 p-0"
														value={index}
													/>
												)}
												<span className="z-10">{option.title}</span>
											</li>
										))}
									</fieldset>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{!status.poll.voted && (
											<Button
												style="gray"
												type="submit"
												className="!px-2 !py-1 mr-2">
												Vote
											</Button>
										)}
										{status.poll.votes_count} people voted &middot;{" "}
										{status.poll.expired ? <>Poll ended</> : <>Poll ends</>}{" "}
										{fromNow(new Date(status.poll.expires_at))}
									</div>
								</form>
							)}
						</div>
						{status.media_attachments.length > 0 && (
							<div
								className={`mt-2 ${
									type === StatusType.Notification &&
									"flex overflow-hidden justify-center w-28 ml-auto h-20 border dark:border-gray-700 rounded"
								}`}>
								<PostImages type={type} status={status} />
							</div>
						)}
					</div>
				</div>
			</div>

			{showInteraction && <InteractionBar status={status} />}
		</div>
	);
}
