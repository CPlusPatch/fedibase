<script lang="ts">
import { useStore } from "../../utils/store";
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
const store = useStore();

const props = withDefaults(
	defineProps<{
		type: FeedType;
		mode?: string;
		id?: string;
	}>(),
	{
		mode: "all",
		id: "",
	}
);

const entities = ref<any[] | null>(null);

const DEFAULT_LOAD = 20;
const loading = ref(false);
const reachedEnd = ref(false);

const interval = window.setInterval(async () => {
	if (!entities.value) return;
	const latestEntities = await getEntities(
		(entities.value[0] as any)?.id ?? undefined,
		undefined
	);

	if (latestEntities.length === 0) return (reachedEnd.value = true);

	entities.value = [...latestEntities, ...entities.value];
}, 15000);

const getEntities = async (
	sinceId: string | undefined,
	beforeId: string | undefined
) => {
	if (loading.value) return;
	loading.value = true;

	let res: any = {
		data: [],
	};

	try {
		switch (props.type) {
			case FeedType.Home:
				res = await store.client?.getHomeTimeline({
					limit: DEFAULT_LOAD,
					since_id: sinceId,
					max_id: beforeId,
				});
				break;

			case FeedType.User:
				if (!props.id)
					throw new Error(
						"Feed needs a user ID to work in user mode!"
					);
				res = await store.client?.getAccountStatuses(props.id, {
					limit: DEFAULT_LOAD,
					since_id: sinceId,
					max_id: beforeId,
				});
				break;

			case FeedType.Notifications:
				res = await store.client?.getNotifications({
					limit: DEFAULT_LOAD,
					since_id: sinceId,
					max_id: beforeId,
				});
				break;

			case FeedType.Local:
				res = await store.client?.getLocalTimeline({
					limit: DEFAULT_LOAD,
					since_id: sinceId,
					max_id: beforeId,
				});
				break;

			case FeedType.Federated:
				res = await store.client?.getPublicTimeline({
					limit: DEFAULT_LOAD,
					since_id: sinceId,
					max_id: beforeId,
				});
				break;
		}
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}

	return res.data;
};

const loadMoreEntities = async () => {
	if (loading.value || reachedEnd.value) return false;

	const newEntities = await getEntities(
		undefined,
		entities.value
			? (entities.value[entities.value.length - 1] as any)?.id ?? ""
			: ""
	);

	if (entities.value === null && newEntities.length < 20)
		reachedEnd.value = true;
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
