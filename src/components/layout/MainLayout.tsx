import MobileNavbar from "components/nav/MobileNavbar";
import LeftSidebar from "components/sidebar/LeftSidebar";
import NotificationsFeed from "components/feed/NotificationsFeed";
import toast, { Toaster } from "react-hot-toast";
import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { IconX } from "@tabler/icons-preact";

export default function MainLayout({ children }) {
	useEffect(() => {
		const timeout = window.setTimeout(() => {
			if (Notification.permission === "default" && localStorage.getItem("notificationsDenied") !== "true") {
				toast.custom(
					t => (
						<Transition
							show={t.visible}
							as={Fragment}
							enter="transform ease-out duration-300 transition"
							enterFrom="translate-y-full opacity-0"
							enterTo="translate-y-0 opacity-100"
							leave="transition ease-in duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="max-w-md w-full bg-white dark:bg-slate-800 backdrop-blur-sm backdrop-filter shadow-lg rounded-lg pointer-events-auto overflow-hidden">
								<div className="p-4">
									<div className="flex items-center">
										<div className="w-0 flex-1 flex justify-between">
											<p className="w-0 flex-1 text-sm font-medium text-gray-900 dark:text-gray-50">
												Enable desktop notifications?
											</p>
											<button
												onClick={() => {
													if (Notification.permission === "default") {
														Notification.requestPermission().then(
															() => {
																toast.success(
																	"Desktop notifications enabled!",
																);
															},
														);
													}
												}}
												type="button"
												className="ml-3 flex-shrink-0 rounded-md text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none">
												Enable
											</button>
											<button
												onClick={() => {
													localStorage.setItem("notificationsDenied", "true");
													toast.dismiss(t.id);
												}}
												type="button"
												className="ml-3 flex-shrink-0 rounded-md text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none">
												Never ask again
											</button>
										</div>
										<div className="ml-4 flex-shrink-0 flex">
											<button
												className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
												onClick={() => {
													toast.dismiss(t.id);
												}}>
												<span className="sr-only">Close</span>
												<IconX className="h-5 w-5" aria-hidden="true" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</Transition>
					),
					{
						position: "top-left",
						duration: 999999,
					},
				);
			}
		}, 2000);

		return () => window.clearTimeout(timeout);
	}, [])
	return (
		<div className="flex overflow-hidden flex-col w-full min-h-screen duration-200 bg-gradient-light">
			<Toaster />
			<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
				<main className="grow">
					<MobileNavbar />
					<div className="grid relative grid-cols-6 mx-auto max-w-full h-full md:grid-cols-11">
						<div className="hidden overflow-y-scroll max-h-screen md:col-span-3 md:block no-scroll">
							<LeftSidebar />
						</div>
						<div className="overflow-x-hidden overflow-y-hidden md:col-span-5 col-span-6 max-h-screen md:border-x dark:border-gray-700 md:pt-0">
							{children}
						</div>
						<div className="hidden overflow-x-hidden p-4 min-w-0 max-h-screen md:col-span-3 md:flex">
							<NotificationsFeed />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}