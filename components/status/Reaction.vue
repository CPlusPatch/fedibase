<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "../../utils/store";
import { addNotification } from "../snackbar/Snackbar.vue";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
	reaction: Entity.Reaction;
}>();

const _reaction = ref<Entity.Reaction>(props.reaction);

const url = _reaction.value.accounts
	? _reaction.value.accounts[0].emojis.find(
			e => e.shortcode === _reaction.value.name.split("@")[0]
	  )?.url
	: "";

const react = () => {
	if (_reaction.value.me) return addNotification("Already reacted to this!");

	store.client
		?.createEmojiReaction(props.status.id, _reaction.value.name)
		.then(_ => {
			_reaction.value.me = true;
			_reaction.value.count++;
		});
};
</script>

<template>
	<button
		:class="[
			'text-sm flex items-center ring-1 ring-dark-600 text-gray-100 bg-dark-700 gap-x-1 rounded duration-200 justify-center px-2 py-1',
			_reaction.me ? 'cursor-not-allowed' : 'no-bad-scale hover:scale-95',
		]"
		@click="react">
		<img
			v-if="_reaction.name.includes('@')"
			:src="url"
			class="w-[1em] h-[1em] align-middle"
			:alt="`Emoji reaction ${_reaction.name}`" />
		<span v-else>
			{{ _reaction.name }}
		</span>
		{{ _reaction.count }}
	</button>
</template>
