import Spinner from "components/spinners/Spinner";
import { JSXInternal } from "preact/src/jsx";
import { classNames } from "utils/functions";

const styles: any = {
	gray: "text-gray-700 bg-white dark:bg-dark-800 border-gray-300 outline-none hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200",
	orange: "bg-orange-600 hover:bg-orange-700 text-white border-transparent",
	orangeLight: "text-orange-700 dark:text-orange-200 bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 border-transparent",
};

interface ButtonProps {
	children: any;
	style?: "gray" | "orange" | "orangeLight" | "";
	isLoading?: boolean;
	spinnerClasses?: string;
	ringColor?: string;
	className?: string;
}

export default function Button({
	children,
	ringColor = "",
	className = "",
	style = "",
	isLoading = false,
	spinnerClasses = "h-4 text-gray-100 fill-orange-400",
	...props
}: ButtonProps & JSXInternal.HTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			
			className={classNames(
				"inline-flex md:active:scale-95 active:scale-75 no-bad-scale justify-center relative items-center px-4 py-2 text-base font-medium rounded-md border shadow-sm duration-200 font-inter focus:outline-none sm:text-sm",
				style && (styles[style]),
				className,
				isLoading && "!text-transparent",
				ringColor !== ""
					? `focus:ring-2 focus:ring-offset-2 focus:ring-${ringColor}`
					: "ring-0 focus:ring-0"
			)}>
			{isLoading && (
				<Spinner className={`absolute w-auto ${spinnerClasses}`} />
			)}
			{children}
		</button>
	);
}