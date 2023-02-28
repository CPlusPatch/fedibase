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
import { JSXInternal } from "preact/src/jsx";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "utils/store";

/**
 * Small bar containing all the buttons on a post, such as "favourite", "quote", "reply"...
 * @returns
 */
export default function InteractionBar({ status }: { status: Entity.Status }) {
	const client = useContext(AuthContext);
	const [favourited, setFavourited] = useState<boolean>(status.favourited ?? false);
	const [boosted, setBoosted] = useState<boolean>(status.reblogged ?? false);

	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
	const [instanceEmojis, setInstanceEmojis] = useState<Entity.Emoji[]>([]);

	const [emojiFilter, setEmojiFilter] = useState<string>("");

	useEffect(() => {
		if (showEmojiPicker) {
			if (!localStorage.getItem("customEmojis")) {
				client?.getInstanceCustomEmojis().then(res => {
					localStorage.setItem("customEmojis", JSON.stringify(res.data));
					setInstanceEmojis(res.data);

				})
			} else {
				setInstanceEmojis(JSON.parse(localStorage.getItem("customEmojis") as any))
			}
		}
	}, [showEmojiPicker])

	const [state, setState] = useStore();

	return (
		<div className="flex justify-between px-5 mt-3 w-full text-gray-700 dark:text-gray-400">
			<InteractionBarIcon
				title="Reply to this post"
				onClick={() => {
					setState(prev => ({
						...prev,
						replyingTo: status,
						postComposerOpened: true,
					}));
				}}>
				<IconMessage aria-hidden={true} className="w-5 h-5" />
				<span className="sr-only">Reply to this post</span>
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Favourite this post"
				onClick={() => {
					if (favourited) {
						client?.unfavouriteStatus(status.id);
					} else if (!favourited) {
						client?.favouriteStatus(status.id);
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
						client?.unreblogStatus(status.id);
					} else if (!boosted) {
						client?.reblogStatus(status.id);
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

			<InteractionBarIcon
				title="Add reaction"
				onClick={(e) => {
					setShowEmojiPicker(s => !s);
				}}>
				<IconMoodHappy className="w-5 h-5" aria-hidden={true} />
				<span className="sr-only">Add reaction</span>

				<div className="absolute left-0 -translate-x-[55%] top-7 z-[99]" onClick={e => {
					e.stopPropagation();
				}}>
					{showEmojiPicker && (
						<div className="w-96 h-96 bg-dark border dark:border-gray-700 bg-white p-3 no-scroll rounded-lg overflow-hidden gap-y-2 flex-col flex">
							<input className="w-full rounded px-2 py-1 border" placeholder="Emoji (alpha)" onChange={(e: any) => {
								setEmojiFilter(e.target.value);
							}}/>
							<div className="gap-3 rounded-lg grid grid-cols-5 justify-between overflow-y-scroll no-scroll max-h-[85%]">
								{instanceEmojis.filter(f => f.shortcode.includes(emojiFilter)).map(emoji => {
									return (
										<button className="items-center flex justify-center" title={emoji.shortcode} onClick={(e) => {
											client?.createEmojiReaction(status.id, emoji.shortcode).then(res => {
												toast.success("Added reaction!");
												setShowEmojiPicker(false);
											}).catch(err => {
												console.error(err);
												toast.error("Couldn't add reaction :(")
											})
										}}>
											<img src={emoji.url} loading="lazy" className="w-7 h-7" />
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Quote this post"
				onClick={() => {
					setState(prev => ({
						...prev,
						quotingTo: status,
						postComposerOpened: true,
					}));
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

function InteractionBarIcon({
	children,
	onClick = e => {},
	title = "",
}: {
	children: any;
	onClick?: (e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>) => void;
	title: string;
}) {
	return (
		<button title={title} className="flex justify-center relative" onClick={onClick}>
			{children}
		</button>
	);
}
