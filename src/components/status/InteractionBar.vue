<script setup lang="ts">
import { IconStar, IconRocket, IconMoodHappy, IconQuote, IconLock, IconStarFilled, IconMessage, IconPin, IconEdit, IconForbid, IconCheck, IconDots } from "@tabler/icons-vue";
import { Entity } from "megalodon";
import { store } from "../../utils/store";
import InteractionBarButton from "./InteractionBarButton.vue";
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionRoot } from "@headlessui/vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import { ref } from "vue";
import { IconPinFilled } from "@tabler/icons-vue";
import Input from "../input/Input.vue";

const props = defineProps<{
	status: Entity.Status;
}>();

const _status = ref<Entity.Status>(props.status);
const reacting = ref<boolean>(false);
const reactionFilter = ref<Entity.Emoji[]>(store.emojis);

const handleFavourite = async () => {
	if (_status.value.favourited) {
		_status.value.favourited = false;
		store.client?.unfavouriteStatus(_status.value.id).then(res => {
			_status.value = res.data
		});
	} else if (!_status.value.favourited) {
		_status.value.favourited = true;
		store.client?.favouriteStatus(_status.value.id).then(res => {
			_status.value = res.data
		});
	}
};

const handleReblog = () => {
	if (_status.value.reblogged) {
		_status.value.reblogged = false;
		store.client?.reblogStatus(_status.value.id).then(res => {
			_status.value = res.data
		});
	} else if (!_status.value.reblogged) {
		_status.value.reblogged = true;
		store.client?.reblogStatus(_status.value.id).then(res => {
			_status.value = res.data
		});
	}
};

const block = () => {
	store.client?.blockAccount(_status.value.account.id).then(res => {
		addNotification("Blocked account!", NotificationType.Normal, IconCheck);
	})
}

const togglePin = () => {
	if (_status.value.pinned) {
		store.client?.unpinStatus(_status.value.id).then(res => {
			addNotification("Unpinned status!", NotificationType.Normal, IconPin);
			_status.value = res.data
		});
	} else {
		store.client?.pinStatus(_status.value.id).then(res => {
			addNotification("Pinned status!", NotificationType.Normal, IconPinFilled);
			_status.value = res.data
		});
	}
}

const toggleReaction = () => {
	if (store.auth.type === "mastodon") return addNotification("Mastodon does not support reactions!");
	reacting.value = !reacting.value;
}

const filterReactions = (event: Event) => {
	console.log("gay")
	reactionFilter.value = store.emojis.filter(e => e.shortcode.includes((event.target as HTMLInputElement).value)) ;
}

const react = (emoji: Entity.Emoji) => {
	store.client?.createEmojiReaction(_status.value.id, emoji.shortcode).then(res => {
		_status.value = res.data;
		addNotification("Added reaction!", NotificationType.Normal, IconMoodHappy);
		reacting.value = false;
	})
}

const edit = () => {
	store.editing = _status.value;
}
</script>

<style scoped lang="postcss">
.menu-item {
	@apply text-gray-700 w-full dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-200/10 flex items-center px-4 py-3;
}

.menu-icon {
	@apply mr-3 h-5 w-5 text-gray-400 dark:text-gray-500;
}
</style>

<template>
	<div
		class="flex justify-between px-5 mt-3 w-full text-gray-700 dark:text-gray-400">
		<InteractionBarButton
			@click="
				e => {
					store.replyingTo = _status;
					store.state.composer = true;
				}
			"
			title="Reply to this post">
			<IconMessage aria-hidden="true" class="w-5 h-5" />
			{{ _status.replies_count > 0 ? _status.replies_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton
			@click="handleFavourite"
			title="Favourite this post">
			<IconStarFilled
				v-if="_status.favourited"
				aria-hidden="true"
				class="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]" />
			<IconStar v-else aria-hidden="true" class="w-5 h-5" />
			{{ _status.favourites_count > 0 ? _status.favourites_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton @click="handleReblog" title="Boost this post">
			<template
				v-if="
					_status.visibility !== 'private' &&
					_status.visibility !== 'direct'
				">
				<IconRocket
					v-if="_status.reblogged"
					aria-hidden="true"
					class="w-5 h-5 text-green-400 animate-[spin_1s_ease-in-out]" />
				<IconRocket v-else aria-hidden="true" class="w-5 h-5" />
				{{ _status.reblogs_count > 0 ? _status.reblogs_count : "" }}
			</template>
			<template v-else>
				<IconLock aria-hidden="true" class="w-5 h-5 text-gray-300" />
			</template>
		</InteractionBarButton>
		<InteractionBarButton title="Add reaction" @click="toggleReaction">
			<IconMoodHappy aria-hidden="true" class="w-5 h-5" />

			<TransitionRoot appear :show="reacting">
			<Dialog @close="() => reacting = false" class="z-50 fixed bottom-0">
				<ScaleFadeSlide>
					<DialogPanel>
						<div class="w-80 flex flex-col bottom-0 left-0 m-4 p-3 absolute z-50 bg-orange-100/50 backdrop-blur-md dark:bg-dark-800/75 border dark:border-gray-700 shadow rounded-xl h-72">
							<Input @input="filterReactions" autofocus="true" :icon="IconMoodHappy" class="dark:border-gray-700" placeholder="Search for emoji here" name="emoji" />
							<div className="grid grid-cols-6 justify-around no-scroll p-3 gap-4 overflow-scroll">
								<button @click="() => react(emoji)" v-for="emoji of reactionFilter" :key="emoji.url" title={emoji.shortcode} class="flex items-center justify-center w-full">
									<img :src="emoji.url" className="w-7 h-7 rounded" />
								</button>
							</div>
						</div>
					</DialogPanel>
				</ScaleFadeSlide>
			</Dialog>
			</TransitionRoot>
		</InteractionBarButton>
		<InteractionBarButton
			@click="
				e => {
					store.quotingTo = _status;
					store.state.composer = true;
				}
			"
			title="Quote this post">
			<IconQuote aria-hidden="true" class="w-5 h-5" />
		</InteractionBarButton>
		<Menu as="button" class="relative">
			<MenuButton>
				<InteractionBarButton
					is="div"
					title="Quote this post"
					class="hover:!animate-none">
					<IconDots aria-hidden="true" class="w-5 h-5" />
				</InteractionBarButton>
			</MenuButton>

			<ScaleFadeSlide>
				<MenuItems
					class="origin-top-right outline-none text-base absolute right-0 w-44 overflow-hidden sm:text-sm rounded-md shadow-lg bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg focus:outline-none">
					<MenuItem
						v-if="_status.account.id === store.auth.data?.id"
						as="button"
						class="menu-item">
						<IconEdit
							class="menu-icon"
							aria-hidden="true" />
						Edit
					</MenuItem>
					<MenuItem
						v-if="(_status.account.id === store.auth.data?.id) && !_status.pinned"
						@click="togglePin"
						as="button"
						class="menu-item">
						<IconPin
							class="menu-icon"
							aria-hidden="true" />
						Pin
					</MenuItem>
					<MenuItem
						v-if="(_status.account.id === store.auth.data?.id) && _status.pinned"
						@click="togglePin"
						as="button"
						class="menu-item">
						<IconPinFilled
							class="menu-icon"
							aria-hidden="true" />
						Unpin
					</MenuItem>
					<MenuItem
						v-if="_status.account.id !== store.auth.data?.id"
						@click="block"
						as="button"
						class="menu-item">
						<IconForbid
							class="menu-icon"
							aria-hidden="true" />
						Block
					</MenuItem>
				</MenuItems>
			</ScaleFadeSlide>
		</Menu>
	</div>
</template>
