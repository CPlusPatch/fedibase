import { Transition } from "@headlessui/react";
import { getSetting } from "components/settings/Settings";
import { classNames } from "utils/functions";

export function ModalOverlay() {
	return (
		<Transition.Child
			as={"div"}
			enter="ease-out duration-200"
			enterFrom="opacity-0 backdrop-blur-none"
			enterTo={classNames("opacity-100", getSetting("blur") === "on" && "backdrop-blur-lg")}
			leave="ease-in duration-200"
			leaveFrom={classNames("opacity-100", getSetting("blur") === "on" && "backdrop-blur-lg")}
			leaveTo="opacity-0 backdrop-blur-none"
			className={classNames("fixed inset-0 transition-all", getSetting("tintedBackdrop") === "off" ? "bg-gray-500/75 dark:bg-dark-700/75" : "bg-orange-400/50 dark:bg-orange-300/50")}>
		</Transition.Child>
	);
}