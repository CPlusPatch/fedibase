<script lang="ts">
export enum FeedType {
	Home,
	User,
	Notifications,
	Local,
	Federated,
}
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { store } from "../../utils/store";
import DummyStatus from "../status/DummyStatus.vue";
import Post from "./Post.vue";
import Notification from "../notifications/Notification.vue";
import { IconHandStop } from "@tabler/icons-vue";
import { NavigationGuard, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

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
	const latestEntities = await getEntitiesSinceId((entities.value[0] as any).id);
	entities.value = [...latestEntities, ...entities.value] as any;

	/* if (props.type === FeedType.Notifications) latestEntities.map((entity: Entity.Notification) => {
		addNotification(entity, NotificationType.NewMention)
	}) */
}, 15000);

const getEntitiesSinceId = async (since_id: string) => {
	if (loading.value) return;
	loading.value = true;
	let res;
	switch (props.type) {
		case FeedType.Home: {
			res = (await store.client?.getHomeTimeline({
				limit: DEFAULT_LOAD,
				since_id: since_id,
			})) as any;
			break;
		}
		case FeedType.User: {
			if (!props.id)
				throw Error("Feed needs a user ID to work in user mode!");
			res = (await store.client?.getAccountStatuses(props.id, {
				limit: DEFAULT_LOAD,
				since_id: since_id,
			})) as any;
			break;
		}

		case FeedType.Notifications: {
			res = (await store.client?.getNotifications({
				limit: DEFAULT_LOAD,
				since_id: since_id,
			})) as any;
			break;
		}

		case FeedType.Local: {
			res = (await store.client?.getLocalTimeline({
				limit: DEFAULT_LOAD,
				since_id: since_id,
			})) as any;
			break;
		}

		case FeedType.Federated: {
			res = (await store.client?.getPublicTimeline({
				limit: DEFAULT_LOAD,
				since_id: since_id,
			})) as any;
			break;
		}
	}
	loading.value = false;
	return res.data;
};

const getEntitiesBeforeId = async (before_id: string) => {
	let res;
	loading.value = true;

	switch (props.type) {
		case FeedType.Home: {
			res = (await store.client?.getHomeTimeline({
				limit: DEFAULT_LOAD,
				max_id: before_id
			})) as any;
			break;
		}
		case FeedType.User: {
			if (!props.id)
				throw Error("Feed needs a user ID to work in user mode!");
			res = (await store.client?.getAccountStatuses(props.id, {
				limit: DEFAULT_LOAD,
				max_id: before_id,
			})) as any;
			break;
		}
		case FeedType.Notifications: {
			res = (await store.client?.getNotifications({
				limit: DEFAULT_LOAD,
				max_id: before_id,
			})) as any;
			break;
		}
		case FeedType.Local: {
			res = (await store.client?.getLocalTimeline({
				limit: DEFAULT_LOAD,
				max_id: before_id,
			})) as any;
			break;
		}
		case FeedType.Federated: {
			res = (await store.client?.getPublicTimeline({
				limit: DEFAULT_LOAD,
				max_id: before_id,
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
	const before_id = (entities.value[entities.value.length - 1] as any).id;

	const newEntities = (await getEntitiesBeforeId(before_id));	

	/* if (props.type === FeedType.Home) {
		store.beforeId = (newEntities[newEntities.length - 1] as any).id;
		console.log(store.beforeId)
	} */

	entities.value = [
		...entities.value,
		...newEntities,
	] as any;

	store.savedFeed = entities.value;
};

const onScroll = () => {
	store.feedScroll = document.getElementById("homefeed")?.scrollTop ?? 0;
}

onMounted(async () => {
	document.getElementById("homefeed")?.addEventListener("scroll", onScroll, {
		passive: true,
		capture: true
	});
	if (loading.value) return;
	let id = ""

	if (props.type === FeedType.Home) {
		if (store.savedFeed && store.savedFeed.length > 0) {
			entities.value = store.savedFeed as any;
			id = store.savedFeed[0].id;
		} else {
			store.savedFeed = []
		}
	}

	entities.value = [
		...await getEntitiesSinceId(id),
		...entities.value
	] as any;
	if (store.feedScroll && document.getElementById("homefeed")) document.getElementById("homefeed")!.scrollTop = store.feedScroll;
});

onUnmounted(() => {
	document.getElementById("homefeed")?.removeEventListener("scroll", onScroll);
	window.clearInterval(interval);
});
</script>

<template>
	<template
		v-if="entities.length > 0 && type !== FeedType.Notifications"
		v-for="entity of entities"
		:key="entity.id">
		<Post :status="entity" :interaction="true" />
	</template>
	<template
		v-if="entities.length > 0 && type === FeedType.Notifications"
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
		:key="entity.id">
		<Notification :notification="entity" />
	</template>
	<DummyStatus
		v-if="!loading && !reachedEnd"
		v-is-visible="loadMoreEntities" />
	<DummyStatus v-if="!reachedEnd" />
	<DummyStatus v-if="!reachedEnd" />
	<DummyStatus v-if="!reachedEnd" />
	<DummyStatus v-if="!reachedEnd" />
	<DummyStatus v-if="!reachedEnd" />
	<div v-if="reachedEnd" class="flex justify-center">
		<div class="mx-4 flex flex-col dark:text-gray-300 items-center gap-y-3">
			<IconHandStop class="w-10 h-10" />
			<span>No more posts!</span>
			<span>You've reached the end of this timeline</span>
		</div>
	</div>
</template>
