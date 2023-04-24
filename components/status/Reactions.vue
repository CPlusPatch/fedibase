<script setup lang="ts">
import Reaction from "./Reaction.vue";

defineProps<{
	status: Entity.Status;
}>();
</script>

<template>
	<div class="w-full flex flex-row gap-2 mt-2">
		<Reaction
			v-for="reaction in status.emoji_reactions"
			:key="reaction.name"
			:status="status"
			:reaction="reaction" />
	</div>
</template>
