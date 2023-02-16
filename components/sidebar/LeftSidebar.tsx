/* eslint-disable @next/next/no-img-element */
import { Transition, Dialog } from "@headlessui/react";
import { IconAlignLeft, IconLock, IconLockOpen, IconMail, IconMarkdown, IconPaperclip, IconSearch, IconWorld, IconX } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import Select from "components/forms/Select";
import SmallSelect from "components/forms/SmallSelect";
import { Entity, Response } from "megalodon";
import { FormEvent, Fragment, useContext, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { withEmojis } from "utils/functions";

const modes = [
	{
		text: "Plaintext",
		value: "text",
		icon: IconAlignLeft,
	},
	{
		text: "Markdown",
		value: "markdown",
		icon: IconMarkdown,
	},
];

const visibilities = [
	{
		text: "Public",
		value: "public",
		icon: IconWorld,
	},
	{
		text: "Unlisted",
		value: "unlisted",
		icon: IconLockOpen,
	},
	{
		text: "Private",
		value: "private",
		icon: IconLock,
	},
	{
		text: "Direct",
		value: "direct",
		icon: IconMail,
	},
];

export default function LeftSidebar() {
	const [state, setState] = useContext(StateContext) as any;

	return (
		<>
			<div className="flex flex-col gap-y-10 w-full h-full font-inter">
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

					<SendForm />
				</div>
			</div>
			<Transition.Root show={state.mobileEditorOpened} as={Fragment}>
				<Dialog
					as="div"
					className="block relative z-50 md:hidden"
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
						<div className="fixed inset-0 backdrop-blur-lg transition-all bg-gray-400/40" />
					</Transition.Child>

					<div className="overflow-y-auto fixed inset-0 z-10">
						<div className="flex justify-center items-start p-4 min-h-full text-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
								<Dialog.Panel className="relative my-8 w-full text-left transition-all transform sm:max-w-lg">
									<SendForm />
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
};

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
	
	// Element refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const submitForm = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		let visibility;

		switch (selectedVis.value) {
			case "unlisted":
				visibility = "unlisted";
				break;
			case "public":
				visibility = "public";
				break;
			case "private":
				visibility = "private";
				break;
			case "direct":
				visibility = "direct";
				break;
		}

		client
			.postStatus(event.target["comment"].value, {
				in_reply_to_id: state?.replyingTo?.id ?? undefined,
				visibility: visibility,
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
				textareaRef.current.value = "";
				setState((s: any) => ({
					...s,
					replyingTo: null,
				}));
				setFileIds([]);
				setFiles([]);
			});
	};
	return (
		<>
			<form
				action="#"
				className="relative text-sm"
				onSubmit={submitForm}
				onKeyUp={e => {
					if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
						e.currentTarget.requestSubmit();
					}
				}}>
				<div className="overflow-hidden bg-white rounded border border-gray-300 shadow-sm duration-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
					<textarea
						rows={3}
						ref={textareaRef}
						id="comment"
						disabled={loading}
						className="block py-3 w-full border-0 resize-none focus:ring-0 sm:text-sm disabled:bg-gray-200"
						placeholder="What's happening?"
						defaultValue={""}
					/>

					{/* Spacer element to match the height of the toolbar */}
					<div className={`py-2 ${loading && "bg-gray-200"}`} aria-hidden="true">
						{/* Matches height of button in toolbar (1px border + 36px content height) */}
						<div className="py-px">
							<div className="h-9" />
						</div>
					</div>
				</div>

				<div className="flex absolute inset-x-0 bottom-0 justify-between py-2 pr-2 pl-3">
					<div className="flex items-center space-x-2">
						<button
							type="button"
							onClick={() => {
								fileInputRef.current.click();
							}}
							className="flex relative flex-row gap-x-1 items-center p-2 text-gray-400 rounded duration-200 cursor-default hover:bg-gray-100">
							<IconPaperclip className="w-5 h-5" aria-hidden="true" />
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
					</div>
					<div className="flex-shrink-0">
						<Button
							isLoading={loading}
							disabled={loading}
							style="orange"
							type="submit"
							className="">
							Post
						</Button>
					</div>
				</div>
			</form>

			<div className="flex">
				<div className="w-2/3">
					<Select
						items={visibilities}
						selected={selectedVis}
						setSelected={setSelectedVis}
					/>
				</div>
			</div>

			{files.length > 0 &&
				files.map((file: File, index: number) => {
					return <img key={index} alt="" src={window.URL.createObjectURL(file)} />;
				})}
		</>
	);
}