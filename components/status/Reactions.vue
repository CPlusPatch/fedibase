<script setup lang="ts">
import Reaction from "./Reaction.vue";

const props = defineProps<{
	status: Entity.Status;
}>();
</script>

<template>
	<div class="w-full flex flex-row gap-2 mt-2">
		<Reaction
			v-for="reaction in status.emoji_reactions"
			:status="status"
			:reaction="reaction"
			:key="reaction.name" />
	</div>
</template>
