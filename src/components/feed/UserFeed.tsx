import { AuthContext } from "components/context/AuthContext";
import UserProfile from "components/profile/UserProfile";
import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity, Response } from "megalodon";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Feed, { FeedType } from "./Feed";

export const UserFeed = ({ account }: { account: Entity.Account }) => {
	const [posts, setPosts] = useState<Entity.Status[]>([]);
	const client = useContext(AuthContext);
	const postsRef = useRef(posts);

	return (
		<>
			{account && (
				<div className="flex flex-col w-full h-full">
					<div
						className="flex overflow-y-scroll flex-col gap-y-5 px-6 py-4 no-scroll">
						<UserProfile user={account} />
						<Feed<Entity.Status> type={FeedType.User} entityElement={Post} options={{
							id: account.id
						}}/>
					</div>
				</div>
			)}
		</>
	);
};