<script lang="ts">
import Notification from "../notifications/Notification.vue";
import Post from "./Post.vue";
export enum FeedType {
	Home,
	User,
	Notifications,
	Local,
	Federated,
}
</script>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		type: FeedType;
		mode?: string;
		retrieveResults: (
			limit: number,
			since_id?: string,
			max_id?: string
		) => Promise<any[]>;
	}>(),
	{
		mode: "all",
		id: "",
	}
);

const entities = ref<any[] | null>(null);

// Load 20 entities every sync by default
const DEFAULT_LOAD = 20;
const loading = ref(false);
const reachedEnd = ref(false);

/**
 * Fetches new data every 15 seconds
 */
const interval = window.setInterval(async () => {
	if (!entities.value) return;
	const latestEntities = await getEntities(
		(entities.value[0] as any)?.id ?? undefined,
		undefined
	);

	entities.value = [...latestEntities, ...entities.value];
}, 15000);

/**
 * Retrieves feed elements (typically statuses) since an ID or before an ID
 * @param sinceId
 * @param beforeId
 */
const getEntities = async (
	sinceId: string | undefined,
	beforeId: string | undefined
) => {
	if (loading.value) return [];
	loading.value = true;

	let data = [];

	try {
		data = await props.retrieveResults(DEFAULT_LOAD, sinceId, beforeId);
	} catch {
		console.error("Error while fetching timeline");
	} finally {
		loading.value = false;
	}

	return data;
};

/**
 * Gets called when the user scrolls down to the end of the feed, loads new entities
 */
const loadMoreEntities = async () => {
	if (loading.value || reachedEnd.value) return false;

	const newEntities = await getEntities(
		undefined,
		entities.value
			? (entities.value[entities.value.length - 1] as any)?.id ?? ""
			: ""
	);

	if (newEntities.length === 0) {
		reachedEnd.value = true;
		console.log(newEntities);
	}
	entities.value = [...(entities.value ?? []), ...newEntities];
};

onUnmounted(() => {
	window.clearInterval(interval);
});
</script>

<template>
	<template v-if="entities && type !== FeedType.Notifications">
		<Post
			v-for="entity of entities"
			:key="(entity as any).id"
			v-memo="entity"
			:status="entity"
			:interaction="true" />
	</template>
	<template v-if="entities && type === FeedType.Notifications">
		<Notification
			v-for="entity of entities.filter((e: Entity.Notification) => {
				switch (props.mode) {
					case 'all':
						return true;
					case 'reblogs':
						return e.type === 'reblog';
					case 'mention':
						return e.type === 'mention';
					case 'favourites':
						return e.type === 'favourite';
				}
			})"
			:key="(entity as any).id"
			:notification="entity" />
	</template>

	<template v-if="!reachedEnd">
		<StatusDummyStatus
			v-if="entities?.length !== 0"
			v-is-visible="loadMoreEntities" />
		<StatusDummyStatus v-if="entities?.length !== 0" />
		<StatusDummyStatus v-if="!entities" />
		<StatusDummyStatus v-if="!entities" />
		<StatusDummyStatus v-if="!entities" />
		<StatusDummyStatus v-if="!entities" />
	</template>

	<div
		v-if="entities?.length === 0"
		class="flex justify-center grow items-center text-gray-300 dark:text-gray-600">
		No posts to show
	</div>

	<div
		v-if="reachedEnd && entities && entities.length > 0"
		class="flex justify-center text-gray-300 dark:text-gray-600">
		No more posts
	</div>
</template>
