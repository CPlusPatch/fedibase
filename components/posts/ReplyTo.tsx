import { Transition } from "@headlessui/react";
import { IconMessage } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import { useState, useContext, useEffect, Fragment } from "react";
import { withEmojis } from "utils/functions";
import Status, { StatusType } from "./Status";

export default function ReplyTo({ status }: { status: Entity.Status }) {
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
			<span className="text-xs text-gray-600 hover:underline dark:text-gray-300">
				<IconMessage className="inline mr-1 w-4 h-4" aria-hidden={true} />
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
				<div className="absolute left-0 z-10 px-4 py-3 max-w-sm bg-gray-50 bg-dark rounded dark:border-gray-700 border transform translate-x-[-5.55rem] lg:max-w-3xl">
					{replyStatus && <Status status={replyStatus} type={StatusType.Post} />}
				</div>
			</Transition>
		</div>
	);
}