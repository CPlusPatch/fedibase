import { AuthContext } from "components/context/AuthContext";
import { Entity } from "megalodon";
import { useContext } from "preact/hooks";
import toast from "react-hot-toast";
import { classNames } from "utils/functions";

interface ReactionsProps {
	status: Entity.Status;
}

interface ReactionProps {
	status: Entity.Status;
	reaction: Entity.Reaction;
}

export function Reactions(props: ReactionsProps) {
	return (
		<div className="w-full flex flex-row gap-2 mt-2">
			{props.status.emoji_reactions.map(reaction => (
				<Reaction reaction={reaction} status={props.status} />
			))}
		</div>
	);
}

export function Reaction(props: ReactionProps) {
	const client = useContext(AuthContext);

	return (
		<button
			onClick={e => {
				if (props.reaction.me) return toast.error("Already reacted to this!");

				client
					?.createEmojiReaction(props.status.id, props.reaction.name)
					.then(res => {
						toast.success("Added reaction!");
						props.reaction.me = true;
					})
					.catch(err => {
						console.error(err);
						toast.error("Couldn't add that reaction :(");
					});
			}}
			className={classNames(
				"text-lg flex items-center dark:text-gray-200 gap-x-2 rounded duration-200 justify-center bg-orange-400/40 dark:bg-orange-800/40 px-3 py-1",
				props.reaction.me && "bg-orange-700/40 dark:bg-orange-300/40 cursor-not-allowed",
				!props.reaction.me && "no-bad-scale hover:scale-95",
			)}>
			{(props.reaction as any).url ? (
				<img
					loading="lazy"
					src={(props.reaction as any).url}
					className="w-[1em] h-[1em]"
					alt={`Emoji reaction ${props.reaction.name}`}
				/>
			) : (
				<span>{props.reaction.name}</span>
			)}
			{props.reaction.count}
		</button>
	);
}
