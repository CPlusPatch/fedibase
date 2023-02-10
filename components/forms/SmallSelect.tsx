import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ChevronDown } from "react-bootstrap-icons";

interface SelectOptions {
	items: SelectItem[];
	selected: any;
	setSelected: any;
}

interface SelectItem {
	text: string;
	value: string;
	icon: any;
}

export default function SmallSelect({ items, selected, setSelected }: SelectOptions) {
	return (
		<Listbox value={selected} onChange={(value) => {
			items.map(item => {
				if (item.value == value) {
					setSelected(item);
				}
			});
		}}>
			<div className="relative mt-1">
				<Listbox.Button className="flex relative flex-row gap-x-1 items-center p-2 text-gray-400 rounded duration-200 cursor-default hover:bg-gray-100">
					<selected.icon className="w-5 h-5" aria-hidden="true" />
					<ChevronDown className="w-4 h-4" />
				</Listbox.Button>
				<Transition
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
					<Listbox.Options className="overflow-auto absolute z-30 mt-1 text-base bg-white rounded border divide-y font-inter">
						{items.map(item => (
							<Listbox.Option
								key={item.value}
								className={`flex relative flex-row gap-x-3 items-center p-2 text-gray-800 duration-200 cursor-default select-none hover:bg-gray-100`}
								value={item.value}>
								<item.icon className="w-6 h-auto" />
								{item.text}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
}