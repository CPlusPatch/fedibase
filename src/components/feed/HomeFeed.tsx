import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import Feed, { FeedType } from "./Feed";

export const HomeFeed = () => {
	return (
		<>
			<div className="flex overflow-y-scroll flex-col gap-y-5 px-6 py-4 pb-20 w-full h-full no-scroll md:mt-10">
				<Feed<Entity.Status>
					type={FeedType.Home}
					entityElement={Post}
					options={{
						id: "",
					}}
				/>
			</div>
		</>
	);
};
