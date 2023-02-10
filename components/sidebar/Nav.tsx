import { Transition } from "@headlessui/react";
import SmallLogo from "components/logo/SmallLogo";
import Link from "next/link";
import { Fragment, useState } from "react";
import { GlobeEuropeAfrica, HouseDoorFill, PeopleFill, PersonCircle } from "react-bootstrap-icons";
import { classNames } from "utils/functions";

const navigation = [
	{
		name: "Home",
		icon: HouseDoorFill,
		href: "/admin/posts",
	},
	{
		name: "Instance",
		icon: PeopleFill,
		href: "/admin/editor",
	},
	{
		name: "Federated",
		icon: GlobeEuropeAfrica,
		href: "/admin/users",
	},
];

export default function Nav({ current }: { current: string }) {
	return (
		<div className="hidden fixed top-0 bottom-0 left-0 z-50 flex-col flex-1 col-span-1 min-h-0 bg-gray-50 bg-gradient-to-b border-r lg:flex">
			<div className="flex overflow-y-auto flex-col flex-1 pt-5 pb-4">
				<Link href="/" className="flex flex-shrink-0 justify-center items-center px-2">
					<SmallLogo size="w-8" />
				</Link>
				<nav
					className="flex-1 px-2 mt-5 space-y-1"
					aria-label="Sidebar">
					{navigation.map((item) => (
						<NavElement item={item} key={item.name} current={current === item.href}/>
					))}
				</nav>
				<Link href="/account/settings/profile" className="flex justify-center items-center text-gray-600">
					<PersonCircle className="w-7 h-7" />
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
					className="flex-shrink-0 w-6 h-6 text-gray-600"
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
