import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import Feed, { FeedType } from "./Feed";

export const LocalFeed = () => {
	return (
		<div className="flex overflow-y-scroll flex-col gap-y-5 px-6 py-4 pb-20 w-full h-full no-scroll md:mt-10">
			<Feed<Entity.Status>
				onLoadNew={() => {
					//
				}}
				type={FeedType.Local}
				entityElement={Post}
				options={{
					id: "",
				}}
			/>
		</div>
	);
};
