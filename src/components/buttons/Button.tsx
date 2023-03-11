import Spinner from "components/spinners/Spinner";
import { memo } from "preact/compat";
import { JSXInternal } from "preact/src/jsx";
import { classNames } from "utils/functions";

const themes: any = {
	gray: "dark:text-gray-200 bg-gray-100 text-black dark:bg-dark-800 dark:border-gray-600 outline-none hover:scale-105",
	orange: "bg-orange-600 hover:bg-orange-700 text-white border-transparent",
	orangeLight:
		"text-orange-700 dark:text-orange-200 bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 border-transparent",
};

interface ButtonProps {
	className?: string;
	children: any;
	ringColor?: string;
	theme?: "gray" | "orange" | "orangeLight" | null;
	loading?: boolean;
	spinnerClasses?: string;
}

export const Button = memo(({
	className = "",
	children,
	ringColor = "",
	theme = null,
	loading = false,
	spinnerClasses = "h-4 text-gray-100 fill-orange-400",
	...props
}: ButtonProps &
	Omit<JSXInternal.HTMLAttributes<HTMLButtonElement>, "loading">) => (
	<button
		{...props}
		className={classNames(
			"inline-flex justify-center relative ease-in-out items-center no-bad-scale px-4 py-2 text-base font-medium rounded-md border shadow-sm duration-200 font-inter focus:outline-none sm:text-sm",
			theme && themes[theme],
			className,
			loading && "!text-transparent",
			ringColor !== ""
				? `focus:ring-2 focus:ring-offset-2 focus:ring-${ringColor}`
				: "ring-0 focus:ring-0"
		)}
		disabled={props.disabled || loading}>
		{loading && <Spinner className={`absolute w-auto ${spinnerClasses}`} />}
		{children}
	</button>
));
