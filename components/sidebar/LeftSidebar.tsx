import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { Entity, Response } from "megalodon";
import { FormEvent, useContext, useState } from "react";
import { Paperclip, Search, X } from "react-bootstrap-icons";
import { toast, Toaster } from "react-hot-toast";

export default function LeftSidebar() {
	const client = useContext(AuthContext);

	const submitForm = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		client.postStatus(event.target["comment"].value, {
			visibility: "unlisted",
		}).then((res: Response<Entity.Status>) => {
			if (res.status == 200) {
				toast("Post sent!", {
					icon: "👍",
				});
			}
		});
	}

	return (
		<div className="flex flex-col gap-y-10 w-full h-full font-inter">
			<Toaster position="top-left"/>
			<div className="flex relative w-full">
				<input className="px-4 py-2 w-full h-12 bg-gray-100 rounded-md border" placeholder="Search here..."/>
				<Search className="absolute inset-y-0 right-4 w-4 h-full" />
			</div>

			<form action="#" className="relative bg-white" onSubmit={submitForm}>
				<div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm duration-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
					<label htmlFor="comment" className="sr-only">
						What&apos;s happening?
					</label>
					<textarea
						rows={3}
						name="comment"
						id="comment"
						className="block py-3 w-full border-0 resize-none focus:ring-0 sm:text-sm"
						placeholder="What's happening?"
						defaultValue={""}
					/>

					{/* Spacer element to match the height of the toolbar */}
					<div className="py-2" aria-hidden="true">
						{/* Matches height of button in toolbar (1px border + 36px content height) */}
						<div className="py-px">
							<div className="h-9" />
						</div>
					</div>
				</div>

				<div className="flex absolute inset-x-0 bottom-0 justify-between py-2 pr-2 pl-3">
					<div className="flex items-center space-x-5">
						<div className="flex items-center">
							<button
								type="button"
								className="-m-2.5 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500">
								<Paperclip className="w-5 h-5" aria-hidden="true" />
								<span className="sr-only">Attach a file</span>
							</button>
						</div>
					</div>
					<div className="flex-shrink-0">
						<Button
							style="orange"
							type="submit"
							className="">
							Post
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};
