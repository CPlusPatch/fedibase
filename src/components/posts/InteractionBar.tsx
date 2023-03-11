import { Dialog, Transition } from "@headlessui/react";
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
import { Entity } from "megalodon";
import { memo } from "preact/compat";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { JSXInternal } from "preact/src/jsx";
import { toast } from "react-hot-toast";
import { classNames } from "utils/functions";
import { useBackupStore } from "utils/useBackupStore";

/**
 * Small bar containing all the buttons on a post, such as "favourite", "quote", "reply"...
 * @returns
 */
function InteractionBar({
	status,
	setStatus,
}: {
	status: Entity.Status;
	setStatus: StateUpdater<Entity.Status>;
}) {
	const client = useContext(AuthContext);
	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
	const [instanceEmojis, setInstanceEmojis] = useState<Entity.Emoji[]>([]);

	const [emojiFilter, setEmojiFilter] = useState<string>("");

	useEffect(() => {
		if (showEmojiPicker) {
			if (!localStorage.getItem("customEmojis")) {
				client?.getInstanceCustomEmojis().then(res => {
					localStorage.setItem(
						"customEmojis",
						JSON.stringify(res.data)
					);
					setInstanceEmojis(res.data);
				});
			} else {
				setInstanceEmojis(
					JSON.parse(localStorage.getItem("customEmojis") as any)
				);
			}
		}
	}, [showEmojiPicker]);

	const { store, setStore } = useBackupStore();

	return (
		<div className="flex justify-between px-5 mt-3 w-full text-gray-700 dark:text-gray-400">
			<InteractionBarIcon
				title="Reply to this post"
				onClick={() => {
					setStore(prev => ({
						...prev,
						replyingTo: status,
						quotingTo: null,
						postComposerOpened:
							window.innerWidth < 1400 ||
							store.viewingConversation !== "",
					}));
				}}>
				<IconMessage aria-hidden={true} className="w-5 h-5" />
				<span className="sr-only">Reply to this post</span>
			</InteractionBarIcon>

			<InteractionBarIcon
				title={
					status.favourited
						? "You favourited this post!"
						: "Favourite this post"
				}
				onClick={() => {
					if (status.favourited) {
						setStatus(prev => ({
							...prev,
							favourited: false,
						}));
						client?.unfavouriteStatus(status.id);
					} else if (!status.favourited) {
						setStatus(prev => ({
							...prev,
							favourited: true,
						}));
						client?.favouriteStatus(status.id);
					}
				}}>
				{status.favourited ? (
					<>
						<IconStarFilled
							aria-hidden={true}
							className="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]"
						/>
					</>
				) : (
					<>
						<IconStar aria-hidden={true} className="w-5 h-5" />
					</>
				)}
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Boost this post"
				onClick={() => {
					if (status.reblogged) {
						setStatus(prev => ({
							...prev,
							reblogged: false,
						}));
						client?.unreblogStatus(status.id);
					} else if (!status.reblogged) {
						setStatus(prev => ({
							...prev,
							reblogged: true,
						}));
						client?.reblogStatus(status.id);
					}
				}}>
				{status.visibility !== "private" &&
				status.visibility !== "direct" ? (
					<>
						{status.reblogged ? (
							<>
								<span className="sr-only">
									You boosted this post!
								</span>
								<IconRocket
									aria-hidden={true}
									className="w-5 h-5 text-green-400 animate-[spin_1s_ease-in-out]"
								/>
							</>
						) : (
							<>
								<span className="sr-only">Boost this post</span>
								<IconRocket
									aria-hidden={true}
									className="w-5 h-5"
								/>
							</>
						)}
					</>
				) : (
					<>
						<span className="sr-only">
							This post is locked and cannot be boosted
						</span>
						<IconLock
							aria-hidden={true}
							className="w-5 h-5 text-gray-300"
						/>
					</>
				)}
			</InteractionBarIcon>

			<InteractionBarIcon
				shake={false}
				title="Add reaction"
				onClick={() => {
					if (store.auth.type === "mastodon") return toast.error("Mastodon does not support reactions!");
					setShowEmojiPicker(true);
				}}>
				<>
					<IconMoodHappy className="w-5 h-5" aria-hidden={true} />
					<span className="sr-only">Add reaction</span>

					<Transition appear show={showEmojiPicker} as={Fragment}>
						<Dialog
							onClose={() => {
								setShowEmojiPicker(false);
							}}
							onClick={(e: any) => {
								e.stopPropagation();
							}}
							className="z-50 fixed bottom-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-100"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95">
								<Dialog.Panel>
									<div className="w-80 flex flex-col bottom-0 left-0 m-4 p-3 absolute z-50 bg-orange-100/50 backdrop-blur-md dark:bg-dark-800/75 border dark:border-gray-700 shadow rounded-xl h-72">
										<Input autoFocus={true} onChange={e => {
											setEmojiFilter((e.target as HTMLInputElement).value);
										}} className="dark:border-gray-700" placeholder="Search for emoji here" isLoading={false} name="emoji">{""}</Input>
										<div className="grid grid-cols-6 justify-around no-scroll p-3 gap-4 overflow-scroll">
											{store.emojis.filter(e => e.shortcode.includes(emojiFilter)).map(emoji => (
												<button title={emoji.shortcode} className="flex items-center justify-center w-full" onClick={() => {
													client?.createEmojiReaction(status.id, emoji.shortcode).then(res => {
														setStatus(res.data);
														toast.success("Added reaction!");
														setShowEmojiPicker(false);
													}).catch(err => {
														console.log(err);
														toast.error("Error adding reaction");
													});
												}}>
													<img src={emoji.url} className="w-7 h-7 rounded" />
												</button>
											))}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</Dialog>
					</Transition>
				</>
			</InteractionBarIcon>

			<InteractionBarIcon
				title="Quote this post"
				onClick={() => {
					if (store.auth.type === "mastodon")
						return toast.error(
							"Mastodon does not support quote posts!"
						);
					setStore(prev => ({
						...prev,
						quotingTo: status,
						replyingTo: null,
						postComposerOpened:
							window.innerWidth < 1400 ||
							store.viewingConversation !== "",
					}));
				}}>
				<IconQuote className="w-5 h-5" aria-hidden={true} />
				<span className="sr-only">Quote this post</span>
			</InteractionBarIcon>

			<InteractionBarIcon title="Open options menu (not implemented)">
				<IconDots className="w-5 h-5" />
				<span className="sr-only">
					Open options menu (not implemented)
				</span>
			</InteractionBarIcon>
		</div>
	);
}

export default memo(InteractionBar);

const InteractionBarIcon = memo(
	({
		children,
		onClick = () => {
			//
		},
		title = "",
		shake = true,
	}: {
		children: any;
		onClick?: (
			e: JSXInternal.TargetedMouseEvent<HTMLButtonElement>
		) => void;
		title: string;
		shake?: boolean;
	}) => {
		return (
			<button
				title={title}
				className={classNames(
					"flex justify-center !static",
					shake && "hover:animate-hithere"
				)}
				onClick={onClick}>
				{children}
			</button>
		);
	}
);
