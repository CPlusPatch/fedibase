/* eslint-disable @next/next/no-img-element */
import { Popover, Transition } from "@headlessui/react";
import { IconMessage } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import { Entity } from "megalodon";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { fromNow, withEmojis } from "utils/functions";
import InteractionBar from "./InteractionBar";
import PostImages from "./PostImages";

export default function Status({
	status,
	type,
	showInteraction = true,
}: {
	status: Entity.Status;
	type: "notification" | "post"; // Notification renders slightly different than a normal post
	showInteraction?: boolean;
}) {
	const [expand, setExpand] = useState<boolean>(false);
	const [showText, setShowText] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);
	const [state, setState]: any = useContext(StateContext);

	return (
		<div className="flex flex-col max-w-full">
			<div className="flex flex-row max-w-full">
				<Link href={`/users/@${status.account.id}`} className="flex-shrink-0 mr-4">
					<img
						loading="lazy"
						alt={status.account.acct}
						src={status.account.avatar}
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} text-gray-300 bg-white rounded border border-gray-300`}
					/>
				</Link>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col whitespace-nowrap md:inline text-ellipsis">
							<h4 className="inline font-bold" title={status.account.display_name}>
								{withEmojis(status.account.display_name, status.account.emojis)}
							</h4>
							<h6
								title={status.account.acct}
								className="inline overflow-hidden ml-0 text-gray-500 overflow-ellipsis md:ml-2">
								@{status.account.acct}
							</h6>
						</span>
						<div className="whitespace-nowrap">
							<a
								href={`/posts/${status.id}`}
								onClick={e => {
									if (!e.ctrlKey && !e.metaKey) {
										e.preventDefault();
										setState(s => ({
											...s,
											params: {
												...s.params,
												id: status.id,
											},
										}));
										history.pushState(null, null, `/posts/${status.id}`);
									}
								}}
								className="text-sm text-gray-700 hover:underline">
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
								ref={textRef}
								className={`mt-1 rounded duration-200 status-text ${
									status.sensitive && !showText && "filter blur-lg"
								}`}>
								{withEmojis(status.content, status.emojis)}
							</p>
						</div>

						{textRef?.current?.offsetHeight > 128 && (
							<>
								<hr />
								<button
									className="mx-auto w-full text-sm text-blue-800 hover:underline"
									onClick={() => {
										setExpand(!expand);
									}}>
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

export function ReplyTo({ status }: { status: Entity.Status }) {
	const [replyStatus, setReplyStatus] = useState<Entity.Status>();
	const client = useContext(AuthContext);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		// If the post is a reply, get the previous post's contents
		if (status.in_reply_to_id && !replyStatus)
			client?.getStatus(status.in_reply_to_id).then(data => {
				setReplyStatus(data.data);
			});
	}, [client, replyStatus, status.in_reply_to_id]);

	return (
		<div
			className="inline relative bg-slate-300/0"
			onMouseEnter={e => {
				setOpen(true);
			}}
			onMouseLeave={e => {
				setOpen(false);
			}}>
			<span className="text-xs text-gray-600 hover:underline">
				<IconMessage className="inline mr-1 w-4 h-4" />
				Replying to{" "}
				{replyStatus &&
					withEmojis(replyStatus.account.display_name, replyStatus.account.emojis)}
			</span>
			<Transition
				as={Fragment}
				show={open}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1">
				<div className="absolute left-0 z-10 px-4 py-3 max-w-sm bg-gray-50 rounded border transform translate-x-[-5.55rem] lg:max-w-3xl">
					{replyStatus && <Status status={replyStatus} type="post" />}
				</div>
			</Transition>
		</div>
	);
}

export function DummyStatus({ type = "post" }: { type: "post" | "notification" }) {
	return (
		<div className="flex flex-col max-w-full">
			<div className="flex flex-row max-w-full">
				<div className="flex-shrink-0 mr-4">
					<img
						alt=""
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} text-gray-300 bg-white rounded border border-gray-300`}
					/>
				</div>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col whitespace-nowrap md:inline text-ellipsis">
							<h4 className="inline font-bold"></h4>
							<h6 className="inline overflow-hidden ml-0 text-gray-500 overflow-ellipsis md:ml-2">
								@namw
							</h6>
						</span>
						<div className="whitespace-nowrap">
							<div className="text-sm text-gray-700 hover:underline"></div>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						{Math.random() > 0.7 && (
							<span className="text-xs text-gray-600 hover:underline">
								<IconMessage className="inline mr-1 w-4 h-4" />
								Replying to gay
							</span>
						)}
						<div className="relative w-full text-sm">
							<p className={`mt-1 rounded duration-200 status-text`}></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SensitiveTextSpoiler({
	status,
	showText,
	setShowText,
}: {
	status: Entity.Status;
	showText: boolean;
	setShowText: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<>
			{status.sensitive && (
				<div className="flex gap-x-2 items-center font-bold">
					{status.spoiler_text == "" ? "Marked as sensitive" : status.spoiler_text}

					<Button
						style="gray"
						className="!py-1 !px-2"
						onClick={() => {
							setShowText(t => !t);
						}}>
						{showText ? "Hide" : "Show"}
					</Button>
				</div>
			)}
		</>
	);
}
