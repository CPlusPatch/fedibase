import UserProfile from "components/profile/UserProfile";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import Feed, { FeedType } from "./Feed";

export const UserFeed = ({ account }: { account: Entity.Account }) => {
	return (
		<>
			{account && (
				<div className="flex overflow-y-scroll w-full h-full flex-col gap-y-5 px-6 py-4 no-scroll">
					<UserProfile user={account} />
					<Feed<Entity.Status>
						type={FeedType.User}
						onLoadNew={() => {
							//
						}}
						entityElement={Post}
						options={{
							id: account.id,
						}}
					/>
				</div>
			)}
		</>
	);
};