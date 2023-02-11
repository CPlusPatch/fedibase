/* eslint-disable @next/next/no-img-element */
export default function UserProfile({ user }: { user: Entity.Account }) {
	return (
		<div className="flex flex-col gap-y-4 p-3 w-full border-b-2">
			<div className="relative w-full">
				<div className="flex overflow-hidden justify-center items-center w-full h-44 bg-gray-200 rounded border">
					<img src={user.header} className="w-full" alt="" />
				</div>
				<img
					className="absolute -bottom-5 left-5 w-20 h-20 rounded border"
					src={user.avatar}
					alt={user.acct}
				/>
			</div>
			<div className="flex flex-row gap-x-4 px-4 mt-4 w-full">
				<div className="flex flex-row gap-x-2 items-center">
					<h4 className="flex-shrink text-xl font-bold font-poppins">
						{user.display_name}
					</h4>
					<h6
						title={user.acct}
						className="overflow-hidden text-gray-500 overflow-ellipsis font-inter">
						@{user.acct}
					</h6>
				</div>
			</div>
			<div
				className="p-3 w-full text-sm rounded-md border font-inter"
				dangerouslySetInnerHTML={{ __html: user.note }}></div>
		</div>
	);
}
