<script setup lang="ts">
import { IconDots } from "@tabler/icons-vue";
import { Entity } from "megalodon";
import Status, { PostType } from "./Status.vue";

interface ChildPostProps {
	posts: Entity.Status[];
	parentId: string;
	mode: PostType;
	recursionDepth?: number;
}

const props = withDefaults(defineProps<ChildPostProps>(), {
	recursionDepth: 0,
});

const children = props.posts.filter(
	post => post.in_reply_to_id === props.parentId
);
</script>

<template>
	<template v-if="recursionDepth > 10">
		<div
			class="flex flex-col gap-y-4 dark:border-gray-500 rounded justify-center items-center p-4 w-full">
			<IconDots class="w-5 h-5 dark:text-white" />
		</div>
	</template>
	<template v-else>
		<div
			class="flex flex-col gap-y-4 pl-1.5 border-l-4 dark:border-gray-500 rounded">
			<template v-for="post in children" :key="post.id">
				<Status
					:interaction="true"
					:entity="post"
					:status="post"
					:type="PostType.Normal" />
				<ConversationChildPost
					:posts="posts"
					:parent-id="post.id"
					:mode="mode"
					:recursion-depth="recursionDepth + 1" />
			</template>
		</div>
	</template>
</template>
