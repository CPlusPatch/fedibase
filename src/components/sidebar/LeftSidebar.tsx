import { Transition, Dialog, Switch } from "@headlessui/react";
import {
	IconAlignLeft,
	IconChartBar,
	IconClock,
	IconFile,
	IconLock,
	IconLockOpen,
	IconMail,
	IconMarkdown,
	IconPaperclip,
	IconWorld,
	IconX,
} from "@tabler/icons-preact";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { Conversation } from "components/feed/Conversation";
import { Input } from "components/forms/Input";
import Select from "components/forms/Select";
import Select2, { SelectItem } from "components/forms/Select2";
import SmallSelect from "components/forms/SmallSelect";
import SmallSelect2 from "components/forms/SmallSelect2";
import { StatusType } from "components/posts/Status";
import { stat } from "fs";
import { Entity } from "megalodon";
import { StateUpdater, useContext, useEffect, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { JSXInternal } from "preact/src/jsx";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { classNames, withEmojis } from "utils/functions";
import { setMobileEditorState, StateType } from "utils/stateSlice";

const modes = [
	{
		text: "Plaintext",
		value: "text",
		description: "Just plain text",
		icon: IconAlignLeft,
	},
	{
		text: "Markdown",
		value: "markdown",
		description: "Use Markdown syntax",
		icon: IconMarkdown,
	},
];

const visibilities = [
	{
		text: "Public",
		value: "public",
		description: "Post to public timelines",
		icon: IconWorld,
	},
	{
		text: "Unlisted",
		value: "unlisted",
		description: "Don't post to public timelines",
		icon: IconLockOpen,
	},
	{
		text: "Private",
		value: "private",
		description: "Followers-only",
		icon: IconLock,
	},
	{
		text: "Direct",
		value: "direct",
		description: "Send as Direct Message",
		icon: IconMail,
	},
];

export default function LeftSidebar() {
	const state = useSelector((state) => (state as any).state as StateType);
	const dispatch = useDispatch();

	return (
		<>
			<div>
				{state.viewingConversation && (
					<Conversation id={state.viewingConversation} mode={StatusType.Notification} />
				)}
			</div>
			<Transition.Root show={state.postComposerOpened} as={Fragment}>
				<Dialog
					as="div"
					className="block relative z-50"
					onClose={() =>
						dispatch(setMobileEditorState(false))
					}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 backdrop-blur-lg transition-all bg-orange-500/30" />
					</Transition.Child>

					<div className="overflow-y-auto fixed inset-0">
						<div className="flex justify-center items-start p-4 min-h-full text-center md:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
								enterTo="opacity-100 translate-y-0 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 scale-100"
								leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95">
								<Dialog.Panel className="relative my-8 w-full text-left transition-all transform sm:max-w-xl">
									<SendForm />
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}

const pollDurations = [
	{
		icon: IconClock,
		text: "5 minutes",
		value: "300",
	},
	{
		icon: IconClock,
		text: "30 minutes",
		value: "1800",
	},
	{
		icon: IconClock,
		text: "1 hour",
		value: "3600",
	},
	{
		icon: IconClock,
		text: "6 hours",
		value: "21600",
	},
	{
		icon: IconClock,
		text: "12 hours",
		value: "43200",
	},
	{
		icon: IconClock,
		text: "1 day",
		value: "86400",
	},
	{
		icon: IconClock,
		text: "3 days",
		value: "259200",
	},
	{
		icon: IconClock,
		text: "7 days",
		value: "604800",
	},
];

const renderFilePreview = file => {
	if (file.type.includes("image")) {
		return (
			<img
				alt=""
				src={window.URL.createObjectURL(file)}
				className="object-cover w-full h-full"
			/>
		);
	} else if (file.type.includes("video")) {
		return <video src={window.URL.createObjectURL(file)} controls className="w-full h-full" />;
	} else if (file.type.includes("audio")) {
		return <audio src={window.URL.createObjectURL(file)} controls className="w-full h-full" />;
	} else {
		return (
			<div className="w-20 h-full flex items-center justify-center">
				<IconFile className="w-6 h-6" />
			</div>
		);
	}
};

interface SendFormState {
	mode: SelectItem;
	visibility: SelectItem;
	files: File[];
	fileIds: string[];
	loading: boolean;
	characters: string;
	emojis: Entity.Emoji[];
	emojisSuggestions: Entity.Emoji[];
	poll: any;
}

function SendForm() {
	// Context stuff
	const client = useContext(AuthContext);

	const state = useSelector(state => (state as any).state as StateType);
	const dispatch = useDispatch();

	const [currentState, setCurrentState] = useState<SendFormState>({
		mode: modes[0],
		visibility: visibilities[0],
		files: [],
		fileIds: [],
		loading: false,
		characters: "",
		emojis: [],
		emojisSuggestions: [],
		poll: null
	});

	const max_chars = (JSON.parse(localStorage.getItem("instanceData") ?? "{}") as Entity.Instance)
		.max_toot_chars;

	// Element refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const { replyingTo, quotingTo } = state;
		let otherPost = replyingTo ?? quotingTo ?? null;

		if (otherPost) {
			const id = localStorage.getItem("accountId");
			const mentions = [
				...new Map(
					otherPost.mentions
						.concat([otherPost.account])
						.filter(m => m.id !== id)
						.map(v => [v.id, v]),
				).values(),
			]
				.map(m => "@" + m.acct)
				.join(" ");

			if (mentions) {
				setCurrentState(s => ({
					...s,
					characters: `${mentions} `,
				}));
			}

			setCurrentState(s => ({
				...s,
				visibility: visibilities.find(v => v.value === otherPost.visibility) ?? visibilities[0]
			}))

		}

		textareaRef.current?.focus();

		client?.getInstanceCustomEmojis().then(data => {
			setCurrentState(s => ({
				emojis: data.data,
				...s
			}));
		});
	}, [client, state.replyingTo, state.quotingTo]);

	const submitForm = async event => {
		event.preventDefault();
		setCurrentState(s => ({
			...s,
			loading: true
		}));

		const { comment } = event.target.elements;
		const text = comment.value;
		const inReplyToId = state.replyingTo?.id;
		const quoteId = state.quotingTo?.id;

		try {
			await client.postStatus(text, {
				in_reply_to_id: inReplyToId,
				visibility: currentState.visibility.value as any,
				media_ids: currentState.fileIds,
				quote_id: quoteId,
				poll:
					currentState.poll && currentState.poll.choices.length > 0
						? {
								options: currentState.poll.choices,
								expires_in: Number(currentState.poll.duration),
						  }
						: undefined,
			});
			toast("Post sent!", {
				icon: "👍",
			});
		} catch (err) {
			toast.error("There was an error sending your post. Maybe check the visibility?");
		} finally {
			setCurrentState(s => ({
				mode: modes[0],
				visibility: visibilities[0],
				files: [],
				fileIds: [],
				loading: false,
				characters: "",
				emojis: [],
				emojisSuggestions: [],
				poll: null,
			}));
			dispatch(setMobileEditorState(false));
		}
	};
	return (
		<div className="flex flex-col gap-y-4">
			<form
				action="#"
				className="relative text-sm font-inter"
				onSubmit={submitForm}
				onKeyUp={e => {
					if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
						e.currentTarget.requestSubmit();
					}
				}}>
				<div
					className={`px-3 py-2 w-full rounded-2xl border dark:text-gray-100 border-gray-300 dark:border-gray-700 shadow-sm ${
						currentState.loading ? "bg-gray-100 bg-dark" : "bg-white bg-dark"
					}`}>
					<div className="flex justify-between p-3 w-full">
						<h1 className="text-xl font-bold dark:text-gray-50">
							{state.replyingTo && (
								<>
									Replying to{" "}
									{withEmojis(
										state.replyingTo.account.display_name,
										state.replyingTo.account.emojis,
									)}
								</>
							)}
							{state.quotingTo && (
								<>
									Quoting{" "}
									{withEmojis(
										state.quotingTo.account.display_name,
										state.quotingTo.account.emojis,
									)}
								</>
							)}
							{!(state.replyingTo || state.quotingTo) && <>Compose</>}
						</h1>
						<button
							onClick={e => {
								e.preventDefault();
								dispatch(setMobileEditorState(false));
							}}>
							<IconX />
						</button>
					</div>

					<textarea
						ref={textareaRef}
						id="comment"
						rows={5}
						onPaste={async e => {
							if (e.clipboardData && e.clipboardData.files.length > 0) {
								e.preventDefault();
								const files = e.clipboardData?.files;

								try {
									setCurrentState(s => ({
										...s,
										files: [...s.files, ...files],
										loading: true,
									}));

									console.log(files);
									const ids = await Promise.all(
										[...files].map(async file => {
											return (await client.uploadMedia(file)).data.id;
										}),
									);
									toast.success("Files uploaded!");
									setCurrentState(s => ({
										...s,
										loading: false,
										fileIds: [...s.fileIds, ...ids],
									}));
								} catch (error) {
									console.error(error);
									toast.error("Couldn't upload files :(");
									// Handle error
								}
							}
						}}
						onChange={async event => {
							const { value }: any = event.target;
							setCurrentState(s => ({
								...s,
								characters: value,
							}));

							const split = value.split(":");
							if (split.length > 1 && /^\w+$/.test(split[split.length - 1])) {
								const matched = split[split.length - 1];

								const matchedEmojis = currentState.emojis.filter(e =>
									e.shortcode.includes(matched),
								);
								setCurrentState(s => ({
									...s,
									emojisSuggestions: matchedEmojis,
								}));
							} else {
								setCurrentState(s => ({
									...s,
									emojisSuggestions: [],
								}));
							}
						}}
						disabled={currentState.loading}
						className="block py-3 w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
						placeholder="What's happening?"
						defaultValue={currentState.characters}
					/>

					{currentState.poll && (
						<PollCreator currentState={currentState} setCurrentState={setCurrentState}/>
					)}

					<Files currentState={currentState} setCurrentState={setCurrentState}/>

					<Transition
						as={Fragment}
						enter="ease-out duration-200"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						show={currentState.emojisSuggestions.length > 0}>
						<div className="flex absolute z-[60] flex-col rounded border bg-dark bg-white dark:border-gray-700">
							{currentState.emojisSuggestions.slice(0, 5).map(emoji => (
								<EmojiItem
									key={emoji.shortcode}
									emoji={emoji}
									onClick={() => {
										if (!textareaRef.current) {
											return;
										}

										const val = textareaRef.current.value;
										textareaRef.current.value = val.replace(
											val.split(":")[val.split(":").length - 1],
											`${emoji.shortcode}: `,
										);
										setCurrentState(s => ({
											...s,
											emojis: [],
										}));
									}}
								/>
							))}
						</div>
					</Transition>

					<ButtonRow currentState={currentState} setCurrentState={setCurrentState} fileInputRef={fileInputRef} client={client} max_chars={max_chars} />
				</div>
			</form>
		</div>
	);
}

function PollCreator({ currentState, setCurrentState }) {
	return (
		<div className="flex w-full px-4 flex-col gap-y-2">
			<ol className="flex-col w-full gap-y-4 flex">
				{currentState.poll?.choices.map((choice, index) => (
					<li
						key={index}
						className="inline-flex w-full justify-between items-center gap-x-3">
						<div className="flex items-center gap-x-2 grow">
							{index + 1}.
							<div className="grow">
								<Input
									onChange={(e: any) => {
										setCurrentState(s => ({
											...s,
											poll: {
												...s.poll,
												choices: [
													...s.poll.choices.slice(0, index),
													e.target.value,
													...s.poll.choices.slice(index + 1),
												],
											},
										}));
									}}
									isLoading={false}
									className="!w-full"
									placeholder="Poll choice here"
									name={"test"}>
									{""}
								</Input>
							</div>
						</div>
						{index === currentState.poll.choices.length - 1 && (
							<button
								onClick={e => {
									e.preventDefault();
									let pollCopy = currentState.poll;
									pollCopy.choices.splice(index, 1);

									setCurrentState(s => ({
										...s,
										poll: pollCopy
									}));
								}}>
								<IconX className="w-5 h-5" />
							</button>
						)}
					</li>
				))}
				<Button
					onClick={e => {
						e.preventDefault();

						setCurrentState(s => ({
							...s,
							poll: {
								...s.poll,
								choices: [...s.poll.choices, ""],
							},
						}));
					}}
					style="orangeLight"
					type=""
					className="w-full">
					Add answer
				</Button>
			</ol>
			<div className="z-[99] flex items-center gap-x-3 flex-col md:flex-row gap-y-2">
				<div className="md:w-1/3 w-full">
					<Select2
						items={pollDurations}
						defaultValue={0}
						onChange={i => {
							setCurrentState(s => ({
								...s,
								poll: {
									...s.poll,
									duration: i.value
								}
							}))
						}}
					/>
				</div>
				<div className="md:w-2/3 w-full flex items-center justify-between">
					<p className="ml-2">Allow multiple answers</p>
					<Switch
						checked={currentState.poll.multiple}
						onChange={checked => {
							setCurrentState(s => ({
								...s,
								poll: {
									...s.poll,
									multiple: checked,
								},
							}));
						}}
						className={classNames(
							currentState.poll.multiple ? "bg-orange-600" : "bg-gray-200",
							"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none",
						)}>
						<span className="sr-only">Use setting</span>
						<span
							aria-hidden="true"
							className={classNames(
								currentState.poll.multiple ? "translate-x-5" : "translate-x-0",
								"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
							)}
						/>
					</Switch>
				</div>
			</div>
		</div>
	);
}


function Files({ currentState, setCurrentState }: {
	currentState: SendFormState,
	setCurrentState: StateUpdater<SendFormState>,
}) {
	return (
		<>
			{currentState.files.length > 0 && (
				<div className="flex flex-wrap gap-4 bottom-0 flex-row px-4 w-full">
					{currentState.files.map((file: File, index: number) => {
						return (
							<div
								key={index}
								className="overflow-hidden relative h-24 rounded-lg border-2">
								{renderFilePreview(file)}
								<Button
									onClick={(e: any) => {
										e.preventDefault();

										let newFiles = currentState.files;
										let newFileIds = currentState.fileIds;

										newFiles.splice(index, 1);
										newFileIds.splice(index, 1);

										setCurrentState(s => ({
											...s,
											files: newFiles,
											fileIds: newFileIds
										}));
									}}
									style="gray"
									className="!absolute top-2 right-2 !p-2">
									<IconX className="w-4 h-4" />
								</Button>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

function ButtonRow({
	fileInputRef,
	client,
	setCurrentState,
	currentState,
	max_chars,
}: {
	fileInputRef: any;
	client: any;
	setCurrentState: StateUpdater<SendFormState>;
	currentState: SendFormState;
	max_chars: any;
}) {
	return (
		<div className="flex inset-x-0 bottom-0 justify-between py-2 pr-2 pl-3">
			<div className="flex items-center space-x-1">
				<button
					type="button"
					onClick={() => {
						if (fileInputRef.current) fileInputRef.current.click();
					}}
					title="Attach a file"
					className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<IconPaperclip className="w-6 h-6" aria-hidden="true" />
					<span className="sr-only">Attach a file</span>
				</button>
				<input
					type="file"
					className="hidden"
					ref={fileInputRef}
					multiple
					onChange={async (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => {
						try {
							setCurrentState(s => ({
								...s,
								loading: true,
								files: [...s.files, ...(e.target as any).files],
							}));
							const ids = await Promise.all(
								[...(e.target as any).files].map(async file => {
									return (await client.uploadMedia((e.target as any).files[0]))
										.data.id;
								}),
							);
							setCurrentState(s => ({
								...s,
								loading: false,
								fileIds: [...s.fileIds, ...ids],
							}));
						} catch (error) {
							console.error(error);
							toast.error("Couldn't upload files :(");
							// Handle error
						}
					}}
				/>
				<SmallSelect2 items={modes} defaultValue={0} onChange={(i) => {
					setCurrentState(s => ({
						...s,
						mode: i
					}))
				}} />
				<SmallSelect2
					items={visibilities}
					defaultValue={0}
					onChange={i => {
						setCurrentState(s => ({
							...s,
							visibility: i
						}))
					}}
				/>
				<button
					type="button"
					title="Create poll"
					onClick={e => {
						e.preventDefault();
						if (currentState.poll) {
							setCurrentState(s => ({
								...s,
								poll: null,
							}));
						} else {
							setCurrentState(s => ({
								...s,
								poll: {
									choices: [""],
									duration: 1000,
									multiple: false,
								},
							}));
						}
					}}
					className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<IconChartBar className="w-6 h-6" aria-hidden="true" />
					<span className="sr-only">Create a poll</span>
				</button>
			</div>
			<div className="flex flex-row flex-shrink-0 gap-x-4 items-center">
				<div className="flex flex-row gap-x-2 items-center">
					<span className="text-gray-600 dark:text-gray-300">
						{(max_chars ?? 500) - currentState.characters.length}
					</span>
					<svg width="27" height="27" viewBox="0 0 27 27" aria-hidden={true}>
						<circle
							cx="13.5"
							cy="13.5"
							r="10"
							fill="none"
							strokeWidth="3"
							className="stroke-gray-500 dark:stroke-white/80"></circle>
						<circle
							cx="13.5"
							cy="13.5"
							r="10"
							fill="none"
							strokeDasharray={(1 - currentState.characters.length / (max_chars ?? 500)) * 62.832}
							strokeDashoffset="62.832"
							strokeLinecap="round"
							strokeWidth="3.5"
							className="stroke-orange-500"></circle>
					</svg>
				</div>
				<Button
					isLoading={currentState.loading}
					disabled={currentState.loading}
					style="orangeLight"
					type="submit"
					className="!px-4 !py-2 !text-base">
					Post
				</Button>
			</div>
		</div>
	);
}
function EmojiItem({ emoji, onClick }: any) {
	return (
		<div
			onClick={onClick}
			className="flex flex-row gap-x-4 px-3 py-2 duration-200 hover:bg-gray-100 hover:dark:bg-gray-800">
			<img src={emoji.url} className="w-5 h-5" alt="" />
			<span>{emoji.shortcode}</span>
		</div>
	);
}
