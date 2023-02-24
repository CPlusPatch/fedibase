import { Transition } from "@headlessui/react";
import { IconMessage } from "@tabler/icons-preact";
import { AuthContext } from "components/context/AuthContext";
import { classNames, withEmojis } from "utils/functions";
import Status, { StatusType } from "./Status";
import { useIsVisible } from "react-is-visible";
import { Entity } from "megalodon";
import { useState, useContext, useRef, useEffect } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { StateContext } from "components/context/StateContext";

export default function ReplyTo({ status, statusType = StatusType.Post }: { status: Entity.Status; statusType: StatusType }) {
	const [replyStatus, setReplyStatus] = useState<Entity.Status>();
	const client = useContext(AuthContext);
	const [open, setOpen] = useState<boolean>(false);

	const nodeRef = useRef();
	const visible = useIsVisible(nodeRef);
	const [state, setState] = useContext(StateContext);

	useEffect(() => {
		// If the post is a reply, get the previous post's contents
		if (status.in_reply_to_id && !replyStatus && visible)
			client?.getStatus(status.in_reply_to_id).then(data => {
				setReplyStatus(data.data);
			});
	}, [client, replyStatus, status.in_reply_to_id, visible]);

	return (
		<div className="inline relative bg-slate-300/0" ref={nodeRef}>
			<span
				/* onMouseEnter={e => {
					setOpen(true);
				}}
				onMouseLeave={e => {
					setOpen(false);
				}} */
				onClick={() => {
					setState(s => ({
						...s,
						viewingConversation: status.id
					}));
				}}
				className="text-xs text-gray-600 hover:underline dark:text-gray-300">
				<IconMessage className="inline mr-1 w-4 h-4" aria-hidden={true} />
				Replying to{" "}
				{replyStatus &&
					withEmojis(replyStatus.account.display_name, replyStatus.account.emojis)}
				{/* <Transition
					as={Fragment}
					show={open}
					enter="transition ease-out duration-200"
					enterFrom="opacity-0 translate-y-1"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in duration-150"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-1">
					<div
						className={classNames(
							`absolute left-0 px-4 py-3 bg-gray-50 bg-dark w-full rounded dark:border-gray-700 border transform z-[9999]`,
							statusType === StatusType.Post
								? "translate-x-[-5.55rem]"
								: "translate-x-[-4rem]",
						)}>
						{replyStatus && <Status status={replyStatus} type={statusType} />}
					</div>
				</Transition> */}
			</span>
		</div>
	);
}