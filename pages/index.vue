<script setup lang="ts">
import Feed, { FeedType } from "~/components/feed/Feed.vue";
import { useStore } from "~/utils/store";

const store = useStore();
</script>

<template>
	<FeedWrapper>
		<Feed
			:type="FeedType.Home"
			:retrieve-results="
				async (limit, since_id, max_id) => {
					return (
						(
							await store.client?.getHomeTimeline({
								limit,
								since_id,
								max_id,
							})
						)?.data ?? []
					);
				}
			" />
	</FeedWrapper>
</template>
