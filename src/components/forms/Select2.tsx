import { Listbox, Transition } from "@headlessui/react";
import { IconSeparatorHorizontal } from "@tabler/icons-preact";
import { Fragment } from "preact/jsx-runtime";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";

interface SelectOptions {
	items: SelectItem[];
	defaultValue: number;
	onChange?: (item: SelectItem) => void
}

export interface SelectItem {
	text: string;
	value: string;
	icon: any;
	description?: string;
}

function Select2({ items, defaultValue, onChange = () => {
	//
} }: SelectOptions) {
	const [selected, setSelected] = useState(items[defaultValue]);
	return (
		<div className="w-full">
			<Listbox
				defaultValue={selected.value}
				onChange={(value: string) => {
					items.map(item => {
						if (item.value === value) {
							setSelected(item);
							onChange(item);
						}
					});
				}}
				as="div"
				className="relative mt-1">
				<Listbox.Button className="relative py-2 pr-10 pl-3 w-full text-left bg-white rounded border shadow-sm cursor-default dark:bg-dark-800 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
					<span className="block truncate">{selected.text}</span>
					<span className="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
						<IconSeparatorHorizontal className="w-5 h-5 text-gray-400" aria-hidden="true" />
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
					<Listbox.Options className="overflow-auto absolute z-20 mt-1 w-full max-h-60 text-base bg-white rounded-md shadow-lg outline-none dark:bg-dark-800 font-inter focus:outline-none sm:text-sm">
						{items.map(item => (
							<Listbox.Option
								key={item.text}
								title={item.text}
								className={"flex relative flex-row gap-x-3 items-center px-4 py-2 duration-200 hover:bg-gray-200 hover:dark:bg-gray-700 dark:text-gray-100"}
								value={item.value}>
								<>
									<item.icon className="w-4 h-4"/>
									<span
										className={"block truncate"}>
										{item.text}
									</span>
								</>
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</Listbox>
		</div>
	);
}

export default memo(Select2);