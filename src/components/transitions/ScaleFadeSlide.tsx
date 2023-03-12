import { Transition } from "@headlessui/react";
import { memo } from "preact/compat";
import { Fragment } from "preact/jsx-runtime";

interface ScaleFadeSlideProps {
	children: any;
	show?: boolean;
	appear?: boolean;
}

export const ScaleFadeSlide = memo((props: ScaleFadeSlideProps) => (
	<Transition
		as={Fragment}
		{...props}
		enter="ease-out duration-100"
		enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
		enterTo="opacity-100 translate-y-0 sm:scale-100"
		leave="ease-in duration-100"
		leaveFrom="opacity-100 translate-y-0 sm:scale-100"
		leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"></Transition>
));
