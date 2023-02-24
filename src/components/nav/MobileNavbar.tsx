import { Dialog, Transition } from "@headlessui/react";
import { IconBell, IconMenu2, IconPencilPlus, IconX } from "@tabler/icons-preact";
import Button from "components/buttons/Button";
import SmallLogo from "components/logo/SmallLogo";
import NotificationsFeed from "components/feed/NotificationsFeed";
import { MobileNav } from "components/sidebar/Nav";
import { Fragment } from "preact/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import {
	setMobileEditorState,
	setNotificationsSidebarOpened,
	setSidebarOpened,
	StateType,
} from "utils/stateSlice";

export default function MobileNavbar() {
	const state2 = useSelector(state => (state as any).state as StateType);
	const dispatch = useDispatch();
	
	return (
		<>
			<header className="flex fixed inset-x-0 top-0 z-30 justify-between items-center px-6 py-2 bg-white border-b dark:border-gray-700 bg-dark md:hidden">
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						dispatch(setSidebarOpened(true));
					}}>
					<IconMenu2 aria-hidden={true} className="" />
					<span className="sr-only">Open sidebar</span>
				</Button>
				<a href="/" className="flex flex-row gap-x-3 text-lg dark:text-gray-50 font-poppin">
					<SmallLogo size="w-7 !h-7" />
					Fedibase
				</a>
				<Button
					style="gray"
					className="!p-3 !border-none !shadow-none"
					onClick={() => {
						dispatch(setNotificationsSidebarOpened(true));
					}}>
					<IconBell aria-hidden={true} />
					<span className="sr-only">Open notifications</span>
				</Button>
			</header>
			<div className="fixed right-0 bottom-0 z-30 mx-7 my-7 md:hidden">
				<Button
					onClick={() => {
						dispatch(setMobileEditorState(true));
					}}
					style="gray"
					className="bg-gray-200 !p-3">
					<IconPencilPlus className="w-10 h-10" aria-hidden={true} />
					<span className="sr-only">Compose new post</span>
				</Button>
			</div>
			<Transition.Root unmount={false} show={state2.notificationsOpened} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40"
					onClose={() => {
						dispatch(setMobileEditorState(false));
					}}
					unmount={false}>
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						unmount={false}>
						<div className="fixed inset-0 backdrop-filter backdrop-blur-sm transition-opacity bg-gray-400/40" />
					</Transition.Child>

					<div className="overflow-hidden fixed inset-0">
						<div className="overflow-hidden absolute inset-0">
							<div className="flex fixed inset-y-0 right-0 ml-10 max-w-full pointer-events-none">
								<Transition.Child
									unmount={false}
									as={Fragment}
									enter="transform transition ease-in-out duration-200 sm:duration-500"
									enterFrom="translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-200 sm:duration-500"
									leaveFrom="translate-x-0"
									leaveTo="-translate-x-full">
									<Dialog.Panel className="overflow-hidden relative w-screen max-w-md pointer-events-auto">
										<Transition.Child
											unmount={false}
											as={Fragment}
											enter="ease-in-out duration-200"
											enterFrom="opacity-0"
											enterTo="opacity-100"
											leave="ease-in-out duration-200"
											leaveFrom="opacity-100"
											leaveTo="opacity-0">
											<div className="flex absolute top-0 left-0 pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4"></div>
										</Transition.Child>
										<div className="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl bg-dark">
											<div className="flex justify-between px-4 sm:px-6">
												<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-50">
													Notifications
												</Dialog.Title>
												<button
													type="button"
													className="text-gray-300 rounded-md hover:text-white focus:outline-none"
													onClick={() => {
														dispatch(setMobileEditorState(true));
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
						</div>
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
