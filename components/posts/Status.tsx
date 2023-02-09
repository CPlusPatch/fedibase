/* eslint-disable @next/next/no-img-element */
import { Entity } from "megalodon";
import { useRef, useState } from "react";

export default function Status({ status, type }: { status: Entity.Status, type: "notification" | "post" }) {
	const [expand, setExpand] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className="flex flex-row max-w-full">
			<div className="flex-shrink-0 mr-4">
				<img
					alt={status.account.acct}
					src={status.account.avatar}
					className={`${
						type == "post" ? "w-16" : "w-10"
					} text-gray-300 h-auto bg-white rounded border border-gray-300`}
				/>
			</div>
			<div className="flex flex-col min-w-0 grow">
				<div className="flex flex-col gap-x-2 md:items-center md:flex-row">
					<h4 className="flex-shrink text-lg font-bold">{status.account.username}</h4>
					<h6
						title={status.account.acct}
						className="overflow-hidden text-gray-500 overflow-ellipsis text-md">
						{status.account.acct}
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
				<div
					className={`grid gap-3 w-full ${
						status.media_attachments.length === 2 && "grid-cols-2"
					} ${status.media_attachments.length > 2 && "grid-cols-3"}`}>
					{status.media_attachments.map(attachment => (
						<img
							className="rounded"
							key={attachment.id}
							src={attachment.preview_url}
							alt={attachment.description}
						/>
					))}
				</div>
			</div>
		</div>
	);
}