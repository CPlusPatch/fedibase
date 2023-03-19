<script setup lang="ts">
import { IconStar, IconRocket, IconMoodHappy, IconQuote, IconLock, IconStarFilled, IconMessage, IconPin, IconEdit, IconForbid, IconCheck, IconDots } from "@tabler/icons-vue";
import { Entity } from "megalodon";
import { store } from "../../utils/store";
import InteractionBarButton from "./InteractionBarButton.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import { ref } from "vue";
import { IconPinFilled } from "@tabler/icons-vue";

const props = defineProps<{
	status: Entity.Status;
}>();

const _status = ref<Entity.Status>(props.status);

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
		<InteractionBarButton title="Add reaction">
			<IconMoodHappy aria-hidden="true" class="w-5 h-5" />
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
