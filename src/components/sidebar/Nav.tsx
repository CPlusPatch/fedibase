import { Transition } from "@headlessui/react";
import {
	IconHome,
	IconMoon,
	IconPlus,
	IconSettings,
	IconSun,
	IconUsers,
	IconWorld,
} from "@tabler/icons-preact";
import { AuthContext } from "components/context/AuthContext";
import { Link } from "components/transitions/Link";
import { memo } from "preact/compat";
import { useContext, useState, useEffect } from "preact/hooks";
import { JSX, Fragment } from "preact/jsx-runtime";
import toast from "react-hot-toast";
import { classNames, modifyStore } from "utils/functions";
import { useBackupStore } from "utils/useBackupStore";

type NavigationItem = {
	name: string;
	icon: any;
	href: string;
	type: string;
};

type NavElementProps = {
	item: NavigationItem;
};

const navigation: NavigationItem[] = [
	{
		name: "Home",
		icon: IconHome,
		href: "/",
		type: "",
	},
	{
		name: "Instance",
		icon: IconUsers,
		href: "/local",
		type: "local",
	},
	{
		name: "Federated",
		icon: IconWorld,
		href: "/federated",
		type: "federated",
	},
];

function Nav(): JSX.Element {
	const client = useContext(AuthContext);

	const [account, setAccount] = useState<Entity.Account | undefined>();
	const [instance, setInstance] = useState<Entity.Instance | undefined>();
	const { store, setStore } = useBackupStore();

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

	useEffect(() => {
		if (window) {
			client
				?.verifyAccountCredentials()
				.then(data => {
					setAccount(data.data);
				})
				.catch(err => {
					console.error(err);
					toast.error("Couldn't load account data :(");
				});

			if (localStorage.getItem("instanceData")) {
				setInstance(
					JSON.parse(localStorage.getItem("instanceData") ?? "")
				);
			} else {
				client?.getInstance().then(data => {
					// Caches instance data
					localStorage.setItem(
						"instanceData",
						JSON.stringify(data.data)
					);
					setInstance(data.data);
				});
			}
		}
	}, []);

	return (
		<div className="hidden fixed z-10 top-0 dark:bg-dark-800 bg-white bottom-0 left-0 flex-col flex-1 col-span-1 min-h-0 bg-gradient-to-b border-r dark:border-gray-700 bg-light dark:dark:bg-dark-800 lg:flex">
			<div className="flex overflow-y-auto flex-col flex-1 items-center pt-5 pb-4">
				<Link
					href="/"
					className="flex flex-shrink-0 justify-center items-center px-2">
					<img
						src={instance?.thumbnail ?? ""}
						className="w-8 h-8 rounded"
						alt=""
					/>
					<span className="sr-only">{instance?.title}</span>
				</Link>
				<nav
					className="flex-1 px-2 mt-5 space-y-1"
					aria-label="Sidebar">
					{navigation.map(item => (
						<NavElement item={item} key={item.name} />
					))}
				</nav>
				<button
					onClick={e => {
						e.preventDefault();
						toggleTheme();
					}}
					className="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
					{store.theme === "light" && (
						<>
							<IconSun className="w-5 h-5" aria-hidden={true} />
							<span className="sr-only">Enable dark mode</span>
						</>
					)}
					{store.theme === "dark" && (
						<>
							<IconMoon className="w-5 h-5" aria-hidden={true} />
							<span className="sr-only">Enable light mode</span>
						</>
					)}
				</button>
				<button
					onClick={() => {
						modifyStore(setStore, {
							settingsOpen: true,
						});
					}}
					className="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75 group">
					<IconSettings className="w-5 h-5" aria-hidden={true} />
					<span className="sr-only">Enable light mode</span>
				</button>
				<button
					onClick={() => {
						modifyStore(setStore, {
							postComposerOpened: true,
						});
					}}
					title="Compose new post"
					className="flex justify-center items-center p-2 mb-3 text-sm font-medium rounded-md duration-200 dark:text-gray-300 bg-orange-300/20 hover:bg-orange-300/40 hover:bg-opacity-75 group">
					<IconPlus className="w-5 h-5" aria-hidden={true} />
					<span className="sr-only">Compose new post</span>
				</button>
				<Link
					href={`/users/${account?.id}`}
					className="flex justify-center items-center">
					<img
						src={account?.avatar}
						className="w-9 h-9 rounded border dark:border-gray-700"
						alt=""
					/>
					<span className="sr-only">
						Your avatar, click to visit your profile
					</span>
				</Link>
			</div>
		</div>
	);
}

function NavElement(props: NavElementProps) {
	const [current, setCurrent] = useState<boolean>(false);
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	useEffect(() => {
		setCurrent(
			typeof window !== "undefined"
				? window.location.pathname === props.item.href
				: false
		);
	}, [props.item.href]);

	return (
		<div className="flex flex-row items-center">
			<Link
				href={props.item.href}
				className={classNames(
					current
						? "bg-gray-300/40 dark:bg-gray-700/40"
						: "hover:bg-gray-300/40 hover:dark:bg-gray-700/40 hover:bg-opacity-75",
					"flex justify-center items-center p-2 mx-2 text-sm font-medium rounded-md duration-200 group"
				)}
				onMouseEnter={() => {
					setShowTooltip(true);
				}}
				onMouseLeave={() => {
					setShowTooltip(false);
				}}>
				<props.item.icon
					className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-gray-300"
					aria-hidden="true"
				/>
				<span className="sr-only">
					Visit the {props.item.name} feed
				</span>
			</Link>
			<Transition
				as={Fragment}
				show={showTooltip}
				enter="transform transition duration-150"
				enterFrom="opacity-0 scale-50"
				enterTo="opacity-100 scale-100"
				leave="transform duration-150 transition ease-in-out"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95">
				<div
					role="tooltip"
					className="inline-block absolute z-10 px-3 py-2 ml-14 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm dark:text-gray-100 dark:bg-dark-800 dark:border-gray-700 font-inter">
					{props.item.name}
				</div>
			</Transition>
		</div>
	);
}
export default memo(Nav);
