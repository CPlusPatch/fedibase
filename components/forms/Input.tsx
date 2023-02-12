import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { classNames } from "utils/functions";

interface InputOptions {
	isLoading: boolean;
	children: any;
	name: string;
}

export function Input({
	isLoading,
	children,
	name,
	className = "",
	...props
}: InputOptions & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
	return (
		<div>
			{children}
			<div className="mt-1">
				<input
					name={name}
					disabled={isLoading}
					className={classNames(
						"block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
}

export function Label({ children }) {
	return (
		<label htmlFor="name" className="block text-sm font-medium text-gray-600">
			{children}
		</label>
	);
}