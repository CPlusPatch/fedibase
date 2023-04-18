<script setup lang="ts">
import { store } from "../../utils/store";
import Status, { PostType } from "../status/Status.vue";
import DummyStatus from "../status/DummyStatus.vue";
import { IconX } from "@tabler/icons-vue";
import ConversationChildPost from "../status/ConversationChildPost.vue";

const props = withDefaults(
	defineProps<{
		id?: string;
		title?: boolean;
		closeButton?: boolean;
		onClose?: () => void;
		type?: PostType;
	}>(),
	{
		title: true,
		onClose: () => {},
		closeButton: false,
		type: PostType.Normal,
	}
);

const route = useRoute();

let ancestors = ref<Entity.Status[]>([]);
let post = ref<Entity.Status | null>(null);
let descendants = ref<Entity.Status[]>([]);
const id = ref<string>(props.id ?? (route.params.id as string));

// Finds all the parent elements of a post in a list of statuses
function findParentElements(array: Entity.Status[], elementId: string) {
	const parentElements = [];
	let currentElement = array.find(element => element.id === elementId);

	while (currentElement && currentElement.in_reply_to_id !== "") {
		parentElements.push(currentElement);
		currentElement = array.find(
			element => element.id === currentElement?.in_reply_to_id
		);
	}
	return parentElements;
}

watch(
	() => route.params.id,
	newId => {
		id.value = newId as string;

		store.client?.getStatus(id.value).then(res => {
			post.value = res.data;

			store.client?.getStatusContext(id.value).then(res => {
				if (!post.value) return;

				ancestors.value = findParentElements(
					[...res.data.ancestors, post.value],
					post.value.id
				)
					.reverse()
					.slice(0, -1); // Slice because it includes the post, so remove last element
				descendants.value = res.data.descendants;
			});
		});
	}
);

store.client?.getStatus(id.value).then(res => {
	post.value = res.data;

	store.client?.getStatusContext(id.value).then(res => {
		if (!post.value) return;

		ancestors.value = findParentElements(
			[...res.data.ancestors, post.value],
			post.value.id
		)
			.reverse()
			.slice(0, -1); // Slice because it includes the post, so remove last element
		descendants.value = res.data.descendants;
	});
});

onUnmounted(() => {
	post.value = null;
	ancestors.value = [];
	descendants.value = [];
});
</script>

<template>
	<div class="flex overflow-y-hidden flex-col pt-6 h-full">
		<div class="flex justify-between px-4">
			<h1 class="text-lg font-medium text-gray-900 dark:text-gray-50">
				Conversation
			</h1>
			<button
				class="flex items-center justify-center"
				@click="onClose"
				title="Close conversation">
				<IconX v-if="closeButton" class="w-5 h-5 dark:text-gray-50" />
			</button>
		</div>
		<div class="flex overflow-hidden relative mt-6 max-w-full grow">
			<div
				v-if="post"
				class="flex overflow-y-scroll flex-col gap-y-5 py-4 w-full h-full no-scroll">
				<div class="flex flex-col gap-y-4 px-2">
					<Status
						:type="type"
						v-for="ancestor of ancestors"
						:status="ancestor"
						:interaction="true" />
				</div>
				<div
					class="px-4 py-4 border-y-2 dark:border-gray-700 bg-gray-300/10">
					<Status :type="type" :interaction="true" :status="post" />
				</div>
				<div class="flex flex-col gap-y-4 mb-20">
					<ConversationChildPost
						:key="JSON.stringify(descendants)"
						:posts="descendants"
						:mode="PostType.Normal"
						:parentId="post.id" />
				</div>
			</div>

			<div
				v-else
				class="grow w-full h-full flex items-center justify-center">
				<img
					src="/images/icons/logo.svg"
					class="w-20 h-20 animate-hithere" />
			</div>
		</div>
	</div>
</template>
