import { classNames } from "utils/functions";

export function Input({ isLoading, children, name, type = "text",id = undefined, className = "", ...props }) {
	return (
		<div>
			{children}
			<div className="mt-1">
				<input
					id={id}
					name={name}
					disabled={isLoading}
					type={type}
					className={classNames("block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm", className)}
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