<script setup lang="ts">
import {
	IconList,
	IconListDetails,
	IconRocket,
	IconStarFilled,
} from "@tabler/icons-vue";
import { ref } from "vue";
import SmallSelect, {
	SelectDirection,
	SelectItem,
} from "../select/SmallSelect.vue";
import Feed, { FeedType } from "./Feed.vue";

const props = defineProps<{
	title: boolean;
	id?: string;
}>();

const modes: SelectItem[] = [
	{
		icon: IconList,
		text: "All posts",
		value: "all",
		description: "Show all posts",
	},
	{
		icon: IconListDetails,
		text: "Mentions",
		value: "mention",
		description: "Only show mentions",
	},
	{
		icon: IconRocket,
		text: "Boosts",
		value: "reblogs",
		description: "Only show boosts",
	},
	{
		icon: IconStarFilled,
		text: "Favourites",
		value: "favourites",
		description: "Only show favourites",
	},
];

const mode = ref(modes[0].value);
</script>

<template>
	<div class="flex flex-col gap-y-6 w-full max-w-full min-h-full">
		<div
			v-if="props.title"
			class="flex flex-row justify-between items-center">
			<h3 class="text-lg font-bold dark:text-gray-50">Notifications</h3>
			<SmallSelect
				:items="modes"
				:default-value="0"
				:direction="SelectDirection.Left"
				@update:model-value="(item: SelectItem)=> {
					mode = item.value
				}" />
		</div>

		<ul
			:id="id"
			class="flex overflow-y-scroll flex-col max-w-full h-full no-scroll gap-y-4">
			<Feed :type="FeedType.Notifications" :mode="mode" />
		</ul>
	</div>
</template>
