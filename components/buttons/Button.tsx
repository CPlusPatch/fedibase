import Spinner from "components/spinners/Spinner";
import { classNames } from "utils/functions";

const styles = {
	gray: "text-gray-700 bg-white border-gray-300 outline-none hover:bg-gray-50",
	orange: "bg-orange-600 hover:bg-orange-700 text-white border-transparent",
};

export default function Button({
	className = "",
	children,
	ringColor = "",
	style = "",
	isLoading = false,
	spinnerClasses = "h-4 text-gray-100 fill-orange-400",
	...props
}) {
	return (
		<button
			{...props}
			className={classNames(
				"inline-flex  justify-center relative items-center px-4 py-2 text-base font-medium rounded-md border shadow-sm duration-200 font-inter focus:outline-none sm:text-sm",
				style && styles[style],
				className,
				isLoading && "text-transparent",
				ringColor !== ""
					? `focus:ring-2 focus:ring-offset-2 focus:ring-${ringColor}`
					: "ring-0 focus:ring-0",
			)}>
			{isLoading && <Spinner className={`absolute w-auto ${spinnerClasses}`} />}
			{children}
		</button>
	);
}