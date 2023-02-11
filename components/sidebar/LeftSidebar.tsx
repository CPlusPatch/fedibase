import { IconAlignLeft, IconLock, IconLockOpen, IconMail, IconMarkdown, IconPaperclip, IconSearch, IconWorld } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import Select from "components/forms/Select";
import SmallSelect from "components/forms/SmallSelect";
import { Entity, Response } from "megalodon";
import { FormEvent, useContext, useState } from "react";
import { Paperclip, Search } from "react-bootstrap-icons";
import { toast, Toaster } from "react-hot-toast";

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
	const client = useContext(AuthContext);
	const [selectedMode, setSelectedMode] = useState(modes[0]);
	const [selectedVis, setSelectedVis] = useState(visibilities[0]);
	const [loading, setLoading] = useState<boolean>(false);

	const submitForm = (event: FormEvent<HTMLFormElement>) => {
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
				visibility: visibility,
			})
			.then((res: Response<Entity.Status>) => {
				if (res.status == 200) {
					toast("Post sent!", {
						icon: "👍",
					});
				}
			}).finally(() => {
				setLoading(false);
			});
	}

	return (
		<div className="flex flex-col gap-y-10 w-full h-full font-inter">
			<Toaster position="top-left" />
			<div className="flex relative w-full">
				<input
					className="px-4 py-2 w-full h-12 bg-gray-100 rounded-md border"
					placeholder="Search here..."
				/>
				<IconSearch className="absolute inset-y-0 right-4 w-4 h-full" />
			</div>

			<div className="flex flex-col gap-y-2">
				<form action="#" className="relative bg-white" onSubmit={submitForm}>
					<div className="overflow-hidden rounded border border-gray-300 shadow-sm duration-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
						<textarea
							rows={4}
							name="comment"
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
								className="flex relative flex-row gap-x-1 items-center p-2 text-gray-400 rounded duration-200 cursor-default hover:bg-gray-100">
								<IconPaperclip className="w-5 h-5" aria-hidden="true" />
								<span className="sr-only">Attach a file</span>
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
					<div className="w-1/2">
						<Select
							items={visibilities}
							selected={selectedVis}
							setSelected={setSelectedVis}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
