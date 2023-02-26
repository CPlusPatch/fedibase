import {
	IconDots,
	IconLock,
	IconMessage,
	IconMoodHappy,
	IconQuote,
	IconRocket,
	IconStar,
	IconStarFilled,
} from "@tabler/icons-preact";
import { AuthContext } from "components/context/AuthContext";
import { Entity } from "megalodon";
import { useContext, useState } from "preact/hooks";
import { useDispatch } from "react-redux";
import { setMobileEditorState, setQuotingTo, setReplyingTo } from "utils/stateSlice";

/**
 * Small bar containing all the buttons on a post, such as "favourite", "quote", "reply"...
 * @returns
 */
export default function InteractionBar({ status }: { status: Entity.Status }) {
	const client = useContext(AuthContext);
	const [favourited, setFavourited] = useState<boolean>(status.favourited);
	const [boosted, setBoosted] = useState<boolean>(status.reblogged);

	const dispatch = useDispatch();

	return (
		<div className="flex justify-between px-5 mt-3 w-full text-gray-700 dark:text-gray-400">
			<InteractionBarIcon
				title="Reply to this post"
				onClick={() => {
					dispatch(setReplyingTo(status));
					dispatch(setMobileEditorState(true));
				}}>
				<IconMessage aria-hidden={true} className="w-5 h-5" />
				<span className="sr-only">Reply to this post</span>
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Favourite this post"
				onClick={() => {
					if (favourited) {
						client.unfavouriteStatus(status.id);
					} else if (!favourited) {
						client.favouriteStatus(status.id);
					}

					setFavourited(f => !f);
				}}>
				{favourited ? (
					<>
						<span className="sr-only">You favourited this post!</span>
						<IconStarFilled
							aria-hidden={true}
							className="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]"
						/>
					</>
				) : (
					<>
						<span className="sr-only">Favourite this post</span>
						<IconStar aria-hidden={true} className="w-5 h-5" />
					</>
				)}
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Boost this post"
				onClick={() => {
					if (boosted) {
						client.unreblogStatus(status.id);
					} else if (!boosted) {
						client.reblogStatus(status.id);
					}

					setBoosted(b => !b);
				}}>
				{status.visibility !== "private" && status.visibility !== "direct" ? (
					<>
						{boosted ? (
							<>
								<span className="sr-only">You boosted this post!</span>
								<IconRocket
									aria-hidden={true}
									className="w-5 h-5 text-green-400 animate-[spin_1s_ease-in-out]"
								/>
							</>
						) : (
							<>
								<span className="sr-only">Boost this post</span>
								<IconRocket aria-hidden={true} className="w-5 h-5" />
							</>
						)}
					</>
				) : (
					<>
						<span className="sr-only">This post is locked and cannot be boosted</span>
						<IconLock aria-hidden={true} className="w-5 h-5 text-gray-300" />
					</>
				)}
			</InteractionBarIcon>

			<InteractionBarIcon title="Add reaction (not implemented)">
				<IconMoodHappy className="w-5 h-5" aria-hidden={true} />
				<span className="sr-only">Add reaction (not implemented)</span>
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Quote this post"
				onClick={() => {
					dispatch(setQuotingTo(status));
					dispatch(setMobileEditorState(true));
				}}>
				<IconQuote className="w-5 h-5" aria-hidden={true} />
				<span className="sr-only">Quote this post</span>
			</InteractionBarIcon>

			<InteractionBarIcon title="Open options menu (not implemented)">
				<IconDots className="w-5 h-5" />
				<span className="sr-only">Open options menu (not implemented)</span>
			</InteractionBarIcon>
		</div>
	);
}

function InteractionBarIcon({ children, onClick = () => {}, title = "" }) {
	return (
		<button title={title} className="flex justify-center" onClick={onClick}>
			{children}
		</button>
	);
}
