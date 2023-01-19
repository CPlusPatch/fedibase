import { Bars3Icon } from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";

export function MobileHamburgerMenu() {
	return (
		<div className="ml-auto md:hidden">
			<Popover.Button className="inline-flex justify-center items-center p-2 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
				<span className="sr-only">Open menu</span>
				<Bars3Icon className="w-6 h-6" aria-hidden="true" />
			</Popover.Button>
		</div>
	);
}
