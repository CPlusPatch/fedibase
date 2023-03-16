<script lang="ts">
export enum FeedType {
	Home,
	User,
	Notifications,
	Local
}
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { store } from '../../utils/store';
import DummyStatus from '../status/DummyStatus.vue';
import Post from './Post.vue';
import Notification from '../notifications/Notification.vue';

const props = withDefaults(defineProps<{
	type: FeedType,
	mode?: string,
	id?: string,
}>(), {
	mode: "all",
	id: "",
});

const entities = ref([]);


const DEFAULT_LOAD = 20;
const loading = ref(false);

const interval = window.setInterval(async () => {
	const latestEntities = await getNewEntities((entities.value[0] as any).id)
	entities.value = [
		...latestEntities,
		...entities.value
	] as any
}, 15000)

const getNewEntities = async (since_id: string) => {
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
				throw Error(
					"Feed needs a user ID to work in user mode!"
				);
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
	}
	loading.value = false;
	return res.data;
}

const getMoreEntities = async (before_id: string) => {
	let res;
	loading.value = true;

	switch (props.type) {
		case FeedType.Home: {
			res = (await store.client?.getHomeTimeline({
				limit: DEFAULT_LOAD,
				max_id: before_id,
			})) as any;
			break;
		}
		case FeedType.User: {
			if (!props.id)
				throw Error(
					"Feed needs a user ID to work in user mode!"
				);
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
	}

	loading.value = false;
	return res.data;
}

const loadMoreEntities = async () => {
	if (loading.value) return false;
	const before_id = (entities.value[entities.value.length - 1] as any).id;

	entities.value = [
		...entities.value,
		...await getMoreEntities(before_id)
	] as any
}

onMounted(async () => {
	entities.value = await getNewEntities("");
});

onUnmounted(() => {
	window.clearInterval(interval);
})
</script>

<template>
	<template v-if="entities.length > 0 && type === FeedType.Home" v-for="entity of entities" :key="entity.id">
		<Post :status="entity" :interaction="true" />
	</template>
	<template v-if="entities.length > 0 && type === FeedType.User" v-for="entity of entities" :key="entity.id">
		<Post :status="entity" :interaction="true" />
	</template>
	<template v-if="entities.length > 0 && type === FeedType.Notifications" v-for="entity of entities.filter(e => {
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
	})" :key="entity.id">
		<Notification :notification="entity" />
	</template>
	<DummyStatus v-if="!loading" v-is-visible="loadMoreEntities"/>
	<DummyStatus />
	<DummyStatus />
	<DummyStatus />
	<DummyStatus />
	<DummyStatus />
</template>