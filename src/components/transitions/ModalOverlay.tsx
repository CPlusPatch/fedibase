import { Transition } from "@headlessui/react";
import { getSetting } from "components/settings/Settings";
import { Fragment } from "preact/jsx-runtime";
import { classNames } from "utils/functions";

export function ModalOverlay() {
	return (
		<Transition.Child
			as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0">
			<div className={classNames("fixed inset-0 transition-all", getSetting("blur") === "on" && "backdrop-blur-md", getSetting("tintedBackdrop") === "off" ? "bg-gray-500/50 dark:bg-dark-700/50" : "bg-orange-400/50 dark:bg-orange-300/50")} />
		</Transition.Child>
	);
}