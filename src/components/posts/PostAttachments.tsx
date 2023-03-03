import { IconX } from "@tabler/icons-preact";
import Button from "components/buttons/Button";
import { Entity } from "megalodon";
import { useState } from "preact/hooks";

/**
 * Images of a Status (extracted for modularity)
 * @returns 
 */
export default function PostAttachments({ status }: { status: Entity.Status }) {
	return (
		<>
			{status.media_attachments.length > 0 && (
				<div
					className={`grid gap-3 w-full h-full${
						status.media_attachments.length === 2 && "grid-cols-2"
					} ${status.media_attachments.length > 2 && "grid-cols-3"}`}>
					{status.media_attachments.map(attachment => (
						<PostAttachment status={status} image={attachment} key={attachment.id} />
					))}
				</div>
			)}
		</>
	);
}

function PostAttachment({ status, image }: { status: Entity.Status; image: Entity.Attachment }) {
	const [revealed, setRevealed] = useState<boolean>(!status.sensitive);

	return (
		<div className="relative rounded grow-0 mx-auto overflow-hidden flex items-center">
			{image.type == "image" && (
				<img
					loading="lazy"
					className={`filter duration-500 rounded max-h-[80vh] ${
						revealed ? "" : "filter blur-2xl"
					}`}
					src={image.remote_url ?? ""}
					alt={image.description ?? ""}
				/>
			)}
			{image.type == "video" && (
				<video
					loading="lazy"
					className={`filter duration-500 object-contain h-full rounded ${
						revealed ? "" : "filter blur-2xl"
					}`}
					controls={true}
					src={image.remote_url ?? ""}
				/>
			)}
			{status.sensitive && !revealed && (
				<div
					aria-hidden={true}
					onClick={() => {
						setRevealed(true);
					}}
					className="flex absolute inset-0 z-20 justify-center p-3 items-center text-lg font-bold text-white font-inter">
					{status.spoiler_text == ""
						? "Image marked as sensitive"
						: status.spoiler_text}
				</div>
			)}
			{status.sensitive && revealed && (
				<Button
					style="gray"
					onClick={() => {
						setRevealed(false);
					}}
					className="!px-1 !py-1 mt-2 mr-2 !absolute top-0 right-0 !bg-opacity-70">
					<IconX aria-hidden={true} className="w-4 h-4" />
					<span className="sr-only">Hide this image</span>
				</Button>
			)}
		</div>
	);
}