import { memo } from "preact/compat";
import { JSXInternal } from "preact/src/jsx";
import { classNames } from "utils/functions";

interface InputOptions {
	isLoading: boolean;
	children: any;
	name: string;
}

export const Input = memo(
	({
		isLoading,
		children,
		name,
		className = "",
		...props
	}: InputOptions & JSXInternal.HTMLAttributes<HTMLInputElement>) => {
		return (
			<div>
				{children}
				<div className="mt-1">
					<input
						name={name}
						disabled={isLoading}
						className={classNames(
							"block px-3 py-2 w-full placeholder-gray-400 bg-white rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none dark:text-gray-100 dark:bg-dark-800 disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm",
							className
						)}
						{...props}
					/>
				</div>
			</div>
		);
	}
);

export const Label = ({
	children,
	...labelProps
}: {
	children: any;
} & JSXInternal.HTMLAttributes<HTMLLabelElement>) => (
	<label
		{...labelProps}
		className="block text-sm font-medium text-gray-600 dark:text-gray-300">
		{children}
	</label>
);
