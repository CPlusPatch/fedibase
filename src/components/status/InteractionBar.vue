<script setup lang="ts">
import { IconStar } from "@tabler/icons-vue";
import { IconRocket } from "@tabler/icons-vue";
import { IconMoodHappy } from "@tabler/icons-vue";
import { IconQuote } from "@tabler/icons-vue";
import { IconLock } from "@tabler/icons-vue";
import { IconStarFilled } from "@tabler/icons-vue";
import { IconMessage } from "@tabler/icons-vue";
import { Entity } from "megalodon";
import { store } from "../../utils/store";
import { addNotification } from "../snackbar/Snackbar.vue";

const props = defineProps<{
	status: Entity.Status;
}>();

const handleFavourite = () => {
	if (props.status.favourited) {
		props.status.favourited = false;
		store.client?.unfavouriteStatus(props.status.id);
	} else if (!props.status.favourited) {
		props.status.favourited = true;
		store.client?.favouriteStatus(props.status.id);
	}
};

const handleReblog = () => {
	if (props.status.reblogged) {
		props.status.reblogged = false;
		store.client?.reblogStatus(props.status.id);
	} else if (!props.status.reblogged) {
		props.status.reblogged = true;
		store.client?.reblogStatus(props.status.id);
	}
};
</script>

<template>
	<div
		class="flex justify-between px-5 mt-3 w-full text-gray-700 dark:text-gray-400">
		<button
			@click="
				e => {
					store.replyingTo = status;
					store.state.composer = true;
				}
			"
			title="Reply to this post"
			class="flex justify-center gap-x-2 !static hover:animate-hithere">
			<IconMessage aria-hidden="true" class="w-5 h-5" />
			{{ status.replies_count > 0 ? status.replies_count : "" }}
		</button>
		<button
			@click="handleFavourite"
			title="Favourite this post"
			class="gap-x-2 flex justify-center !static hover:animate-hithere">
			<IconStarFilled
				v-if="status.favourited"
				aria-hidden="true"
				class="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]" />
			<IconStar v-else aria-hidden="true" class="w-5 h-5" />
			{{ status.favourites_count > 0 ? status.favourites_count : "" }}
		</button>
		<button
			@click="handleReblog"
			title="Boost this post"
			class="gap-x-2 flex justify-center !static hover:animate-hithere">
			<template
				v-if="
					status.visibility !== 'private' &&
					status.visibility !== 'direct'
				">
				<IconRocket
					v-if="status.reblogged"
					aria-hidden="true"
					class="w-5 h-5 text-green-400 animate-[spin_1s_ease-in-out]" />
				<IconRocket v-else aria-hidden="true" class="w-5 h-5" />
				{{ status.reblogs_count > 0 ? status.reblogs_count : "" }}
			</template>
			<template v-else>
				<IconLock aria-hidden="true" class="w-5 h-5 text-gray-300" />
			</template>
		</button>
		<button
			title="Add reaction"
			class="flex justify-center !static hover:animate-hithere">
			<IconMoodHappy aria-hidden="true" class="w-5 h-5" />
		</button>
		<button
			@click="
				e => {
					store.quotingTo = status;
					store.state.composer = true;
				}
			"
			title="Quote this post"
			class="flex justify-center !static hover:animate-hithere">
			<IconQuote aria-hidden="true" class="w-5 h-5" />
		</button>
	</div>
</template>
