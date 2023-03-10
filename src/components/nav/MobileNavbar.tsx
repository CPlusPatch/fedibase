import { Dialog, Transition } from "@headlessui/react";
import {
	IconBell,
	IconHome,
	IconMoon,
	IconPencilPlus,
	IconSun,
	IconX,
} from "@tabler/icons-preact";
import { Button } from "components/buttons/Button";
import NotificationsFeed from "components/feed/NotificationsFeed";
import { Fragment } from "preact/jsx-runtime";
import { Entity } from "megalodon";
import { AuthContext } from "components/context/AuthContext";
import { useContext, useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import { Link } from "components/transitions/Link";
import { useBackupStore } from "utils/useBackupStore";
import { modifyStore } from "utils/functions";
import { memo } from "preact/compat";

function MobileNavbar() {
	const { store, setStore } = useBackupStore();
	const [account, setAccount] = useState<Entity.Account | null>(null);
	const client = useContext(AuthContext);

	useEffect(() => {
		client
			?.verifyAccountCredentials()
			.then(data => {
				setAccount(data.data);
			})
			.catch(err => {
				console.error(err);
				toast.error("Couldn't load account data :(");
			});
	}, []);

	const toggleTheme = () => {
		const html = document.getElementsByTagName("html")[0];
		if (store.theme === "dark") {
			modifyStore(setStore, {
				theme: "light",
			});
			html.className = html.className.replaceAll("dark", "");
		} else if (store.theme === "light") {
			modifyStore(setStore, {
				theme: "dark",
			});
			html.className = html.className + " dark";
		}
	};

	return (
		<>
			<header className="flex fixed inset-x-0 bottom-0 z-30 justify-between items-center px-6 py-2 bg-white border-b dark:border-gray-700 dark:bg-dark-800 md:hidden">
				<Button
					theme="gray"
					className="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
					title={
						store.theme === "light"
							? "Enable dark mode"
							: "Enable light mode"
					}
					onClick={toggleTheme}>
					{store.theme === "light" && (
						<>
							<IconSun aria-hidden={true} />
						</>
					)}
					{store.theme === "dark" && (
						<>
							<IconMoon aria-hidden={true} />
						</>
					)}
				</Button>
				<Link href="/">
					<Button
						theme="gray"
						className="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
						title="Visit main feed">
						<IconHome aria-hidden={true} className="" />
						<span className="sr-only">Visit main feed</span>
					</Button>
				</Link>
				<Button
					theme="gray"
					className="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
					onClick={() => {
						modifyStore(setStore, {
							postComposerOpened: true,
						});
					}}>
					<IconPencilPlus aria-hidden={true} />
					<span className="sr-only">Compose new post</span>
				</Button>
				<Button
					theme="gray"
					className="!p-3 !border-none !shadow-none !bg-white dark:!bg-transparent"
					onClick={() => {
						modifyStore(setStore, {
							notificationsOpened: true,
						});
					}}>
					<IconBell aria-hidden={true} />
					<span className="sr-only">Open notifications</span>
				</Button>
				<Button
					theme="gray"
					className="!p-0 !border-none !shadow-none !bg-white dark:!bg-transparent"
					onClick={() => {
						modifyStore(setStore, {
							settingsOpen: true,
						});
					}}>
					<img
						src={account?.avatar}
						className="w-9 h-9 rounded border-2"
						alt="Your avatar"
					/>
					<span className="sr-only">Your avatar</span>
				</Button>
			</header>
			<Transition.Root
				unmount={window.innerWidth > 768}
				show={
					store.notificationsOpened &&
					window.innerWidth < 768 &&
					!store.postComposerOpened
				}
				as={Fragment}>
				<Dialog
					as="div"
					className="relative"
					onClose={() => {
						modifyStore(setStore, {
							postComposerOpened: false,
						});
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
								<div className="flex overflow-y-hidden flex-col pt-6 h-full bg-white shadow-xl dark:bg-dark-800">
									<div className="flex justify-between px-4 sm:px-6">
										<Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-50">
											Notifications
										</Dialog.Title>
										<button
											type="button"
											className="text-gray-300 rounded-md hover:text-white dark:hover:text-black focus:outline-none"
											onClick={() => {
												modifyStore(setStore, {
													notificationsOpened: false,
												});
											}}>
											<span className="sr-only">
												Close panel
											</span>
											<IconX
												className="w-6 h-6"
												aria-hidden="true"
											/>
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
		</>
	);
}

export default memo(MobileNavbar);
