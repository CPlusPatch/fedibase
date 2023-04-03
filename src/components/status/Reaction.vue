<script setup lang="ts">
import { ref } from "vue";
import { store } from "../../utils/store";
import { addNotification } from "../snackbar/Snackbar.vue";

const props = defineProps<{
	status: Entity.Status;
	reaction: Entity.Reaction;
}>();

console.log(props.status)

const _reaction = ref<Entity.Reaction>(props.reaction);

const react = () => {
	if (_reaction.value.me) return addNotification("Already reacted to this!");

	store.client
		?.createEmojiReaction(props.status.id, _reaction.value.name)
		.then(res => {
			_reaction.value.me = true;
			_reaction.value.count++;
		});
};
</script>

<template>
	<button
		@click="react"
		:class="[
			'text-lg flex items-center dark:text-gray-200 gap-x-2 rounded duration-200 justify-center bg-orange-400/40 dark:bg-orange-800/40 px-3 py-1',
			_reaction.me
				? 'bg-orange-700/40 dark:bg-orange-300/40 cursor-not-allowed'
				: 'no-bad-scale hover:scale-95',
		]">
		<img
			loading="lazy"
			v-if="_reaction.name.includes('@')"
			:src="status.emojis.find(e => `:${e.shortcode}:` == _reaction.name)?.static_url"
			class="w-[1em] h-[1em]"
			:alt="`Emoji reaction ${_reaction.name}`" />
		<span v-else>
			{{ _reaction.name }}
		</span>
		{{ _reaction.count }}
	</button>
</template>
