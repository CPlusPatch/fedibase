import { MutableRef } from "preact/hooks";
import { StatusType } from "./Status";
import { memo } from "preact/compat";

function DummyStatus({
	statusType = StatusType.Post,
	reference = undefined,
}: {
	statusType?: StatusType;
	reference?: MutableRef<any>;
}) {
	return (
		<>
			<div
				className="flex flex-col max-w-full font-inter cursor-pointer"
				aria-hidden={true}
				ref={reference}>
				<div className="flex flex-col min-w-0 grow gap-y-1">
					<div className="flex flex-row overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap w-full">
						<div
							className={`${
								statusType === StatusType.Post
									? "w-12 h-12"
									: "w-10 h-10"
							} mr-2 border border-gray-300 dark:border-gray-700 bg-gray-300 rounded dark:bg-gray-500/40 animate-pulse`}
						/>
						<div className={"flex flex-col grow justify-around"}>
							<h4
								className="bg-gray-300 rounded h-4 dark:bg-gray-500/40 animate-pulse"
								style={{
									width: `${Math.random() * 100 + 100}px`,
								}}></h4>
							<h5
								style={{
									width: `${Math.random() * 150 + 100}px`,
								}}
								className=" bg-gray-300 rounded h-4 dark:bg-gray-500/40 animate-pulse ml-0"></h5>
						</div>
						<div className="bg-gray-300 rounded w-12 h-4 dark:bg-gray-500/40 animate-pulse"></div>
					</div>
					<div className="flex flex-col gap-y-2">
						{/* Actual text */}

						<p
							className={
								"mt-1 w-full bg-gray-300 rounded h-5 dark:bg-gray-500/40 animate-pulse"
							}></p>
						<p
							className={
								"w-full bg-gray-300 rounded h-5 dark:bg-gray-500/40 animate-pulse"
							}></p>
						<p
							style={{
								width: `${Math.random() * 100}%`,
							}}
							className={
								"bg-gray-300 rounded h-5 dark:bg-gray-500/40 animate-pulse"
							}></p>
					</div>
				</div>
			</div>
		</>
	);
}

export default memo(DummyStatus);
