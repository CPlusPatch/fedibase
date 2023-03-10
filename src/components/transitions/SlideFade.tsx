import { Transition } from "@headlessui/react";
import { Fragment } from "preact/jsx-runtime";

interface SlideFadeProps {
	children: any;
	show?: boolean;
	appear?: boolean;
}

export function SlideFade(props: SlideFadeProps) {
	return (
		<Transition
			as={Fragment}
			{...props}
			enter="transition ease-out duration-200"
			enterFrom="opacity-0 translate-y-1"
			enterTo="opacity-100 translate-y-0"
			leave="transition ease-in duration-150"
			leaveFrom="opacity-100 translate-y-0"
			leaveTo="opacity-0 translate-y-1"></Transition>
	);
}
