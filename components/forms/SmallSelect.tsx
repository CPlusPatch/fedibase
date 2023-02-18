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
	description?: string;
}

export default function SmallSelect({ items, selected, setSelected }: SelectOptions) {
	return (
		<Listbox
			value={selected}
			onChange={value => {
				items.map(item => {
					if (item.value == value) {
						setSelected(item);
					}
				});
			}}>
			<div className="relative z-50 mt-1 font-inter">
				<Listbox.Button className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
					<selected.icon strokeWidth={2} className="w-6 h-6" aria-hidden="true" />
				</Listbox.Button>
				<Transition
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
					<Listbox.Options className="overflow-auto absolute z-30 mt-1 w-64 text-base bg-white rounded-md border dark:border-gray-700 bg-dark font-inter">
						{items.map(item => (
							<Listbox.Option
								key={item.value}
								className={`${
									item.value == selected.value && "bg-orange-100 dark:bg-orange-800"
								} flex relative flex-row gap-x-3 items-center p-2 text-gray-800 dark:text-gray-100 duration-200 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-700`}
								value={item.value}>
								<item.icon className="w-4 h-auto text-gray-500" aria-hidden={true}/>
								<div className="flex flex-col">
									<span className="text-sm font-semibold">{item.text}</span>
									<span className="text-sm text-orange-700 dark:text-orange-200">
										{item.description ?? ""}
									</span>
								</div>
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
}