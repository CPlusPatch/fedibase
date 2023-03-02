import { IconMessage } from "@tabler/icons-preact";
import { AuthContext } from "components/context/AuthContext";
import { withEmojis } from "utils/functions";
import { useIsVisible } from "react-is-visible";
import { Entity } from "megalodon";
import { useState, useContext, useRef, useEffect } from "preact/hooks";
import { Link } from "components/transitions/Link";

export default function ReplyTo({ status }: { status: Entity.Status }) {
	const [replyStatus, setReplyStatus] = useState<Entity.Status>();
	const client = useContext(AuthContext);

	const nodeRef = useRef<HTMLDivElement>();
	const visible = useIsVisible(nodeRef);

	useEffect(() => {
		let isMounted = true;
		// If the post is a reply, get the previous post's contents
		if (status.in_reply_to_id && !replyStatus && visible)
			client?.getStatus(status.in_reply_to_id).then(data => {
				if (isMounted) {
					setReplyStatus(data.data);
				}
			});
		
		return () => {
			isMounted = false;
		};
	}, [client, replyStatus, status.in_reply_to_id, visible]);

	return (
		<div className="inline relative bg-slate-300/0" ref={nodeRef as any}>
			<Link
				href={`/posts/${status.id}`}
				sidebar={status.id}
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
							`absolute left-0 px-4 py-3 bg-gray-50 dark:bg-dark-800 w-full rounded dark:border-gray-700 border transform z-[9999]`,
							statusType === StatusType.Post
								? "translate-x-[-5.55rem]"
								: "translate-x-[-4rem]",
						)}>
						{replyStatus && <Status status={replyStatus} type={statusType} />}
					</div>
				</Transition> */}
			</Link>
		</div>
	);
}