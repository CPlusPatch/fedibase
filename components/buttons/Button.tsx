import Spinner from "components/spinners/Spinner";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { classNames } from "utils/functions";

const styles = {
	gray: "text-gray-700 bg-white bg-dark border-gray-300 outline-none hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200",
	orange: "bg-orange-600 hover:bg-orange-700 text-white border-transparent",
	orangeLight: "text-orange-700 dark:text-orange-200 bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 border-transparent",
};

interface ButtonProps {
	children: any;
	style?: any;
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
}: ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={classNames(
				"inline-flex  justify-center relative items-center px-4 py-2 text-base font-medium rounded-md border shadow-sm duration-200 font-inter focus:outline-none sm:text-sm",
				style && styles[style],
				className,
				isLoading && "!text-transparent",
				ringColor !== ""
					? `focus:ring-2 focus:ring-offset-2 focus:ring-${ringColor}`
					: "ring-0 focus:ring-0",
			)}>
			{isLoading && <Spinner className={`absolute w-auto ${spinnerClasses}`} />}
			{children}
		</button>
	);
}