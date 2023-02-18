/* eslint-disable @next/next/no-img-element */
import { Transition, Dialog } from "@headlessui/react";
import {
	IconAlignLeft,
	IconLock,
	IconLockOpen,
	IconMail,
	IconMarkdown,
	IconPaperclip,
	IconSearch,
	IconWorld,
	IconX,
} from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import Select from "components/forms/Select";
import SmallSelect from "components/forms/SmallSelect";
import { Entity, Response } from "megalodon";
import { FormEvent, Fragment, useContext, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { withEmojis } from "utils/functions";

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
	const [state, setState] = useContext(StateContext) as any;

	return (
		<>
			<div className="flex hidden flex-col gap-y-10 w-full h-full font-inter">
				<Toaster position="top-left" />
				<div className="flex relative w-full">
					<input
						className="px-4 py-2 w-full h-10 text-sm bg-gray-100 rounded-md border"
						placeholder="Search here..."
					/>
					<IconSearch className="absolute inset-y-0 right-4 w-4 h-full" />
				</div>

				<div className="flex flex-col gap-y-2">
					{state?.replyingTo && (
						<div className="flex relative flex-row gap-x-2 p-2 w-full text-sm bg-gray-100 rounded border font-inter">
							<img
								src={(state?.replyingTo as Entity.Status).account.avatar}
								className="w-10 h-10 rounded"
								alt=""
							/>
							<div>
								Replying to{" "}
								{withEmojis(
									(state?.replyingTo as Entity.Status).account.display_name,
									(state?.replyingTo as Entity.Status).account.emojis,
								)}
							</div>
							<div className="absolute top-2 right-2">
								<button
									className="bg-gray-100 rounded"
									onClick={() => {
										setState((s: any) => ({
											...s,
											replyingTo: null,
										}));
									}}>
									<IconX className="w-4 h-4" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
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
		let mentions = "@" + (state.replyingTo as Entity.Status)?.account.acct + " ";

		(state.replyingTo as Entity.Status)?.mentions.map(m => {
			mentions += "@" + m.acct + " "
		})

		if (state.replyingTo) setCharacters(mentions);

		client.getInstanceCustomEmojis().then(data => {
			setEmojis(data.data);
		})
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
		<>
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
								setState((s: any) => ({
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
						rows={6}
						onChange={async e => {
							setCharacters(e.target.value);

							const split = e.target.value.split(":");

							if (
								split.length > 1 &&
								/^\w+$/.test(split[split.length - 1]) &&
								split[split.length - 1] !== ""
							) {
								const matched = split[split.length - 1];

								emojis.map(e => {
									if (e.shortcode.startsWith(matched)) {
										setEmojisSuggestions(s => [...s, e]);
									}
								});
							} else {
								setEmojisSuggestions([]);
							}
						}}
						disabled={loading}
						className="block py-3 w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
						placeholder="What's happening?"
						defaultValue={characters}
					/>

					<Transition
						as={Fragment}
						enter="ease-out duration-200"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						show={emojisSuggestions.length > 0}>
						<div className="flex absolute z-[60] flex-col rounded border bg-dark dark:border-gray-700">
							{emojisSuggestions.slice(0, 5).map(s => (
								<div onClick={e => {
									const val = textareaRef.current.value;
									textareaRef.current.value = val.replace(
										val.split(":")[val.split(":").length - 1],
										`${s.shortcode}: `
									);
									setEmojisSuggestions([]);
								}} key={s.shortcode} className="flex flex-row gap-x-4 px-3 py-2 duration-200 hover:bg-gray-100 hover:dark:bg-gray-800">
									<img src={s.url} className="w-5 h-5" alt="" />
									<span>{s.shortcode}</span>
								</div>
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
								className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
								<IconPaperclip className="w-6 h-6" aria-hidden="true" />
								<span className="sr-only">Attach a file</span>
								<input
									type="file"
									className="hidden"
									ref={fileInputRef}
									onChange={async e => {
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
									}}
								/>
							</button>
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
								<svg width="27" height="27" viewBox="0 0 27 27">
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

			{files.length > 0 &&
				files.map((file: File, index: number) => {
					return <img key={index} alt="" src={window.URL.createObjectURL(file)} />;
				})}
		</>
	);
}
