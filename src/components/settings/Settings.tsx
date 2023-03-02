import { Transition, Dialog, Switch } from "@headlessui/react";
import { ModalOverlay } from "components/transitions/ModalOverlay";
import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { classNames } from "utils/functions";
import { useStore } from "utils/store";

export function Settings() {
	const [state, setState] = useStore();
	return (
		<Transition.Root
			show={state.settingsOpen}
			as={Fragment}>
			<Dialog
				as="div"
				className="block relative z-40"
				onClose={() =>
					setState(prev => ({
						...prev,
						settingsOpen: false
					}))
				}>

				<ModalOverlay />

				<div className="overflow-y-auto fixed inset-0">
					<div className="flex justify-center items-start p-4 min-h-full text-center md:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
							enterTo="opacity-100 translate-y-0 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 scale-100"
							leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95">
							<Dialog.Panel className="relative my-8 w-full text-left transition-all transform sm:max-w-4xl">
								<div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg flex flex-col gap-y-4">
									<div className="w-full">
										<h1 className="text-lg dark:text-gray-50 font-poppins font-bold">Settings</h1>
									</div>
									<div className="flex flex-col gap-y-3">
										<SettingItem description="Toggles blur on modal backdrops" text="Enable blur" settingType={SettingType.Switch} name="blur" />
										<SettingItem description="Adds an orange tint to modal backdrops" text="Orange tint on backdrops" settingType={SettingType.Switch} name="tintedBackdrop" />
										<SettingItem description="When you click on a post, load it in the sidebar instead of reloading page" text="Load posts in sidebar" settingType={SettingType.Switch} name="sidebarLoad" />
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

enum SettingType {
	Switch,
	Input,
}

function SettingItem({
	settingType,
	name,
	text,
	description
}: {
	settingType: SettingType,
	name: string;
	text: string;
	description: string;
}) {
	const [enabled, setEnabled] = useState<boolean>(getSetting(name) === "on" ? true : false);

	return (
		<div className="dark:text-gray-200">
			<div className="flex items-center justify-between">
				<span className="flex-grow flex flex-col">
					<h2 as="span" className="text-sm font-medium text-gray-900 dark:text-gray-50">
						{text}
					</h2>
					<p as="span" className="text-sm text-gray-500 dark:text-gray-400">
						{description}
					</p>
				</span>
				{settingType === SettingType.Switch && (
					<Switch
						checked={enabled}
						onChange={(value: boolean) => {
							setSetting(name, value ? "on" : "off");
							setEnabled(value);
						}}
						className={classNames(
							enabled ? "bg-orange-600" : "bg-gray-200 dark:bg-dark-600 ",
							"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
						)}>
						<span
							aria-hidden="true"
							className={classNames(
								enabled ? "translate-x-5" : "translate-x-0",
								"pointer-events-none inline-block h-5 w-5 rounded-full bg-white  shadow transform ring-0 transition ease-in-out duration-200"
							)}/>
					</Switch>
				)}
			</div>
		</div>
	);
}

const defaultSettings: any = {
	blur: "on",
	sidebarLoad: "on",
	tintedBackdrop: "off"
};

export function setSetting(name: string, value: string) {
	if (defaultSettings[name]) {
		localStorage.setItem(`setting:${name}`, value);
	}
}

export function getSetting(name: string): string {
	if (defaultSettings[name]) {
		if (localStorage.getItem(`setting:${name}`)) {
			return localStorage.getItem(`setting:${name}`) ?? "";
		} else {
			localStorage.setItem(`setting:${name}`, defaultSettings[name]);
			return defaultSettings[name];
		}
	} else {
		return "";
	}
}