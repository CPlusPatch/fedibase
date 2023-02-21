/* eslint-disable @next/next/no-img-element */
import { Transition, Dialog } from "@headlessui/react";
import {
	IconAlignLeft,
	IconLock,
	IconLockOpen,
	IconMail,
	IconMarkdown,
	IconPaperclip,
	IconWorld,
	IconX,
} from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import SmallSelect from "components/forms/SmallSelect";
import { Entity, Response } from "megalodon";
import { FormEvent, Fragment, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

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
	const [state, setState] = useContext(StateContext);

	return (
		<>
			<Transition.Root show={state.mobileEditorOpened} as={Fragment}>
				<Dialog
					as="div"
					className="block relative z-50"
					onClose={() =>
						setState(s => ({
							...s,
							mobileEditorOpened: false,
						}))
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

					<div className="overflow-y-auto fixed inset-0 z-10">
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

function SendForm() {
	// Context stuff
	const client = useContext(AuthContext);
	const [state, setState] = useContext(StateContext) as any;

	// State stuff
	const [selectedMode, setSelectedMode] = useState(modes[0]);
	const [selectedVis, setSelectedVis] = useState(visibilities[0]);
	const [files, setFiles] = useState<File[] | []>([]);
	const [fileIds, setFileIds] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [characters, setCharacters] = useState<string>("");
	const [emojis, setEmojis] = useState<Entity.Emoji[]>([]);
	const [emojisSuggestions, setEmojisSuggestions] = useState<Entity.Emoji[]>([]);

	const max_chars = (JSON.parse(localStorage.getItem("instanceData")) as Entity.Instance).max_toot_chars;

	// Element refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (state.replyingTo) {
			const id = localStorage.getItem("accountId");
			// Gets array of mentions, removes mentions of self, deduplicates resulting array
			// and turns the output into "@gay@gay.com" format seperated by spaces
			const mentions = [
				...new Map(
					(state.replyingTo as Entity.Status).mentions
						.filter(m => m.id !== id)
						.concat([(state.replyingTo as Entity.Status).account])
						.map(v => [v.id, v]),
				).values(),
			]
				.map(m => "@" + m.acct + " ")
				.join(" ");;
			setCharacters(mentions);
		}

		client.getInstanceCustomEmojis().then(data => {
			setEmojis(data.data);
		});
	}, [client, state.replyingTo])

	const submitForm = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		client
			.postStatus(event.target["comment"].value, {
				in_reply_to_id: state?.replyingTo?.id ?? undefined,
				visibility: selectedVis.value as any,
				media_ids: fileIds,
			})
			.then((res: Response<Entity.Status>) => {
				if (res.status == 200) {
					toast("Post sent!", {
						icon: "👍",
					});
				}
			})
			.finally(() => {
				setLoading(false);
				setFileIds([]);
				setFiles([]);
				setState((s: any) => ({
					...s,
					replyingTo: null,
					mobileEditorOpened: false
				}));
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
						<h1 className="text-xl font-bold dark:text-gray-50">Compose</h1>
						<button
							onClick={e => {
								e.preventDefault();
								setState(s => ({
									...s,
									mobileEditorOpened: false,
									replyingTo: null,
								}));
							}}>
							<IconX />
						</button>
					</div>

					<textarea
						ref={textareaRef}
						id="comment"
						rows={5}
						onChange={async event => {
							const { value } = event.target;
							setCharacters(value);

							const split = value.split(":");
							if (split.length > 1 && /^\w+$/.test(split[split.length - 1])) {
								const matched = split[split.length - 1];

								const matchedEmojis = emojis.filter(e =>
									e.shortcode.startsWith(matched),
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

					{files.length > 0 && (
						<div className="overflow-hidden bottom-0 px-4 w-full">
							{files.map((file: File, index: number) => {
								return (
									<div
										key={index}
										className="overflow-hidden relative w-24 h-24 rounded-lg border-2">
										<img
											alt=""
											src={window.URL.createObjectURL(file)}
											className="object-cover w-full h-full"
										/>
										<Button
											onClick={(e) => {
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
									fileInputRef.current.click();
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
								onChange={async e => {
									try {
										setFiles(f => [...f, ...e.target.files]);
										setLoading(true);
										const ids = await Promise.all(
											[...e.target.files].map(async file => {
												return (await client.uploadMedia(e.target.files[0]))
													.data.id;
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
						</div>
						<div className="flex flex-row flex-shrink-0 gap-x-4 items-center">
							<div className="flex flex-row gap-x-2 items-center">
								<span className="text-gray-600 dark:text-gray-300">
									{max_chars - characters.length}
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
											(1 - characters.length / max_chars) * 62.832
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

function EmojiItem({ emoji, onClick }) {
	return (
		<div
			onClick={onClick}
			className="flex flex-row gap-x-4 px-3 py-2 duration-200 hover:bg-gray-100 hover:dark:bg-gray-800">
			<img src={emoji.url} className="w-5 h-5" alt="" />
			<span>{emoji.shortcode}</span>
		</div>
	);
}