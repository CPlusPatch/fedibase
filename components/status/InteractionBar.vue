<script setup lang="ts">
import {
	IconStar,
	IconRocket,
	IconMoodHappy,
	IconQuote,
	IconLock,
	IconStarFilled,
	IconPin,
	IconEdit,
	IconForbid,
	IconCheck,
	IconDots,
	IconLink,
	IconMessageCircle2,
	IconPinFilled,
} from "@tabler/icons-vue";
import { Entity } from "megalodon";
import { ref } from "vue";
import { useStore } from "../../utils/store";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import InteractionBarButton from "./InteractionBarButton.vue";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
}>();

const _status = ref<Entity.Status>(props.status);
/* const reacting = ref<boolean>(false);
const reactionFilter = ref<Entity.Emoji[]>(store.emojis); */

const toggleFavourite = () => {
	if (_status.value.favourited) {
		_status.value.favourited = false;
		store.client?.unfavouriteStatus(_status.value.id);
	} else {
		_status.value.favourited = true;
		store.client?.favouriteStatus(_status.value.id);
	}
};

const toggleReblog = () => {
	if (_status.value.reblogged) {
		_status.value.reblogged = false;
		store.client?.unreblogStatus(_status.value.id);
	} else {
		_status.value.reblogged = true;
		store.client?.reblogStatus(_status.value.id);
	}
};

const block = () => {
	store.client?.blockAccount(_status.value.account.id).then(_ => {
		addNotification("Blocked account!", NotificationType.Normal, IconCheck);
	});
};

const togglePin = () => {
	if (_status.value.pinned) {
		store.client?.unpinStatus(_status.value.id).then(_ => {
			addNotification(
				"Unpinned status!",
				NotificationType.Normal,
				IconPin
			);
		});
	} else {
		store.client?.pinStatus(_status.value.id).then(_ => {
			addNotification(
				"Pinned status!",
				NotificationType.Normal,
				IconPinFilled
			);
		});
	}
};

const menu = ref(false);
const emojiDialog = ref(false);

/* const filterReactions = (event: Event) => {
	reactionFilter.value = store.emojis.filter(e =>
		e.shortcode.includes((event.target as HTMLInputElement).value)
	);
};

const react = (emoji: Entity.Emoji) => {
	store.client
		?.createEmojiReaction(_status.value.id, emoji.shortcode)
		.then(res => {
			_status.value = res.data;
			addNotification(
				"Added reaction!",
				NotificationType.Normal,
				IconMoodHappy
			);
			reacting.value = false;
		})
		.finally(() => {
			emojiDialog.value = false;
		});
}; */

const copyUrl = () => {
	navigator.clipboard.writeText(_status.value.url);
};
</script>

<template>
	<div class="grid grid-cols-6 w-full text-gray-700 dark:text-gray-400">
		<InteractionBarButton
			title="Reply to this post"
			@click="
				() => {
					store.replyingTo = _status;
					store.quotingTo = null;
					store.state.composer = true;
				}
			">
			<IconMessageCircle2 aria-hidden="true" class="w-5 h-5" />
			{{ _status.replies_count > 0 ? _status.replies_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton
			class="hover:text-yellow-400"
			title="Favourite this post"
			@click="toggleFavourite">
			<IconStarFilled
				v-if="_status.favourited"
				aria-hidden="true"
				class="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]" />
			<IconStar v-else aria-hidden="true" class="w-5 h-5" />
			{{ _status.favourites_count > 0 ? _status.favourites_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton @click="toggleReblog">
			<template
				v-if="
					_status.visibility !== 'private' &&
					_status.visibility !== 'direct'
				">
				<IconRocket
					v-if="_status.reblogged"
					aria-hidden="true"
					class="w-5 h-5 text-green-400 animate-[spin_1s_ease-in-out]" />
				<IconRocket
					v-else
					aria-hidden="true"
					class="w-5 h-5 hover:text-green-400" />
				{{ _status.reblogs_count > 0 ? _status.reblogs_count : "" }}
			</template>
			<IconLock v-else aria-hidden="true" class="w-5 h-5 text-gray-300" />
		</InteractionBarButton>

		<InteractionBarButton
			title="Add reaction"
			@click="emojiDialog = !emojiDialog">
			<IconMoodHappy aria-hidden="true" class="w-5 h-5" />
		</InteractionBarButton>
		<InteractionBarButton
			title="Quote this post"
			@click="
				e => {
					store.quotingTo = _status;
					store.replyingTo = null;
					store.state.composer = true;
				}
			">
			<IconQuote aria-hidden="true" class="w-5 h-5" />
		</InteractionBarButton>

		<div class="relative">
			<InteractionBarButton title="Quote this post" @click="menu = !menu">
				<IconDots aria-hidden="true" class="w-5 h-5" />
			</InteractionBarButton>

			<ScaleFadeSlide>
				<div
					v-if="menu"
					class="p-1.5 gap-x-4 origin-top-right outline-none text-base absolute right-0 w-44 overflow-hidden sm:text-sm rounded-lg shadow-lg bg-white/60 dark:bg-dark-700/60 backdrop-blur-lg focus:outline-none"
					@click="menu = false">
					<div
						v-if="_status.account.id === store.auth.data?.id"
						as="button"
						class="text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2">
						<IconEdit
							class="mx-2 h-[1.2em] w-[1.2em] mb-0.5"
							aria-hidden="true" />
						Edit
					</div>
					<div
						as="button"
						class="text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2"
						@click="copyUrl">
						<IconLink
							class="mx-2 h-[1.2em] w-[1.2em] mb-0.5"
							aria-hidden="true" />
						Copy link
					</div>
					<div
						v-if="
							_status.account.id === store.auth.data?.id &&
							!_status.pinned
						"
						as="button"
						class="text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2"
						@click="togglePin">
						<IconPin
							class="mx-2 h-[1.2em] w-[1.2em] mb-0.5"
							aria-hidden="true" />
						Pin
					</div>
					<div
						v-if="
							_status.account.id === store.auth.data?.id &&
							_status.pinned
						"
						as="button"
						class="text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2"
						@click="togglePin">
						<IconPinFilled
							class="mx-2 h-[1.2em] w-[1.2em] mb-0.5"
							aria-hidden="true" />
						Unpin
					</div>
					<div
						v-if="_status.account.id !== store.auth.data?.id"
						as="button"
						class="text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2"
						@click="block">
						<IconForbid
							class="mx-2 h-[1.2em] w-[1.2em] mb-0.5"
							aria-hidden="true" />
						Block
					</div>
				</div>
			</ScaleFadeSlide>
		</div>
	</div>
</template>
