import { Post } from "components/scroll/InfiniteScrollPosts";
import { Entity } from "megalodon";
import Feed, { FeedType } from "./Feed";
import { memo } from "preact/compat";

export const HomeFeed = memo(() => {
	return (
		<>
			<div className="flex overflow-y-scroll overflow-x-hidden flex-col gap-y-6 px-6 py-4 pb-20 w-full h-full no-scroll mt-10">
				<Feed<Entity.Status>
					onLoadNew={() => {
						//
					}}
					type={FeedType.Home}
					entityElement={Post}
					options={{
						id: "",
					}}
				/>
			</div>
		</>
	);
});
