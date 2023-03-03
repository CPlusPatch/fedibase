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
import { Input } from "components/forms/Input";
import { ScaleFadeSlide } from "components/transitions/ScaleFadeSlide";
import { Entity } from "megalodon";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { toast } from "react-hot-toast";
import { useStore } from "utils/store";

/**
 * Small bar containing all the buttons on a post, such as "favourite", "quote", "reply"...
 * @returns
 */
export default function InteractionBar({ status, setStatus }: { status: Entity.Status; setStatus: StateUpdater<Entity.Status> }) {
	const client = useContext(AuthContext);
	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
	const [instanceEmojis, setInstanceEmojis] = useState<Entity.Emoji[]>([]);

	const [emojiFilter, setEmojiFilter] = useState<string>("");

	useEffect(() => {
		if (showEmojiPicker) {
			if (!localStorage.getItem("customEmojis")) {
				client?.getInstanceCustomEmojis().then(res => {
					localStorage.setItem("customEmojis", JSON.stringify(res.data));
					setInstanceEmojis(res.data);
				});
			} else {
				setInstanceEmojis(JSON.parse(localStorage.getItem("customEmojis") as any));
			}
		}
	}, [showEmojiPicker]);

	const [, setState] = useStore();

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
					if (status.favourited) {
						client?.unfavouriteStatus(status.id).then(res => {
							setStatus(res.data);
						});
					} else if (!status.favourited) {
						client?.favouriteStatus(status.id).then(res => {
							setStatus(res.data);
						});
					}
				}}>
				{status.favourited ? (
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
					if (status.reblogged) {
						client?.unreblogStatus(status.id).then(res => {
							setStatus(res.data);
						});
					} else if (!status.reblogged) {
						client?.reblogStatus(status.id).then(res => {
							setStatus(res.data);
						});
					}
				}}>
				{status.visibility !== "private" && status.visibility !== "direct" ? (
					<>
						{status.reblogged ? (
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
				onClick={() => {
					setShowEmojiPicker(s => !s);
				}}>
				<IconMoodHappy className="w-5 h-5" aria-hidden={true} />
				<span className="sr-only">Add reaction</span>

				<div
					className="absolute left-0 -translate-x-[55%] top-7 z-[99]"
					onClick={e => {
						e.stopPropagation();
					}}>
					<ScaleFadeSlide show={showEmojiPicker}>
						<div className="w-72 h-80 dark:bg-dark-800 border dark:border-gray-700 bg-white p-3 no-scroll rounded-lg overflow-hidden gap-y-4 flex-col flex">
							<Input
								isLoading={false}
								name="emoji"
								className="w-full rounded px-2 py-1 dark:border-gray-700"
								placeholder="Emoji (alpha)"
								onChange={(e: any) => {
									setEmojiFilter(e.target.value);
								}}>
								<span className="sr-only">Type to filter emojis</span>
							</Input>
							<div className="gap-3 rounded-lg grid grid-cols-5 justify-between overflow-y-scroll no-scroll max-h-[85%]">
								{instanceEmojis
									.filter(f => f.shortcode.includes(emojiFilter))
									.map(emoji => {
										return (
											<button
												className="items-center flex justify-center"
												title={emoji.shortcode}
												onClick={() => {
													client
														?.createEmojiReaction(
															status.id,
															emoji.shortcode,
														)
														.then(res => {
															toast.success("Added reaction!");
															setStatus(res.data);
															setShowEmojiPicker(false);
														})
														.catch(err => {
															console.error(err);
															toast.error("Couldn't add reaction :(");
														});
												}}>
												<img
													src={emoji.url}
													loading="lazy"
													className="w-7 h-7"
												/>
											</button>
										);
									})}
							</div>
						</div>
					</ScaleFadeSlide>
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
	onClick = () => {
		//
	},
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
