import { Dialog, Transition } from "@headlessui/react";
import { IconBell, IconMenu2, IconPaperclip, IconPencilPlus, IconPlus, IconX } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { StateContext } from "components/context/StateContext";
import SmallSelect from "components/forms/SmallSelect";
import { Response } from "megalodon";
import SmallLogo from "components/logo/SmallLogo";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import Link from "next/link";
import { useState, Fragment, useContext, FormEvent, MutableRefObject, useRef } from "react";
import toast from "react-hot-toast";

export default function MobileNavbar() {
	const [open, setOpen] = useState(false);
	const [state, setState]: any = useContext(StateContext);
	const client = useContext(AuthContext);
	const [loading, setLoading] = useState<boolean>(false);
	const textareaRef: MutableRefObject<HTMLTextAreaElement> = useRef(null);

	const submitForm = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		client
			.postStatus(event.target["comment"].value, {
				in_reply_to_id: state?.replyingTo?.id ?? undefined,
				visibility: "public",
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
					mobileEditorOpened: false,
				}));
			});
	};
	
	return (
		<>
			<div className="flex fixed inset-x-0 top-0 z-30 justify-between items-center px-6 py-3 bg-white border-b md:hidden">
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconMenu2 className="" />
				</Button>
				<Link href="/">
					<SmallLogo size="w-10 !h-10" />
				</Link>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						setOpen(o => !o);
					}}>
					<IconBell className="" />
				</Button>
			</div>
			<div className="fixed right-0 bottom-0 z-30 mx-7 my-7">
				<Button
					onClick={() => {
						setState(s => ({
							...s,
							mobileEditorOpened: true,
						}));
					}}
					style="gray"
					className="bg-gray-200 !p-3">
					<IconPencilPlus className="w-10 h-10" />
				</Button>
			</div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-40" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 backdrop-filter backdrop-blur-sm transition-opacity bg-gray-400/40" />
					</Transition.Child>

					<div className="overflow-hidden fixed inset-0">
						<div className="overflow-hidden absolute inset-0">
							<div className="flex fixed inset-y-0 right-0 ml-10 max-w-full pointer-events-none">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full">
									<Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
										<Transition.Child
											as={Fragment}
											enter="ease-in-out duration-500"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-500"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="flex absolute top-0 left-0 pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4"></div>
										</Transition.Child>
										<div className="flex overflow-y-scroll flex-col py-6 h-full bg-white shadow-xl">
											<div className="flex justify-between px-4 sm:px-6">
												<Dialog.Title className="text-lg font-medium text-gray-900">
													Notifications
												</Dialog.Title>
												<button
													type="button"
													className="text-gray-300 rounded-md hover:text-white focus:outline-none"
													onClick={() => setOpen(false)}>
													<span className="sr-only">Close panel</span>
													<IconX className="w-6 h-6" aria-hidden="true" />
												</button>
											</div>
											<div className="flex overflow-y-scroll relative px-4 mt-6 max-w-full h-full sm:px-6">
												<NotificationsFeed withTitle={false} />
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={state.mobileEditorOpened} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50"
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
									<form
										onSubmit={submitForm}
										action="#"
										className="relative w-full text-sm">
										<div className="overflow-hidden w-full bg-white rounded-lg border border-gray-300 shadow-sm duration-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
											<textarea
												disabled={loading}
												ref={textareaRef}
												rows={3}
												id="comment"
												className="block px-4 py-4 w-full border-0 resize-none focus:ring-0 sm:text-sm disabled:bg-gray-200"
												placeholder="What's happening?"
												defaultValue={""}
											/>

											{/* Spacer element to match the height of the toolbar */}
											<div
												className={`py-2 ${loading && "bg-gray-200"}`}
												aria-hidden="true">
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
													<IconPaperclip
														className="w-5 h-5"
														aria-hidden="true"
													/>
													<span className="sr-only">Attach a file</span>
												</button>
											</div>
											<div className="flex-shrink-0">
												<Button
													style="orange"
													type="submit"
													isLoading={loading}
													disabled={loading}
													className="">
													Post
												</Button>
											</div>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}