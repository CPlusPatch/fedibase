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
import { store } from "../../utils/store";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import Input from "../input/Input.vue";
import Button from "../button/Button.vue";

const props = defineProps<{
	status: Entity.Status;
}>();

const _status = ref<Entity.Status>(props.status);
const reacting = ref<boolean>(false);
const reactionFilter = ref<Entity.Emoji[]>(store.emojis);

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

const filterReactions = (event: Event) => {
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
};

const copyUrl = () => {
	navigator.clipboard.writeText(_status.value.url);
};
</script>

<template>
	<div class="grid grid-cols-6 mt-3 w-full text-gray-700 dark:text-gray-400">
		<Button
			class="button"
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
		</Button>
		<Button
			class="button hover:text-yellow-400"
			title="Favourite this post"
			@click="toggleFavourite">
			<IconStarFilled
				v-if="_status.favourited"
				aria-hidden="true"
				class="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]" />
			<IconStar v-else aria-hidden="true" class="w-5 h-5" />
			{{ _status.favourites_count > 0 ? _status.favourites_count : "" }}
		</Button>
		<Button title="Boost this post" class="button" @click="toggleReblog">
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
		</Button>

		<div class="relative">
			<button
				class="button"
				title="Add reaction"
				@click="emojiDialog = !emojiDialog">
				<IconMoodHappy aria-hidden="true" class="w-5 h-5" />
			</button>

			<ScaleFadeSlide>
				<div
					v-if="emojiDialog"
					class="z-50 absolute bottom-6 -translate-x-1/2">
					<div
						class="w-80 flex flex-col m-4 p-3 z-50 bg-orange-100/50 backdrop-blur-md dark:bg-dark-800/75 border dark:border-gray-700 shadow rounded-xl h-72">
						<Input
							:icon="IconMoodHappy"
							class="dark:border-gray-700"
							placeholder="Search for emoji here"
							name="emoji"
							@input="filterReactions" />
						<div
							className="grid grid-cols-6 justify-around no-scroll p-3 gap-4 overflow-scroll">
							<button
								v-for="emoji of reactionFilter"
								:key="emoji.url"
								title="{emoji.shortcode}"
								class="flex items-center justify-center w-full"
								@click="() => react(emoji)">
								<img
									:src="emoji.url"
									className="w-7 h-7 rounded" />
							</button>
						</div>
					</div>
				</div>
			</ScaleFadeSlide>
		</div>
		<Button
			class="button"
			title="Quote this post"
			@click="
				e => {
					store.quotingTo = _status;
					store.replyingTo = null;
					store.state.composer = true;
				}
			">
			<IconQuote aria-hidden="true" class="w-5 h-5" />
		</Button>

		<div class="relative">
			<Button
				class="button hover:!animate-none"
				title="Quote this post"
				@click="menu = !menu">
				<IconDots aria-hidden="true" class="w-5 h-5" />
			</Button>

			<ScaleFadeSlide>
				<div
					v-if="menu"
					class="p-1.5 gap-x-4 origin-top-right outline-none text-base absolute right-0 w-44 overflow-hidden sm:text-sm rounded-lg shadow-lg bg-white/60 dark:bg-dark-700/60 backdrop-blur-lg focus:outline-none"
					@click="menu = false">
					<div
						v-if="_status.account.id === store.auth.data?.id"
						as="button"
						class="menu-item">
						<IconEdit class="menu-icon" aria-hidden="true" />
						Edit
					</div>
					<div as="button" class="menu-item" @click="copyUrl">
						<IconLink class="menu-icon" aria-hidden="true" />
						Copy link
					</div>
					<div
						v-if="
							_status.account.id === store.auth.data?.id &&
							!_status.pinned
						"
						as="button"
						class="menu-item"
						@click="togglePin">
						<IconPin class="menu-icon" aria-hidden="true" />
						Pin
					</div>
					<div
						v-if="
							_status.account.id === store.auth.data?.id &&
							_status.pinned
						"
						as="button"
						class="menu-item"
						@click="togglePin">
						<IconPinFilled class="menu-icon" aria-hidden="true" />
						Unpin
					</div>
					<div
						v-if="_status.account.id !== store.auth.data?.id"
						as="button"
						class="menu-item"
						@click="block">
						<IconForbid class="menu-icon" aria-hidden="true" />
						Block
					</div>
				</div>
			</ScaleFadeSlide>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.menu-item {
	@apply text-gray-700 duration-300 w-full dark:text-gray-50 hover:bg-orange-200 rounded-lg text-sm dark:hover:bg-orange-700/20 flex flex-row items-center py-2;
}

.menu-icon {
	@apply mx-2 h-[1.2em] w-[1.2em] mb-0.5;
}

.button {
	@apply gap-x-2 flex justify-center static shadow-none w-full border-none outline-none focus:outline-none;
}
</style>
