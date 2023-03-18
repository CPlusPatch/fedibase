<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { store } from '../../utils/store';
import Status, { PostType } from '../status/Status.vue';
import DummyStatus from '../status/DummyStatus.vue';
import { IconX } from '@tabler/icons-vue';
import ConversationChildPost from '../status/ConversationChildPost.vue';

const props = withDefaults(defineProps<{
	id: string,
	title?: boolean,
	closeButton?: boolean,
	onClose?: () => void,
	type?: PostType
}>(), {
	title: true,
	onClose: () => { },
	closeButton: false,
	type: PostType.Normal
})

let ancestors = ref<Entity.Status[]>([]);
let post = ref<Entity.Status | null>(null);
let descendants = ref<Entity.Status[]>([]);

// Finds all the parent elements of a post in a list of statuses
function findParentElements(array: Entity.Status[], elementId: string) {
	const parentElements = [];
	let currentElement = array.find(
		element => element.id === elementId
	);

	while (currentElement && currentElement.in_reply_to_id !== "") {
		parentElements.push(currentElement);
		currentElement = array.find(
			element => element.id === currentElement?.in_reply_to_id
		);
	}
	return parentElements;
}

store.client?.getStatus(props.id).then(res => {
	post.value = res.data;

	store.client?.getStatusContext(props.id).then(res => {
		if (!post.value) return;

		ancestors.value = findParentElements([...res.data.ancestors, post.value], post.value.id).reverse().slice(0, -1); // Slice because it includes the post, so remove last element
		descendants.value = res.data.descendants;
	})
});

onUnmounted(() => {
	post.value = null;
	ancestors.value = [];
	descendants.value = [];
})
</script>

<template>
	<div class="flex justify-between px-5 py-4" v-if="title">
		<h3 class="text-xl font-bold dark:text-gray-50">
			Conversation
		</h3>
		<button class="flex items-center justify-center" @click="onClose" title="Close conversation">
			<IconX v-if="closeButton" class="w-5 h-5 dark:text-gray-50" />
		</button>
	</div>

	<div v-if="post" class="flex overflow-y-scroll flex-col gap-y-5 py-4 w-full h-full no-scroll">
		<div class="flex flex-col gap-y-4 px-6">
			<Status :type="type" v-for="ancestor of ancestors" :status="ancestor" :interaction="true" />
		</div>
		<div
			class="px-6 py-4 border-y-2 dark:border-gray-700 bg-gray-300/10">
			<Status :type="type" :interaction="true" :status="post" />
		</div>
		<div class="flex flex-col gap-y-4 pr-6 pl-4 mb-20">
			<ConversationChildPost :key="JSON.stringify(descendants)" :posts="descendants" :mode="PostType.Normal" :parentId="post.id" />
		</div>
	</div>

	<div v-else class="flex overflow-y-auto flex-col gap-y-4 px-6 py-4 w-full h-full no-scroll">
		<DummyStatus />
		<DummyStatus />
		<DummyStatus />
		<DummyStatus />
		<DummyStatus />
		<DummyStatus />
	</div>
</template>