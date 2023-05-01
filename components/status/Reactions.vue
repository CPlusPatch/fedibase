<script setup lang="ts">
import Reaction from "./Reaction.vue";
import { useStore } from "~/utils/store";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
}>();

const reactions =
	(await store.client?.getEmojiReactions(props.status.id))?.data ?? [];
</script>

<template>
	<div class="w-full flex flex-row gap-2 mt-2">
		<Reaction
			v-for="reaction in reactions"
			:key="reaction.name"
			:status="status"
			:reaction="reaction" />
	</div>
</template>
