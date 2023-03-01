import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "react-hot-toast";
import { withEmojis } from "utils/functions";
import ProfileActionsDropdown from "./ProfileActionsDropdown";

export default function UserProfile({ user }: { user: Entity.Account }) {
	const client = useContext(AuthContext);
	const [relationship, setRelationship] = useState<Entity.Relationship>();

	useEffect(() => {
		client?.getRelationship(user.id).then(res => {
			setRelationship(res.data);
		});
	}, []);

	return (
		<div className="flex flex-col gap-y-4 w-full">
			<div className="relative w-full">
				<div className="flex overflow-hidden justify-center items-center w-full h-44 bg-gray-200 rounded border dark:bg-dark-800 dark:border-gray-700">
					<img src={user.header} className="w-full" alt="" loading="lazy" />
				</div>
				<img
					loading="lazy"
					className="absolute -bottom-5 left-5 w-20 h-20 rounded border dark:border-gray-700"
					src={user.avatar}
					alt={user.acct}
				/>
			</div>
			<div className="flex flex-row gap-x-2 justify-between mt-4 w-full">
				<div className="flex flex-col gap-x-2 overflow-hidden text-ellipsis ml-4">
					<h4 className="flex-shrink text-xl font-bold font-poppins dark:text-white">
						{withEmojis(user.display_name, user.emojis)}
					</h4>
					<h6
						title={user.acct}
						className="text-sm text-gray-500 dark:text-gray-400 font-inter">
						@{user.acct}
					</h6>
				</div>
				<div className="flex items-center gap-x-1">
					<Button
						style="gray"
						className="!px-3 !py-2"
						onClick={() => {
							if (relationship?.requested) {
								toast.error("Follow request already pending");
							} else {
								if (!relationship?.following) {
									client
										?.followAccount(user.id)
										.then(res => {
											setRelationship(res.data);
										})
										.catch(err => {
											console.error(err);
											toast.error("Error following account");
										});
								} else {
									client
										?.unfollowAccount(user.id)
										.then(res => {
											setRelationship(res.data);
										})
										.catch(err => {
											console.error(err);
											toast.error("Error unfollowing account");
										});
								}
							}
						}}>
						{relationship?.requested && "Requested!"}
						{!relationship?.requested &&
							(relationship?.following ? "Unfollow" : "Follow")}
					</Button>
					{relationship && (
						<ProfileActionsDropdown user={user} initialRelationship={relationship} />
					)}
				</div>
			</div>
			<div className="p-3 w-full text-sm rounded-md border dark:border-gray-700 dark:text-gray-50 font-inter break-all">
				{withEmojis(user.note, user.emojis)}
			</div>
			<div className="w-full gap-y-2 md:gap-y-0 flex flex-col md:divide-y dark:divide-gray-700 text-sm rounded-md border dark:border-gray-700 dark:text-gray-50 font-inter">
				{user.fields.map(field => (
					<div className="flex px-3 md:flex-row gap-x-3 flex-col py-2">
						<div className="w-1/3 font-bold text-xs md:text-sm">{field.name}</div>
						<div dangerouslySetInnerHTML={{ __html: field.value }}></div>
					</div>
				))}
			</div>
		</div>
	);
}
