import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import type { Account } from "types/types";
import { ChevronDown } from "react-bootstrap-icons";
import Link from "next/link";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ProfileDropdown({ account }: { account: Account }) {
	return (
		<Menu as="div" className="hidden relative text-left md:inline-block">
			<div>
				<Menu.Button className="w-full text-gray-700 bg-white border-gray-300 outline-none button hover:bg-gray-50">
					Account
					<ChevronDown
						className="-mr-1 ml-2 w-3 h-3"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<Menu.Items className="absolute right-0 mt-2 w-44 bg-white rounded-md divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none font-inter">
					<div className="px-4 py-3">
						<p className="text-sm">Signed in as</p>
						<p className="text-sm font-medium text-orange-600 truncate">
							@{account.username}
						</p>
					</div>
					<div className="">
						<Menu.Item>
							{({ active }) => (
								<Link
									href="/account/settings/profile"
									className={classNames(
										active
											? "text-gray-900 bg-gray-100"
											: "text-gray-700",
										"block px-4 py-3 text-sm duration-200"
									)}>
									Account settings
								</Link>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
