import { Transition, Dialog, Switch } from "@headlessui/react";
import {
	IconAlertTriangle,
	IconAlignLeft,
	IconChartBar,
	IconClock,
	IconFile,
	IconLock,
	IconLockOpen,
	IconMail,
	IconMarkdown,
	IconNewSection,
	IconPaperclip,
	IconWorld,
	IconX,
} from "@tabler/icons-preact";
import { Button } from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { Conversation } from "components/feed/Conversation";
import { Input } from "components/forms/Input";
import Select2, { SelectItem } from "components/forms/Select2";
import SmallSelect from "components/forms/SmallSelect";
import Status, { StatusType } from "components/posts/Status";
import { ModalOverlay } from "components/transitions/ModalOverlay";
import { ScaleFadeSlide } from "components/transitions/ScaleFadeSlide";
import { v4 as uuidv4 } from "uuid";
import { Entity } from "megalodon";
import { ChangeEvent, memo } from "preact/compat";
import {
	Ref,
	StateUpdater,
	useContext,
	useEffect,
	useRef,
	useState,
} from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { JSXInternal } from "preact/src/jsx";
import { toast } from "react-hot-toast";
import {
	classNames,
	findMentions,
	getCustomEmojis,
	modifyStore,
	withEmojis,
} from "utils/functions";
import { useBackupStore } from "utils/useBackupStore";

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
	const { store, setStore } = useBackupStore();

	return (
		<>
			{store.viewingConversation ? (
				<Conversation
					id={store.viewingConversation}
					mode={StatusType.Notification}
				/>
			) : (
				<div className="p-3 h-full">
					<label className="flex flex-col items-center justify-center w-full h-full border-2 no-bad-scale duration-200 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
						<div className="flex flex-col justify-center items-center p-4">
							<IconNewSection className="mb-3 w-10 h-10 dark:text-gray-200 text-gray-600" />
							<p className="mb-2 text-sm dark:text-gray-400 text-gray-500">
								Click on a conversation and it will appear here
							</p>
						</div>
					</label>
				</div>
			)}

			{/* Only show on mobile */}
			<Transition.Root
				unmount={window.innerWidth > 768}
				show={
					store.mobilePostViewer &&
					window.innerWidth < 768 &&
					!store.postComposerOpened
				}
				as={Fragment}>
				<Dialog
					as="div"
					className="relative md:hidden"
					onClose={() => {
						modifyStore(setStore, {
							mobilePostViewer: false,
						});
					}}
					unmount={false}>
					<div className="flex fixed inset-y-0 right-0 ml-10 max-w-full pointer-events-none">
						<Transition.Child
							unmount={false}
							as={Fragment}
							enter="ease-out duration-100"
							enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
							enterTo="opacity-100 translate-y-0 scale-100"
							leave="ease-in duration-100"
							leaveFrom="opacity-100 translate-y-0 scale-100"
							leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95">
							<Dialog.Panel className="overflow-hidden relative w-screen max-w-md pointer-events-auto">
								<div className="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl dark:bg-dark-800">
									<div className="flex justify-between px-4 sm:px-6">
										<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-50">
											Conversation
										</Dialog.Title>
										<button
											type="button"
											className="text-gray-300 rounded-md hover:text-white dark:hover:text-black focus:outline-none"
											onClick={() => {
												modifyStore(setStore, {
													mobilePostViewer: false,
													quotingTo: null,
													replyingTo: null,
												});
											}}>
											<span className="sr-only">
												Close panel
											</span>
											<IconX
												className="w-6 h-6"
												aria-hidden="true"
											/>
										</button>
									</div>
									<div className="flex overflow-hidden relative mt-6 max-w-full grow sm:px-6">
										<Conversation
											showTitle={false}
											id={store.viewingConversation}
											mode={StatusType.Post}
										/>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={store.postComposerOpened} as={Fragment}>
				<Dialog
					as="div"
					className="block relative z-40"
					onClose={() =>
						modifyStore(setStore, {
							postComposerOpened: false,
							quotingTo: null,
							replyingTo: null,
						})
					}>
					<ModalOverlay />

					<div className="overflow-y-auto fixed inset-0 no-scroll py-5">
						<div className="flex justify-center items-start p-4 min-h-full text-center md:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-in-out duration-200"
								enterFrom="opacity-0 translate-y-4 translate-y-0 scale-75"
								enterTo="opacity-100 translate-y-0 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 scale-100"
								leaveTo="opacity-0 translate-y-4 translate-y-0 scale-75">
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

const renderFilePreview = (file: File) => {
	if (file.type.includes("image")) {
		return (
			<img
				alt=""
				src={window.URL.createObjectURL(file)}
				className="object-cover w-full h-full"
			/>
		);
	} else if (file.type.includes("video")) {
		return (
			<video
				src={window.URL.createObjectURL(file)}
				controls
				className="w-full h-full"
			/>
		);
	} else if (file.type.includes("audio")) {
		return (
			<audio
				src={window.URL.createObjectURL(file)}
				controls
				className="w-full h-full"
			/>
		);
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
	files: {
		uuid: string;
		metadata: Entity.Attachment;
		file: File;
	}[];
	loading: boolean;
	emojisSuggestions: Entity.Emoji[];
	userSuggestions: Entity.Account[];
	contentWarning: null | string;
	poll: null | {
		choices: string[];
		duration: number;
		multiple: boolean;
	};
}

const SendForm = memo(() => {
	// Context stuff
	const client = useContext(AuthContext);

	const { store, setStore } = useBackupStore();
	const otherPost = store.replyingTo ?? store.quotingTo;

	const [currentState, setCurrentState] = useState<SendFormState>({
		mode: modes[0],
		visibility: visibilities[0],
		files: [],
		loading: false,
		emojisSuggestions: [],
		userSuggestions: [],
		contentWarning: otherPost?.sensitive
			? `RE: ${otherPost.spoiler_text}`
			: null,
		poll: null,
	});

	// Element refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const uploadFiles = async (toUpload: FileList) => {
		setCurrentState(prev => ({
			...prev,
			loading: true,
		}));
		console.info(`Uploading ${toUpload.length} files`);

		const files = await Promise.all(
			[...toUpload].map(async file => {
				const upload = (await client?.uploadMedia(file)) as any;

				return {
					uuid: uuidv4(),
					metadata: upload.data,
					file: file,
				};
			})
		);

		toast.success("Files uploaded!");
		setCurrentState(prev => ({
			...prev,
			loading: false,
			files: files,
		}));
	};

	const handlePaste = async (
		e: JSXInternal.TargetedClipboardEvent<HTMLTextAreaElement>
	) => {
		if (!client || !e.clipboardData || e.clipboardData.files.length < 1) return;
		e.preventDefault();

		try {
			await uploadFiles(e.clipboardData.files);
		} catch (error) {
			console.error(error);
			toast.error("Couldn't upload files :(");
			// Handle error
		}
	};

	const handleChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
		const value = (event.target as HTMLTextAreaElement).value;

		// Check for emoji mentions
		setCurrentState(s => ({ ...s, characters: value }));
		const emojiMatch = value.match(/:\w+(?<!:)$/g)?.[0]?.replace(":", "");
		const matchedEmojis = emojiMatch
			? store.emojis.filter(e => e.shortcode.includes(emojiMatch))
			: [];
		setCurrentState(prev => ({
			...prev,
			emojisSuggestions: matchedEmojis,
		}));

		// Check for username mentions
		const userMatches = value.match(/@\w+(?:\.\w+)?$/g);

		if (!client) return;

		const matches = (
			await client.searchAccount(userMatches?.at(-1) ?? "", { limit: 5 })
		).data;

		setCurrentState(s => ({
			...s,
			userSuggestions:
				userMatches && userMatches.length > 0 ? matches : [],
		}));
	};

	useEffect(() => {
		const otherPost = store.replyingTo ?? store.quotingTo ?? null;

		if (otherPost) {
			const id = store.auth.id;
			const mentions = findMentions(otherPost, id).join(" ");

			if (mentions && textareaRef.current) {
				textareaRef.current.value = `${mentions} `;
			}

			setCurrentState(s => ({
				...s,
				visibility:
					visibilities.find(v => v.value === otherPost?.visibility) ??
					visibilities[0],
			}));
		}

		client &&
			getCustomEmojis(client).then(emojis => {
				setCurrentState(s => ({
					...s,
					emojis: emojis,
				}));
			});

		const timeout = setTimeout(() => {
			// Move the cursor to the end of the textarea
			textareaRef.current?.setSelectionRange(
				textareaRef.current?.value.length,
				textareaRef.current?.value.length
			);

			textareaRef.current?.focus();
		}, 500);

		return () => clearTimeout(timeout);
	}, [store.replyingTo, store.quotingTo]);

	const submitForm = async (
		event: JSXInternal.TargetedEvent<HTMLFormElement, Event>
	) => {
		event.preventDefault();
		setCurrentState(s => ({
			...s,
			loading: true,
		}));

		const text: string = (event.target as HTMLFormElement)["comment"].value;
		let cw: string;
		try {
			cw = (event.target as HTMLFormElement)["cw"].value;
		} catch {
			cw = "";
		}
		//const text = comment.value;
		const inReplyToId = store.replyingTo?.id;
		const quoteId = store.quotingTo?.id;

		if (text.length <= 0) {
			toast.error("You need to add some text!");
			setCurrentState(prev => ({
				...prev,
				loading: false,
			}));
			return false;
		}

		try {
			await client?.postStatus(text, {
				in_reply_to_id: inReplyToId,
				visibility: currentState.visibility.value as any,
				media_ids:
					currentState.files.length > 0
						? currentState.files.map(f => f.metadata.id)
						: undefined,
				spoiler_text: cw,
				sensitive: currentState.contentWarning !== null,
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
			toast.error(
				"There was an error sending your post. Maybe check the visibility?"
			);
		} finally {
			setCurrentState({
				mode: modes[0],
				visibility: visibilities[0],
				files: [],
				loading: false,
				emojisSuggestions: [],
				userSuggestions: [],
				poll: null,
				contentWarning: null,
			});
			modifyStore(setStore, {
				postComposerOpened: false,
				quotingTo: null,
				replyingTo: null,
			});
		}
	};
	return (
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
					currentState.loading
						? "bg-gray-100 dark:bg-dark-800"
						: "bg-white dark:bg-dark-800"
				}`}>
				<div className="flex justify-between p-3 w-full gap-x-2">
					<div className="flex flex-row items-center gap-x-3">
						<button
							className="mb-1"
							onClick={e => {
								e.preventDefault();
								modifyStore(setStore, {
									postComposerOpened: false,
									quotingTo: null,
									replyingTo: null,
								});
							}}>
							<IconX className="w-6 h-6" />
						</button>
						<h1 className="text-xl font-bold dark:text-gray-50">
							{store.replyingTo && (
								<>
									Replying to{" "}
									{withEmojis(
										store.replyingTo.account.display_name,
										store.replyingTo.account.emojis
									)}
								</>
							)}
							{store.quotingTo && (
								<>
									Quoting{" "}
									{withEmojis(
										store.quotingTo.account.display_name,
										store.quotingTo.account.emojis
									)}
								</>
							)}
							{!(store.replyingTo || store.quotingTo) && (
								<>Compose</>
							)}
						</h1>
					</div>
					<div>
						<Button
							loading={currentState.loading}
							style="orangeLight"
							type="submit"
							className="!px-4 !py-2 !text-base text-white dark:text-white !border-none !bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] !from-pink-500 !via-red-500 !to-yellow-500">
							Post
						</Button>
					</div>
				</div>

				{store.replyingTo && (
					<div className="px-4 opacity-60">
						<Status
							status={store.replyingTo ?? store.quotingTo}
							type={StatusType.Notification}
							showInteraction={false}
						/>
					</div>
				)}

				<textarea
					ref={textareaRef}
					rows={6}
					name="comment"
					onPaste={handlePaste}
					onChange={handleChange}
					disabled={currentState.loading}
					className="block py-3 no-scroll w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
					placeholder="What's happening?"
				/>

				{currentState.poll && (
					<PollCreator
						currentState={currentState}
						setCurrentState={setCurrentState}
					/>
				)}

				{currentState.contentWarning !== null && (
					<Input
						defaultValue={currentState.contentWarning}
						placeholder="Add content warning"
						className="border-0 px-6 !bg-orange-500/10"
						name="cw"
						id="cw"
						isLoading={currentState.loading}>{""}</Input>
				)}

				<Files
					files={currentState.files}
					setCurrentState={setCurrentState}
				/>

				<ScaleFadeSlide
					show={currentState.emojisSuggestions.length > 0}>
					<div className="flex absolute z-[60] flex-col rounded-lg border dark:bg-dark-800/80 backdrop-blur-md bg-white/80 dark:border-gray-700">
						{currentState.emojisSuggestions
							.slice(0, 5)
							.map(emoji => (
								<EmojiItem
									key={emoji.shortcode}
									emoji={emoji}
									onClick={() => {
										if (!textareaRef.current) return;
										const val = textareaRef.current.value;

										const matchedEmoji =
											val.match(/:\w+(?<!:)$/g)?.[0];

										if (!matchedEmoji) return;
										textareaRef.current.value = val.replace(
											matchedEmoji,
											`:${emoji.shortcode}: `
										);
										setCurrentState(s => ({
											...s,
											emojisSuggestions: [],
										}));
									}}
								/>
							))}
					</div>
				</ScaleFadeSlide>

				<ScaleFadeSlide show={currentState.userSuggestions.length > 0}>
					<div className="flex absolute z-[60] flex-col rounded-xl border dark:bg-dark-800/80 backdrop-blur-md bg-white/80 dark:border-gray-700">
						{currentState.userSuggestions.slice(0, 5).map(user => (
							<SuggestionItem
								key={user.id}
								user={user}
								onClick={() => {
									if (!textareaRef.current) return;

									const val = textareaRef.current.value;

									textareaRef.current.value = val.replace(
										/@\w+(?:\.\w+)?$/g,
										"@" + user.acct + " "
									);
									textareaRef.current.focus();

									setCurrentState(s => ({
										...s,
										userSuggestions: [],
									}));
								}}
							/>
						))}
					</div>
				</ScaleFadeSlide>

				<ButtonRow
					currentState={currentState}
					setCurrentState={setCurrentState}
					fileInputRef={fileInputRef}
					textareaRef={textareaRef}
					uploadFiles={uploadFiles}
				/>
			</div>
		</form>
	);
});

function PollCreator({
	currentState,
	setCurrentState,
}: {
	currentState: SendFormState;
	setCurrentState: StateUpdater<SendFormState>;
}) {
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
									onChange={() => {
										const pollCopy = currentState.poll;

										pollCopy?.choices.splice(index, 1);
										setCurrentState(s => ({
											...s,
											poll: pollCopy,
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
						{currentState?.poll?.choices &&
							index === currentState.poll?.choices.length - 1 && (
								<button
									onClick={e => {
										e.preventDefault();
										const pollCopy = currentState.poll;
										pollCopy?.choices.splice(index, 1);

										setCurrentState(s => ({
											...s,
											poll: pollCopy,
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

						const pollCopy = currentState.poll;

						pollCopy?.choices.push("");

						setCurrentState(s => ({
							...s,
							poll: pollCopy,
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
									choices: s.poll?.choices ?? [""],
									duration: Number(i.value),
									multiple: s.poll?.multiple ?? false,
								},
							}));
						}}
					/>
				</div>
				<div className="md:w-2/3 w-full flex items-center justify-between">
					<p className="ml-2">Allow multiple answers</p>
					<Switch
						checked={currentState.poll?.multiple}
						onChange={(checked: boolean) => {
							setCurrentState(s => ({
								...s,
								poll: {
									choices: s.poll?.choices ?? [""],
									duration: s.poll?.duration ?? 600,
									multiple: checked,
								},
							}));
						}}
						className={classNames(
							currentState.poll?.multiple
								? "bg-orange-600"
								: "bg-gray-200",
							"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
						)}>
						<span className="sr-only">Use setting</span>
						<span
							aria-hidden="true"
							className={classNames(
								currentState.poll?.multiple
									? "translate-x-5"
									: "translate-x-0",
								"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
							)}
						/>
					</Switch>
				</div>
			</div>
		</div>
	);
}

function Files({
	files,
	setCurrentState,
}: {
	files: SendFormState["files"];
	setCurrentState: StateUpdater<SendFormState>;
}) {
	return (
		<>
			{files.length > 0 && (
				<div className="flex flex-wrap gap-4 flex-row px-4 w-full mt-4">
					{files.map((file, index) => {
						return (
							<div
								key={file.uuid}
								className="overflow-hidden relative h-24 rounded-lg border-2">
								{renderFilePreview(file.file)}
								<Button
									onClick={(e: any) => {
										e.preventDefault();

										const newFiles = files;

										newFiles.splice(index, 1);

										setCurrentState(s => ({
											...s,
											files: newFiles,
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
	setCurrentState,
	currentState,
	textareaRef,
	uploadFiles,
}: {
	fileInputRef: any;
	setCurrentState: StateUpdater<SendFormState>;
	currentState: SendFormState;
	textareaRef: Ref<HTMLTextAreaElement>;
	uploadFiles: (toUpload: FileList) => Promise<void>;
}) {
	const { store } = useBackupStore();

	return (
		<div className="flex inset-x-0 bottom-0 justify-between py-2 pr-2 pl-3 flex-row">
			<div className="flex items-center space-x-1">
				<button
					type="button"
					onClick={() => {
						document.getElementById("fileUpload")?.click();
					}}
					title="Attach a file"
					className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<IconPaperclip className="w-6 h-6" aria-hidden="true" />
				</button>
				<input
					type="file"
					id="fileUpload"
					aria-hidden={true}
					className="hidden"
					ref={fileInputRef}
					multiple
					onChange={async (
						e: JSXInternal.TargetedEvent<HTMLInputElement, Event>
					) => {
						try {
							await uploadFiles((e.target as any).files);
						} catch (error) {
							console.error(error);
							toast.error("Couldn't upload files :(");
							// Handle error
						}
					}}
				/>
				<SmallSelect
					items={modes}
					defaultValue={0}
					onChange={i => {
						setCurrentState(prev => ({
							...prev,
							mode: i,
						}));
					}}
				/>
				<SmallSelect
					items={visibilities}
					defaultValue={
						store.replyingTo || store.quotingTo
							? visibilities.findIndex(
									v =>
										(store.replyingTo ?? store.quotingTo)
											?.visibility == v.value
							  )
							: 0
					}
					onChange={i => {
						setCurrentState(prev => ({
							...prev,
							visibility: i,
						}));
					}}
				/>
				<button
					type="button"
					title="Create poll"
					onClick={e => {
						e.preventDefault();

						setCurrentState(s => ({
							...s,
							poll: currentState.poll
								? null
								: {
										choices: [""],
										duration: 1000,
										multiple: false,
								  },
						}));
					}}
					className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<IconChartBar className="w-6 h-6" aria-hidden="true" />
				</button>
				<button
					type="button"
					title="Add content warning"
					onClick={e => {
						e.preventDefault();

						setCurrentState(prev => ({
							...prev,
							contentWarning:
								prev.contentWarning === null ? "" : null,
						}));
					}}
					className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<IconAlertTriangle className="w-6 h-6" aria-hidden="true" />
				</button>
			</div>
			<div className="flex flex-row flex-shrink-0 gap-x-4 items-center">
				<div className="flex flex-row gap-x-2 items-center">
					<span
						className={classNames(
							"text-gray-600 dark:text-gray-300",
							(textareaRef.current?.value.length ?? 0) >
								(store.auth.instance?.max_toot_chars ?? 500) &&
								"!text-red-600"
						)}>
						{(
							(store.auth.instance?.max_toot_chars ?? 500) -
							(textareaRef.current?.value.length ?? 0)
						).toLocaleString("en", {
							notation: "compact",
						})}
					</span>
					<svg
						width="27"
						height="27"
						viewBox="0 0 27 27"
						aria-hidden={true}>
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
							strokeDasharray={62.832}
							strokeDashoffset={
								(1 -
									(textareaRef.current?.value.length ?? 0) /
										(store.auth.instance?.max_toot_chars ??
											500)) *
								62.832
							}
							strokeLinecap="round"
							strokeWidth="3.5"
							className="stroke-orange-500"></circle>
					</svg>
				</div>
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

function SuggestionItem({
	user,
	onClick,
}: {
	user: Entity.Account;
	onClick: any;
}) {
	return (
		<div
			onClick={onClick}
			className="flex flex-row gap-x-4 px-3 py-2 duration-200 hover:bg-gray-100 hover:dark:bg-gray-800 items-center">
			<img src={user.avatar} className="w-8 h-8 rounded-md" alt="" />
			<div className="flex flex-col justify-between">
				<span>@{user.display_name}</span>
				<span className="text-gray-500 dark:text-gray-400">
					{user.acct}
				</span>
			</div>
		</div>
	);
}
