import Spinner from "components/spinners/Spinner";
import { isEmpty } from "utils/functions";

/**
 * Shows expanding spinner if given variable is an empty list or object
 * @param variable Variable to check if empty
 * @returns 
 */
export default function WithLoader({ variable, children }: {
	variable: any;
	children: any;
}) {
	return (
		<>
			{isEmpty(variable) ? (
				<div className="flex justify-center items-center w-full h-full grow">
					<Spinner className="w-10 h-10 text-gray-400 fill-orange-600" />
				</div>
			) : (
				children
			)}
		</>
	);
}