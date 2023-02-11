import { IconMessage, IconMoodHappy, IconQuote, IconRocket, IconStar, IconStarFilled } from "@tabler/icons-react";
import { AuthContext } from "components/context/AuthContext";
import { Entity } from "megalodon";
import { useContext, useState } from "react";

export default function InteractionBar({ status }: { status: Entity.Status }) {
	const client = useContext(AuthContext);
	const [favourited, setFavourited] = useState<boolean>(status.favourited);
	
	return (
		<div className="grid grid-cols-5 justify-around px-5 mt-3 w-full text-gray-700">
			<InteractionBarIcon>
				<IconMessage className="w-5 h-5" />
			</InteractionBarIcon>

			<InteractionBarIcon
				onClick={() => {
					if (favourited) {
						client.unfavouriteStatus(status.id);
					} else if (!favourited) {
						client.favouriteStatus(status.id);
					}

					setFavourited(f => !f);
				}}>
				{favourited ? (
					<IconStarFilled className="w-5 h-5 text-yellow-400" />
				) : (
					<IconStar className="w-5 h-5" />
				)}
			</InteractionBarIcon>

			<InteractionBarIcon>
				<IconRocket className="w-5 h-5" />
			</InteractionBarIcon>

			<InteractionBarIcon>
				<IconMoodHappy className="w-5 h-5" />
			</InteractionBarIcon>

			<InteractionBarIcon>
				<IconQuote className="w-5 h-5" />
			</InteractionBarIcon>
		</div>
	);
}

function InteractionBarIcon({ children, onClick = () => {} }) {
	return (
		<button className="flex justify-center" onClick={onClick}>
			{children}
		</button>
	);
}