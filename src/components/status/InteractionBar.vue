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
import { IconDots } from "@tabler/icons-vue";
import InteractionBarButton from "./InteractionBarButton.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { IconEye } from "@tabler/icons-vue";
import { IconForbid2 } from "@tabler/icons-vue";
import { IconHandOff } from "@tabler/icons-vue";
import { IconEdit } from "@tabler/icons-vue";
import { IconForbid } from "@tabler/icons-vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import { IconCheck } from "@tabler/icons-vue";

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

const block = () => {
	store.client?.blockAccount(props.status.account.id).then(res => {
		addNotification("Blocked account!", NotificationType.Normal, IconCheck);
	})
}

const edit = () => {
	store.editing = props.status;
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
					store.replyingTo = status;
					store.state.composer = true;
				}
			"
			title="Reply to this post">
			<IconMessage aria-hidden="true" class="w-5 h-5" />
			{{ status.replies_count > 0 ? status.replies_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton
			@click="handleFavourite"
			title="Favourite this post">
			<IconStarFilled
				v-if="status.favourited"
				aria-hidden="true"
				class="w-5 h-5 text-yellow-400 animate-[spin_1s_ease-in-out]" />
			<IconStar v-else aria-hidden="true" class="w-5 h-5" />
			{{ status.favourites_count > 0 ? status.favourites_count : "" }}
		</InteractionBarButton>
		<InteractionBarButton @click="handleReblog" title="Boost this post">
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
		</InteractionBarButton>
		<InteractionBarButton title="Add reaction">
			<IconMoodHappy aria-hidden="true" class="w-5 h-5" />
		</InteractionBarButton>
		<InteractionBarButton
			@click="
				e => {
					store.quotingTo = status;
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
						v-if="status.account.id === store.auth.data?.id"
						as="button"
						class="menu-item">
						<IconEdit
							class="menu-icon"
							aria-hidden="true" />
						Edit
					</MenuItem>
					<MenuItem
						v-if="status.account.id !== store.auth.data?.id"
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
