import { MutableRef, useEffect, useState } from "preact/hooks";
import { StatusType } from "./Status";

export default function DummyStatus({
	type = "post",
	reference = undefined,
}: {
	type: "post" | "notification";
	reference?: MutableRef<any>;
}) {
	const [random, setRandom] = useState<number>(0);

	useEffect(() => {
		setRandom(Math.random());
	}, []);
	return (
		<li className="flex flex-col max-w-full" aria-hidden={true} ref={reference}>
			<div className="flex flex-row max-w-full">
				<div className="flex flex-col min-w-0 grow gap-y-2">
					<div className="gap-x-2 text-[0.95rem] flex flex-row justify-between">
						<div className="flex flex-row">
							<div className="flex-shrink-0 mr-2">
								<div
									className={`${
										type == StatusType.Post ? "w-12 h-12" : "w-10 h-10"
									} overflow-hidden rounded border border-gray-300 dark:border-gray-700 bg-gray-300 animate-pulse dark:text-gray-200 dark:bg-gray-500/40 `}
								/>
							</div>
							<span className="flex overflow-hidden flex-col whitespace-nowrap md:inline text-ellipsis justif-between">
								<h4
									style={{
										width: `${random * 100 + 100}px`,
									}}
									className="mt-0.5 h-4 font-bold bg-gray-300 rounded animate-pulse dark:text-gray-200 dark:bg-gray-500/40"></h4>
								<h6
									style={{
										width: `${random * 150 + 100}px`,
									}}
									className="mt-2 overflow-hidden ml-0 w-12 h-4 text-gray-500 overflow-ellipsis rounded animate-pulse bg-gray-300 dark:text-gray-400 dark:bg-gray-500/40"></h6>
							</span>
						</div>
						<div className="whitespace-nowrap">
							<span className="text-sm text-gray-700 bg-gray-300 rounded inline-block w-12 h-4 dark:bg-gray-500/40 animate-pulse dark:text-gray-300 hover:underline"></span>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						<div className="w-full text-sm">
							<p
								className={"mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40"}></p>
							<p
								className={"mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40"}></p>
							<p
								style={{
									width: `${random * 100}%`,
								}}
								className={"mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40"}></p>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
}