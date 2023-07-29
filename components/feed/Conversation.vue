<script setup lang="ts">
import { useStore } from "../../utils/store";
import Status, { PostType } from "../status/Status.vue";
import ConversationChildPost from "../status/ConversationChildPost.vue";

const store = useStore();

const props = withDefaults(
	defineProps<{
		id?: string;
		title?: boolean;
		closeButton?: boolean;
		onClose?: () => void;
		type?: PostType;
	}>(),
	{
		id: undefined,
		title: true,
		onClose: () => {},
		closeButton: false,
		type: PostType.Normal,
	}
);

const route = useRoute();

const ancestors = ref<Entity.Status[]>([]);
const post = ref<Entity.Status | null>(null);
const descendants = ref<Entity.Status[]>([]);
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
	<FeedWrapper>
		<div class="flex overflow-hidden relative max-w-full grow">
			<div
				class="flex overflow-y-scroll flex-col gap-y-5 w-full h-full no-scroll px-2">
				<div class="flex flex-col gap-y-4">
					<Status
						v-for="ancestor of ancestors"
						:key="ancestor.id"
						:has-left-line="true"
						:type="type"
						:status="ancestor"
						:interaction="true" />
				</div>
				<StatusDummyStatus
					v-if="
						post && post.in_reply_to_id && ancestors.length == 0
					" />
				<Status
					v-if="post"
					:type="type"
					:interaction="true"
					:status="post" />
				<StatusDummyStatus v-else />
				<div v-if="post" class="flex flex-col gap-y-4 mb-20">
					<ConversationChildPost
						:key="JSON.stringify(descendants)"
						:posts="descendants"
						:mode="PostType.Normal"
						:parent-id="post.id" />
				</div>
			</div>
		</div>
	</FeedWrapper>
</template>
