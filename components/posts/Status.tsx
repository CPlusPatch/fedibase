/* eslint-disable @next/next/no-img-element */
import Button from "components/buttons/Button";
import { Entity } from "megalodon";
import Link from "next/link";
import { useRef, useState } from "react";
import { X } from "react-bootstrap-icons";

export default function Status({
	status,
	type,
}: {
	status: Entity.Status;
	type: "notification" | "post";
}) {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className="flex flex-row max-w-full">
			<Link href={`/users/@${status.account.id}`} className="flex-shrink-0 mr-4">
				<img
					alt={status.account.acct}
					src={status.account.avatar}
					className={`${
						type == "post" ? "w-16 h-16" : "w-10 h-10"
					} text-gray-300 bg-white rounded border border-gray-300`}
				/>
			</Link>
			<div className="flex flex-col min-w-0 grow">
				<div className="flex flex-col gap-x-2 md:items-center md:flex-row">
					<h4 className="flex-shrink text-lg font-bold">{status.account.username}</h4>
					<h6
						title={status.account.acct}
						className="overflow-hidden text-gray-500 overflow-ellipsis text-md">
						@{status.account.acct}
					</h6>
				</div>
				<div className="flex flex-col gap-y-1">
					<div
						className="w-full"
						style={{
							maskSize: "auto 8em auto auto",
							maskPosition: "0 0,0 0",
							maskRepeat: "repeat-x,repeat",
							maskImage:
								expand || textRef?.current?.offsetHeight < 128
									? ""
									: "linear-gradient(to bottom, white 2em, transparent 8em)",
							maskComposite: "excluse",
							overflow: expand ? "" : "hidden",
							maxHeight: expand ? "" : "8rem",
						}}>
						<p
							ref={textRef}
							className="mt-1"
							dangerouslySetInnerHTML={{ __html: status.content }}></p>
					</div>
					{textRef?.current?.offsetHeight > 128 && (
						<>
							<hr />
							<button
								className="mx-auto w-full text-blue-800 hover:underline"
								onClick={() => {
									setExpand(!expand);
								}}>
								{expand === true ? "Less" : "More"}
							</button>
						</>
					)}
				</div>
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
			</div>
		</div>
	);
}

function PostImage({ status, image }: { status: Entity.Status; image: Entity.Attachment }) {
	const [revealed, setRevealed] = useState<boolean>(!status.sensitive);

	return (
		<div className="overflow-hidden relative rounded">
			<img className={`filter duration-500 ${revealed ? "":"filter blur-2xl"}`} src={image.preview_url} alt={image.description} />
			{status.sensitive && !revealed && (
				<>
					<div
						onClick={() => {
							setRevealed(true);
						}}
						className="flex absolute inset-0 z-20 justify-center items-center text-lg font-bold text-white font-inter">
						{status.spoiler_text}
					</div>
				</>
			)}
			{status.sensitive && revealed && (
				<div className="absolute top-0 right-0">
					<Button style="gray" onClick={() => {
						setRevealed(false);
					}} className="px-1 py-1 mt-4 mr-4">
						<X className="w-8 h-8" />
					</Button>
				</div>
			)}
		</div>
	);
}
