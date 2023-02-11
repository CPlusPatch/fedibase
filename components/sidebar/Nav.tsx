/* eslint-disable @next/next/no-img-element */
import { Transition } from "@headlessui/react";
import { IconHome, IconUsers, IconWorld } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import { getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { classNames } from "utils/functions";

const navigation = [
	{
		name: "Home",
		icon: IconHome,
		href: "/",
	},
	{
		name: "Instance",
		icon: IconUsers,
		href: "/instance",
	},
	{
		name: "Federated",
		icon: IconWorld,
		href: "/federated",
	},
];

export default function Nav({ current }: { current: string }) {
	const client = useContext(AuthContext);
	const [account, setAccount] = useState<Entity.Account>();
	const [instance, setInstance] = useState<Entity.Instance>();

	useEffect(() => {
		if (window) {
			client.getAccount(getCookie("accountId").toString()).then(data => {
				setAccount(data.data);
			});

			if (getCookie("instanceData")?.toString()) {
				setInstance(JSON.parse(getCookie("instanceData").toString()));
			} else {
				client.getInstance().then(data => {
					setCookie("instanceData", JSON.stringify(data.data));
					setInstance(data.data);
				});
			}
		}
	}, [client])

	return (
		<div className="hidden fixed top-0 bottom-0 left-0 z-50 flex-col flex-1 col-span-1 min-h-0 bg-gray-50 bg-gradient-to-b border-r lg:flex">
			<div className="flex overflow-y-auto flex-col flex-1 pt-5 pb-4">
				<Link href="/" className="flex flex-shrink-0 justify-center items-center px-2">
					<img src={instance?.thumbnail} className="w-8 h-8 rounded" alt=""/>
				</Link>
				<nav
					className="flex-1 px-2 mt-5 space-y-1"
					aria-label="Sidebar">
					{navigation.map((item) => (
						<NavElement item={item} key={item.name} current={current === item.href}/>
					))}
				</nav>
				<Link href={`/users/${account?.id}`} className="flex justify-center items-center text-gray-600">
					<img src={account?.avatar} className="w-9 h-9 rounded border" alt=""/>
				</Link>
			</div>
		</div>
	);
}

function NavElement({ item, current }: { item: any; current: boolean }) {
	let [showTooltip, setShowTooltip] = useState<boolean>(false);
	return (
		<div className="flex flex-row items-center">
			<Link
				href={item.href}
				className={classNames(
					current
						? "bg-gray-300/40"
						: "hover:bg-gray-300/40 hover:bg-opacity-75",
					"flex justify-center items-center p-2 mx-2 text-sm font-medium rounded-md duration-200 group"
				)}
				onMouseEnter={() => {
					setShowTooltip(true);
				}}
				onMouseLeave={() => {
					setShowTooltip(false);
				}}>
				<item.icon
					className="flex-shrink-0 w-5 h-5 text-gray-600"
					aria-hidden="true"
				/>
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
					className="inline-block absolute z-10 px-3 py-2 ml-14 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm font-inter">
					{item.name}
				</div>
			</Transition>
		</div>
	);
}
