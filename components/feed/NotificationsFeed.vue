<script setup lang="ts">
import {
	IconList,
	IconListDetails,
	IconRocket,
	IconStarFilled,
} from "@tabler/icons-vue";
import SmallSelect, {
	SelectDirection,
	SelectItem,
} from "../select/SmallSelect.vue";
import Feed, { FeedType } from "./Feed.vue";
import { Ref, ref } from "vue";

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

const mode: Ref<string> = ref(modes[0].value);
</script>

<template>
	<div class="flex flex-col gap-y-6 w-full max-w-full min-h-full">
		<div
			v-if="props.title"
			class="flex flex-row justify-between items-center">
			<h3 class="text-lg font-bold dark:text-gray-50">Notifications</h3>
			<SmallSelect
				@update:modelValue="(item: SelectItem)=> {
					mode = item.value
				}"
				:items="modes"
				:defaultValue="0"
				:direction="SelectDirection.Left" />
		</div>

		<ul
			class="flex overflow-y-scroll flex-col max-w-full h-full no-scroll"
			:id="id">
			<Feed :type="FeedType.Notifications" :mode="mode" />
		</ul>
	</div>
</template>
