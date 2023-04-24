<script lang="ts">
import { IconHandStop } from "@tabler/icons-vue";
import { store } from "../../utils/store";
import DummyStatus from "../status/DummyStatus.vue";
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
		id?: string;
	}>(),
	{
		mode: "all",
		id: "",
	}
);

const entities = ref([]);

const DEFAULT_LOAD = 20;
const loading = ref(false);
const reachedEnd = ref<boolean>(false);

const interval = window.setInterval(async () => {
	const latestEntities = await getEntitiesSinceId(
		(entities.value[0] as any).id
	);
	entities.value = [...latestEntities, ...entities.value] as any;

	/* if (props.type === FeedType.Notifications) latestEntities.map((entity: Entity.Notification) => {
		addNotification(entity, NotificationType.NewMention)
	}) */
}, 15000);

const getEntitiesSinceId = async (sinceId: string) => {
	if (loading.value) return;
	if (!store.client?.getLocalTimeline) return;
	loading.value = true;
	let res;
	switch (props.type) {
		case FeedType.Home: {
			res = (await store.client?.getHomeTimeline({
				limit: DEFAULT_LOAD,
				since_id: sinceId,
			})) as any;
			break;
		}
		case FeedType.User: {
			if (!props.id)
				throw new Error("Feed needs a user ID to work in user mode!");
			res = (await store.client?.getAccountStatuses(props.id, {
				limit: DEFAULT_LOAD,
				since_id: sinceId,
			})) as any;
			break;
		}

		case FeedType.Notifications: {
			res = (await store.client?.getNotifications({
				limit: DEFAULT_LOAD,
				since_id: sinceId,
			})) as any;
			break;
		}

		case FeedType.Local: {
			res = (await store.client?.getLocalTimeline({
				limit: DEFAULT_LOAD,
				since_id: sinceId,
			})) as any;
			break;
		}

		case FeedType.Federated: {
			res = (await store.client?.getPublicTimeline({
				limit: DEFAULT_LOAD,
				since_id: sinceId,
			})) as any;
			break;
		}
	}
	loading.value = false;
	return res.data;
};

const getEntitiesBeforeId = async (beforeId: string) => {
	let res;
	loading.value = true;

	switch (props.type) {
		case FeedType.Home: {
			res = (await store.client?.getHomeTimeline({
				limit: DEFAULT_LOAD,
				max_id: beforeId,
			})) as any;
			break;
		}
		case FeedType.User: {
			if (!props.id)
				throw new Error("Feed needs a user ID to work in user mode!");
			res = (await store.client?.getAccountStatuses(props.id, {
				limit: DEFAULT_LOAD,
				max_id: beforeId,
			})) as any;
			break;
		}
		case FeedType.Notifications: {
			res = (await store.client?.getNotifications({
				limit: DEFAULT_LOAD,
				max_id: beforeId,
			})) as any;
			break;
		}
		case FeedType.Local: {
			res = (await store.client?.getLocalTimeline({
				limit: DEFAULT_LOAD,
				max_id: beforeId,
			})) as any;
			break;
		}
		case FeedType.Federated: {
			res = (await store.client?.getPublicTimeline({
				limit: DEFAULT_LOAD,
				max_id: beforeId,
			})) as any;
			break;
		}
	}

	if (res.data.length === 0) reachedEnd.value = true;

	loading.value = false;
	return res.data;
};

const loadMoreEntities = async () => {
	if (loading.value) return false;
	if (reachedEnd.value) return false;
	const beforeId = (entities.value[entities.value.length - 1] as any).id;

	const newEntities = await getEntitiesBeforeId(beforeId);

	entities.value = [...entities.value, ...newEntities] as any;

	if (props.type === FeedType.Home) store.savedFeed = entities.value;
};

onMounted(async () => {
	if (loading.value) return;

	entities.value = [
		...(await getEntitiesSinceId("")),
		...entities.value,
	] as any;
});

onUnmounted(() => {
	window.clearInterval(interval);
});
</script>

<template>
	<template v-if="entities.length > 0 && type !== FeedType.Notifications">
		<Post
			v-for="entity of entities"
			:key="(entity as any).id"
			:status="entity"
			:interaction="true" />
	</template>
	<template v-if="entities.length > 0 && type === FeedType.Notifications">
		<Notification
			v-for="entity of entities.filter(e => {
				switch (props.mode) {
					case 'all':
						return true;
					case 'reblogs':
						return (
							(e as Entity.Notification).type === 'reblog'
						);
					case 'mention':
						return (
							(e as Entity.Notification).type ===
							'mention'
						);
					case 'favourites':
						return (
							(e as Entity.Notification).type ===
							'favourite'
						);
				}
			})"
			:key="(entity as any).id"
			:notification="entity" />
	</template>

	<div
		v-if="entities.length === 0 && !reachedEnd"
		class="grow w-full h-full flex items-center justify-center">
		<!-- <img src="/images/icons/logo.svg" class="w-20 h-20 animate-hithere" /> -->
		<Spinner class="w-10 h-10" />
	</div>

	<DummyStatus
		v-if="!loading && !reachedEnd && entities.length > 0"
		v-is-visible="loadMoreEntities" />
	<DummyStatus v-if="!reachedEnd && entities.length > 0" />
	<DummyStatus v-if="!reachedEnd && entities.length > 0" />
	<!-- Only show 3 dummy statuses once posts are loaded to prevent the user from scrolling too far
		down and loading posts infinitely without seeing them -->
	<div v-if="reachedEnd" class="flex justify-center">
		<div class="mx-4 flex flex-col dark:text-gray-300 items-center gap-y-3">
			<IconHandStop class="w-10 h-10" />
			<span>No more posts!</span>
			<span>You've reached the end of this timeline</span>
		</div>
	</div>
</template>
