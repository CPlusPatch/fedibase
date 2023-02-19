import { useEffect, useState } from "react";

export default function DummyStatus({ type = "post" }: { type: "post" | "notification" }) {
	const [random, setRandom] = useState<number>(0);

	useEffect(() => {
		setRandom(Math.random());
	}, []);
	return (
		<div className="flex flex-col max-w-full" aria-hidden={true}>
			<div className="flex flex-row max-w-full">
				<span className="flex-shrink-0 mr-4">
					<div
						className={`${
							type == "post" ? "w-14 h-14" : "w-8 h-8"
						} bg-gray-300 dark:bg-gray-500/40 animate-pulse rounded border border-gray-300 dark:border-gray-700 `}
					/>
				</span>
				<div className="flex flex-col min-w-0 grow">
					<div className="justify-between gap-x-2 text-[0.95rem] flex flex-row">
						<span className="flex overflow-hidden flex-col gap-y-1 whitespace-nowrap md:inline text-ellipsis">
							<h4
								style={{
									width: `${random * 100 + 100}px`,
								}}
								className="inline-block h-4 font-bold bg-gray-300 rounded animate-pulse dark:text-gray-200 dark:bg-gray-500/40"></h4>
							<h6
								style={{
									width: `${random * 150 + 100}px`,
								}}
								className="inline-block overflow-hidden ml-0 w-12 h-4 text-gray-500 overflow-ellipsis rounded animate-pulse bg-gray-v dark:text-gray-400 md:ml-2 dark:bg-gray-500/40"></h6>
						</span>
						<div className="whitespace-nowrap">
							<span className="inline-block w-12 h-4 text-sm text-gray-700 bg-gray-300 rounded animate-pulse dark:text-gray-300 hover:underline dark:bg-gray-500/40"></span>
						</div>
					</div>
					<div className="flex flex-col gap-y-1">
						<div className="relative w-full text-sm">
							<p
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
							<p
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
							<p
								style={{
									width: `${random * 100}%`,
								}}
								className={`mt-1 h-5 bg-gray-300 rounded duration-200 animate-pulse status-text dark:bg-gray-700/40`}></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}