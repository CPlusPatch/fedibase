import { Transition } from "@headlessui/react";
import { Fragment } from "preact/jsx-runtime";

interface ScaleFadeSlideProps {
	children: any;
	show?: boolean;
	appear?: boolean;
}

export function ScaleFadeSlide(props: ScaleFadeSlideProps) {
	return (
		<Transition
			as={Fragment}
			{...props}
			enter="ease-out duration-200"
			enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			enterTo="opacity-100 translate-y-0 sm:scale-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100 translate-y-0 sm:scale-100"
			leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"></Transition>
	);
}
