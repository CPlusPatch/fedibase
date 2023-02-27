import { Dialog, Transition } from "@headlessui/react";
import { IconBell, IconHome, IconMenu2, IconPencilPlus, IconX } from "@tabler/icons-preact";
import Button from "components/buttons/Button";
import NotificationsFeed from "components/feed/NotificationsFeed";
import { MobileNav } from "components/sidebar/Nav";
import { Fragment } from "preact/jsx-runtime";
import { Entity } from "megalodon";
import { useDispatch, useSelector } from "react-redux";
import {
	setMobileEditorState,
	setNotificationsSidebarOpened,
	setSidebarOpened,
	StateType,
} from "utils/stateSlice";
import { AuthContext } from "components/context/AuthContext";
import { useContext, useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import { smoothNavigate } from "utils/functions";

export default function MobileNavbar() {
	const state2 = useSelector(state => (state as any).state as StateType);
	const [account, setAccount] = useState<Entity.Account | null>(null);
	const dispatch = useDispatch();
	const client = useContext(AuthContext);

	useEffect(() => {
		client
			?.verifyAccountCredentials()
			.then(data => {
				setAccount(data.data);
			})
			.catch(e => {
				console.log(e);
				toast.error("Couldn't load account data :(");
			});
	}, [])

	return (
		<>
			<header className="flex fixed inset-x-0 bottom-0 z-30 justify-between items-center px-6 py-2 bg-white border-b dark:border-gray-700 bg-dark md:hidden">
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						dispatch(setSidebarOpened(true));
					}}>
					<IconMenu2 aria-hidden={true} className="" />
					<span className="sr-only">Open sidebar</span>
				</Button>
				{/* <a href="/" className="flex flex-row gap-x-3 text-lg dark:text-gray-50 font-poppin">
					<SmallLogo size="w-7 !h-7" />
					Fedibase
				</a> */}
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						smoothNavigate("/", dispatch);
					}}>
					<IconHome aria-hidden={true} className="" />
					<span className="sr-only">Visit main feed</span>
				</Button>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						dispatch(setMobileEditorState(true));
					}}>
					<IconPencilPlus aria-hidden={true} />
					<span className="sr-only">Compose new post</span>
				</Button>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						dispatch(setNotificationsSidebarOpened(true));
					}}>
					<IconBell aria-hidden={true} />
					<span className="sr-only">Open notifications</span>
				</Button>
				<Button style="gray" className="!p-0 !border-none !shadow-none">
					<img src={account?.avatar} className="w-9 h-9 rounded border-2" />
					<span className="sr-only">Your avatar</span>
				</Button>
			</header>
			<Transition.Root unmount={false} show={state2.notificationsOpened} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40"
					onClose={() => {
						dispatch(setMobileEditorState(false));
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
								<div className="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl bg-dark">
									<div className="flex justify-between px-4 sm:px-6">
										<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-50">
											Notifications
										</Dialog.Title>
										<button
											type="button"
											className="text-gray-300 rounded-md hover:text-white dark:hover:text-black focus:outline-none"
											onClick={() => {
												dispatch(setNotificationsSidebarOpened(false));
											}}>
											<span className="sr-only">Close panel</span>
											<IconX className="w-6 h-6" aria-hidden="true" />
										</button>
									</div>
									<div className="flex overflow-hidden relative px-4 mt-6 max-w-full grow sm:px-6">
										<NotificationsFeed withTitle={false} />
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={state2.sidebarOpened} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40"
					onClose={() => {
						dispatch(setSidebarOpened(false));
					}}
					unmount={false}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 backdrop-filter backdrop-blur-sm transition-opacity bg-gray-400/40" />
					</Transition.Child>

					<div className="overflow-hidden fixed inset-0">
						<div className="overflow-hidden absolute inset-0">
							<div className="flex fixed inset-y-0 left-0 mr-10 max-w-full pointer-events-none">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-200 sm:duration-300"
									enterFrom="-translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-200 sm:duration-300"
									leaveFrom="translate-x-0"
									leaveTo="translate-x-full">
									<Dialog.Panel className="overflow-hidden relative w-screen max-w-md pointer-events-auto">
										<Transition.Child
											as={Fragment}
											enter="ease-in-out duration-200"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-200"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="flex absolute top-0 right-0 pt-4 pl-2 -mr-8 sm:-mr-10 sm:pl-4"></div>
										</Transition.Child>
										<div className="flex overflow-y-hidden flex-col py-6 max-w-xs h-full bg-white shadow-xl bg-dark">
											<div className="flex justify-between px-4 sm:px-6">
												<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-50">
													Fedibase
												</Dialog.Title>
												<button
													type="button"
													className="text-gray-300 rounded-md hover:text-white focus:outline-none"
													onClick={() => {
														dispatch(setSidebarOpened(false));
													}}>
													<span className="sr-only">Close panel</span>
													<IconX className="w-6 h-6" aria-hidden="true" />
												</button>
											</div>
											<div className="flex overflow-hidden relative px-4 mt-6 max-w-full h-full sm:px-6">
												<MobileNav />
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
