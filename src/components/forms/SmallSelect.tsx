import { Listbox } from "@headlessui/react";
import { ScaleFadeSlide } from "components/transitions/ScaleFadeSlide";
import { SlideFade } from "components/transitions/SlideFade";
import { memo } from "preact/compat";
import { useState } from "preact/hooks";

interface SelectOptions {
	items: SelectItem[];
	defaultValue: number;
	onChange: (item: SelectItem) => void;
	direction?: SelectDirection;
}

export enum SelectDirection {
	Right = "right",
	Left = "left",
}

interface SelectItem {
	text: string;
	value: string;
	icon: any;
	description?: string;
}

const SmallSelect = ({
	items,
	defaultValue,
	onChange = () => {
		//
	},
	direction = SelectDirection.Right,
}: SelectOptions) => {
	const [selected, setSelected] = useState<SelectItem>(items[defaultValue]);

	return (
		<Listbox
			defaultValue={selected.value}
			onChange={(value: string) => {
				const selectedItem = items.find(item => item.value === value);
				if (selectedItem) {
					setSelected(selectedItem);
					onChange(selectedItem);
				}
			}}
			as="div"
			className="relative font-inter">
			<Listbox.Button
				title="Open select menu"
				className="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
				<selected.icon
					strokeWidth={2}
					className="w-6 h-6"
					aria-hidden="true"
				/>
			</Listbox.Button>
			<SlideFade>
				<Listbox.Options
					className={`overflow-auto absolute z-30 shadow-lg mt-1 w-64 text-base bg-gray-100/75 rounded-md border dark:border-gray-700 dark:bg-dark-800/75 backdrop-blur-md font-inter ${
						direction == SelectDirection.Left &&
						"right-0 origin-top-right"
					}`}>
					{items.map(item => (
						<Listbox.Option
							key={item.value}
							title={item.description}
							className={`${
								item.value === selected.value &&
								"bg-orange-100 dark:bg-orange-500/10"
							} flex relative flex-row gap-x-3 items-center py-2 px-3 text-gray-800 dark:text-gray-100 duration-200 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-700`}
							value={item.value}>
							<item.icon
								className="w-5 h-auto text-gray-500"
								aria-hidden={true}
							/>
							<div className="flex flex-col">
								<span className="text-sm font-semibold font-poppins">
									{item.text}
								</span>
								<span className="text-sm text-orange-700 dark:text-orange-200">
									{item.description ?? ""}
								</span>
							</div>
						</Listbox.Option>
					))}
				</Listbox.Options>
			</SlideFade>
		</Listbox>
	);
};

export default memo(SmallSelect);
