import Button from "components/buttons/Button";
import { Dispatch, SetStateAction } from "react";
import { withEmojis } from "utils/functions";

export default function SensitiveTextSpoiler({
	status,
	showText,
	setShowText,
}: {
	status: Entity.Status;
	showText: boolean;
	setShowText: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<>
			{status.sensitive && (
				<div className="flex gap-x-2 items-center font-bold dark:text-gray-100">
					{status.spoiler_text == "" ? "Marked as sensitive" : withEmojis(status.spoiler_text, status.emojis)}

					<Button
						style="gray"
						className="!py-1 !px-2"
						onClick={() => {
							setShowText(t => !t);
						}}>
						{showText ? "Hide" : "Show"}
					</Button>
				</div>
			)}
		</>
	);
}
