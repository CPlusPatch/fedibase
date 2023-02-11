/* eslint-disable @next/next/no-img-element */
import { IconX } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import { Entity } from "megalodon";
import { useState } from "react";

export default function PostImages({ status }: { status: Entity.Status }) {
	return (
		<>
			{status.media_attachments.length > 0 && (
				<div
					className={`grid gap-3 w-full mt-4 ${
						status.media_attachments.length === 2 && "grid-cols-2"
					} ${status.media_attachments.length > 2 && "grid-cols-3"}`}>
					{status.media_attachments.map(attachment => (
						<PostImage status={status} image={attachment} key={attachment.id} />
					))}
				</div>
			)}
		</>
	);
}

function PostImage({ status, image }: { status: Entity.Status; image: Entity.Attachment }) {
	const [revealed, setRevealed] = useState<boolean>(!status.sensitive);

	return (
		<div className="overflow-hidden relative">
			<img
				className={`filter duration-500 rounded ${revealed ? "":"filter blur-2xl"}`}
				src={image.preview_url}
				alt={image.description}
			/>
			{status.sensitive && !revealed && (
				<>
					<div
						onClick={() => {
							setRevealed(true);
						}}
						className="flex absolute inset-0 z-20 justify-center items-center text-lg font-bold text-white font-inter">
						{status.spoiler_text == ""
							? "Image marked as sensitive"
							: status.spoiler_text}
					</div>
				</>
			)}
			{status.sensitive && revealed && (
				<div className="absolute top-0 right-0">
					<Button
						style="gray"
						onClick={() => {
							setRevealed(false);
						}}
						className="px-1 py-1 mt-4 mr-4">
						<IconX className="w-8 h-8" />
					</Button>
				</div>
			)}
		</div>
	);
}