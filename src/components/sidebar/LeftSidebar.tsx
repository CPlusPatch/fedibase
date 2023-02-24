import { Transition, Dialog, Switch } from "@headlessui/react";
import {
	IconAlignLeft,
	IconChartBar,
	IconClock,
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
import SmallSelect from "components/forms/SmallSelect";
import { StatusType } from "components/posts/Status";
import { Entity } from "megalodon";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
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
	const state2 = useSelector((state) => (state as any).state as StateType);
	const dispatch = useDispatch();

	return (
		<>
			<div>
				{state2.viewingConversation && (
					<Conversation id={state2.viewingConversation} mode={StatusType.Notification} />
				)}
			</div>
			<Transition.Root show={state2.postComposerOpened} as={Fragment}>
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

function SendForm() {
	// Context stuff
	const client = useContext(AuthContext);

	const state2 = useSelector(state => (state as any).state as StateType);
	const dispatch = useDispatch();

	// State stuff
	const [selectedMode, setSelectedMode] = useState(modes[0]);
	const [selectedVis, setSelectedVis] = useState(visibilities[0]);
	const [files, setFiles] = useState<File[] | []>([]);
	const [fileIds, setFileIds] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [characters, setCharacters] = useState<string>("");
	const [emojis, setEmojis] = useState<Entity.Emoji[]>([]);
	const [emojisSuggestions, setEmojisSuggestions] = useState<Entity.Emoji[]>([]);

	const [poll, setPoll] = useState<{
		choices: string[],
		duration: number,
		multiple: boolean
	} | null>(null);
	const [pollDuration, setPollDuration] = useState(pollDurations[0]);

	const max_chars = (JSON.parse(localStorage.getItem("instanceData") ?? "{}") as Entity.Instance)
		.max_toot_chars;

	// Element refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		// YES, I KNOW YOU CAN SHORTEN THIS I JUST DONT CARE
		let otherPost = null;
		if (state2.replyingTo) {
			otherPost = state2.replyingTo;
		} else if (state2.quotingTo) {
			otherPost = state2.quotingTo;
		}

		if (otherPost) {
			const id = localStorage.getItem("accountId");
			// Gets array of mentions, removes mentions of self, deduplicates resulting array
			// and turns the output into "@gay@gay.com" format seperated by spaces
			const mentions = [
				...new Map(
					(otherPost as Entity.Status).mentions
						.concat([(otherPost as Entity.Status).account])
						.filter(m => m.id !== id)
						.map(v => [v.id, v]),
				).values(),
			]
				.map(m => "@" + m.acct)
				.join(" ");

				if (mentions.length > 0)
					setCharacters(mentions + " ");

			switch (otherPost.visibility) {
				case "unlisted":
					setSelectedVis(visibilities[1]);
					break;
				case "private":
					setSelectedVis(visibilities[2]);
					break;
				case "direct":
					setSelectedVis(visibilities[3]);
					break;
			}

		}
		
		textareaRef.current?.focus();
		
		client?.getInstanceCustomEmojis().then(data => {
			setEmojis(data.data);
		});
	}, [client, state2.quotingTo, state2.replyingTo]);

	const submitForm = async (
		event: JSXInternal.TargetedEvent<HTMLFormElement, Event>
	) => {
		event.preventDefault();

		setLoading(true);

		if (!event.target) {
			return;
		}

		client
			.postStatus((event.target as any)["comment"].value, {
				in_reply_to_id: state2?.replyingTo?.id ?? undefined,
				visibility: selectedVis.value as any,
				media_ids: fileIds,
				quote_id: state2.quotingTo?.id ?? undefined,
				poll: poll ? {
					options: poll.choices,
					expires_in: Number(pollDuration.value)
				} : undefined
			})
			.then(() => {
				toast("Post sent!", {
					icon: "👍",
				});
			})
			.catch(() => {
				toast.error(
					"There was an error sending your post. Maybe check the visibility?"
				);
			})
			.finally(() => {
				setLoading(false);
				setFileIds([]);
				setFiles([]);
				dispatch(setMobileEditorState(false));
			});
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
						loading ? "bg-gray-100 bg-dark" : "bg-white bg-dark"
					}`}>
					<div className="flex justify-between p-3 w-full">
						<h1 className="text-xl font-bold dark:text-gray-50">
							{state2.replyingTo && (
								<>
									Replying to{" "}
									{withEmojis(
										state2.replyingTo.account.display_name,
										state2.replyingTo.account.emojis,
									)}
								</>
							)}
							{state2.quotingTo && (
								<>
									Quoting{" "}
									{withEmojis(
										state2.quotingTo.account.display_name,
										state2.quotingTo.account.emojis,
									)}
								</>
							)}
							{!(state2.replyingTo || state2.quotingTo) && <>Compose</>}
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
									setFiles(f => [...f, ...files]);
									setLoading(true);
									const ids = await Promise.all(
										[...files].map(async file => {
											return (await client.uploadMedia(file)).data.id;
										}),
									);
									toast.success("Files uploaded!");
									setLoading(false);
									setFileIds(f => [...f, ...ids]);
								} catch (error) {
									console.error(error);
									toast.error("Couldn't upload files :(");
									// Handle error
								}
							}
						}}
						onChange={async event => {
							const { value }: any = event.target;
							setCharacters(value);

							const split = value.split(":");
							if (split.length > 1 && /^\w+$/.test(split[split.length - 1])) {
								const matched = split[split.length - 1];

								const matchedEmojis = emojis.filter(e =>
									e.shortcode.includes(matched),
								);
								setEmojisSuggestions(matchedEmojis);
							} else {
								setEmojisSuggestions([]);
							}
						}}
						disabled={loading}
						className="block py-3 w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
						placeholder="What's happening?"
						defaultValue={characters}
					/>

					{poll && (
						<div className="flex w-full px-4 flex-col gap-y-2">
							<ol className="flex-col w-full gap-y-4 flex">
								{poll.choices.map((choice, index) => (
									<li
										key={index}
										className="inline-flex w-full justify-between items-center gap-x-3">
										<div className="flex items-center gap-x-2 grow">
											{index + 1}.
											<div className="grow">
												<Input
													onChange={(e: any) => {
														let pollCopy = poll;

														pollCopy.choices[index] = e.target.value;

														setPoll(p => pollCopy);
													}}
													isLoading={false}
													className="!w-full"
													placeholder="Poll choice here"
													name={"test"}>
													{""}
												</Input>
											</div>
										</div>
										<button
											onClick={e => {
												e.preventDefault();
												let pollCopy = poll;
												pollCopy.choices.splice(index);

												setPoll(p => ({
													...p,
													choices: pollCopy.choices,
												}));
											}}>
											<IconX className="w-5 h-5" />
										</button>
									</li>
								))}
								<Button
									onClick={e => {
										e.preventDefault();

										setPoll(p => ({
											...p,
											choices: [...p.choices, ""],
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
									<Select
										items={pollDurations}
										selected={pollDuration}
										setSelected={setPollDuration}
									/>
								</div>
								<div className="md:w-2/3 w-full flex items-center justify-between">
									<p className="ml-2">Allow multiple answers</p>
									<Switch
										checked={poll.multiple}
										onChange={checked => {
											setPoll(p => ({
												...p,
												multiple: checked,
											}));
										}}
										className={classNames(
											poll.multiple ? "bg-orange-600" : "bg-gray-200",
											"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none",
										)}>
										<span className="sr-only">Use setting</span>
										<span
											aria-hidden="true"
											className={classNames(
												poll.multiple ? "translate-x-5" : "translate-x-0",
												"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
											)}
										/>
									</Switch>
								</div>
							</div>
						</div>
					)}

					{files.length > 0 && (
						<div className="flex overflow-x-scroll bottom-0 flex-row gap-x-4 px-4 w-full">
							{files.map((file: File, index: number) => {
								return (
									<div
										key={index}
										className="overflow-hidden relative h-24 rounded-lg border-2">
										{file.type.includes("image") && (
											<img
												alt=""
												src={window.URL.createObjectURL(file)}
												className="object-cover w-full h-full"
											/>
										)}
										{file.type.includes("video") && (
											<video
												src={window.URL.createObjectURL(file)}
												controls
												className="w-full h-full"
											/>
										)}
										<Button
											onClick={(e: any) => {
												e.preventDefault();
												setFiles(f => f.splice(index, 1));
												setFileIds(f => f.splice(index, 1));
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

					<Transition
						as={Fragment}
						enter="ease-out duration-200"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						show={emojisSuggestions.length > 0}>
						<div className="flex absolute z-[60] flex-col rounded border bg-dark bg-white dark:border-gray-700">
							{emojisSuggestions.slice(0, 5).map(emoji => (
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
										setEmojis([]);
									}}
								/>
							))}
						</div>
					</Transition>

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
								onChange={async (
									e: JSXInternal.TargetedEvent<HTMLInputElement, Event>,
								) => {
									try {
										setFiles(f => [...f, ...(e.target as any).files]);
										setLoading(true);
										const ids = await Promise.all(
											[...(e.target as any).files].map(async file => {
												return (
													await client.uploadMedia(
														(e.target as any).files[0],
													)
												).data.id;
											}),
										);
										setLoading(false);
										setFileIds(f => [...f, ...ids]);
									} catch (error) {
										console.error(error);
										toast.error("Couldn't upload files :(");
										// Handle error
									}
								}}
							/>
							<SmallSelect
								items={modes}
								selected={selectedMode}
								setSelected={setSelectedMode}
							/>
							<SmallSelect
								items={visibilities}
								selected={selectedVis}
								setSelected={setSelectedVis}
							/>
							<button
								type="button"
								title="Create poll"
								onClick={e => {
									e.preventDefault();
									if (poll) {
										setPoll(null);
									} else {
										setPoll({
											choices: [""],
											duration: 1000,
											multiple: false,
										});
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
									{(max_chars ?? 500) - characters.length}
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
										strokeDasharray={
											(1 - characters.length / (max_chars ?? 500)) * 62.832
										}
										strokeDashoffset="62.832"
										strokeLinecap="round"
										strokeWidth="3.5"
										className="stroke-orange-500"></circle>
								</svg>
							</div>
							<Button
								isLoading={loading}
								disabled={loading}
								style="orangeLight"
								type="submit"
								className="!px-4 !py-2 !text-base">
								Post
							</Button>
						</div>
					</div>
				</div>
			</form>
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
