import { Entity } from "megalodon";

export default function EmojiRenderer({ string, emojis }: {
	string: string;
	emojis: Entity.Emoji[]
}) {
	const blocks = string.split(":");

	return (
		<>
			{blocks.map(block => {
				let html = <>{block}</>;
				emojis.map((emoji, index) => {
					if (block == emoji.shortcode) {
						html = (
							<img src={emoji.url} alt="" key={index} className="h-[1em] inline" />
						);
					}
				});
				return <>{html}</>;
			})}
		</>
	);
}