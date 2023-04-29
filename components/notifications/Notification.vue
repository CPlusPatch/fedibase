<script setup lang="ts">
import { IconStarFilled } from "@tabler/icons-vue";
import { Entity } from "megalodon";
import { withEmojis, withEmojiReactions } from "../../utils/functions";
import Status, { PostType } from "../status/Status.vue";

const props = defineProps<{
	notification: Entity.Notification;
}>();
</script>

<template>
	<li
		v-if="
			['favourite', 'reblog', 'emoji_reaction', 'mention'].includes(
				props.notification.type
			)
		"
		:class="[
			'flex flex-col max-w-full rounded duration-200 ease-in-out px-3 gap-y-1',
			props.notification.type === 'favourite' &&
				'border-yellow-500 border-l-2 opacity-75',
			props.notification.type === 'reblog' &&
				'border-blue-500 border-l-2 opacity-75',
			props.notification.type === 'emoji_reaction' &&
				'border-red-500 border-l-2 opacity-75',
		]">
		<RouterLink
			v-if="props.notification.type === 'favourite'"
			:to="`/user/${notification.account.id}`"
			class="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
			<IconStarFilled
				aria-hidden="true"
				class="inline mr-1 w-[1em] pb-0.5 text-yellow-500 hover:animate-spin" />
			<img
				loading="lazy"
				:src="props.notification.account.avatar"
				alt=""
				class="h-[1em] w-[1em] inline rounded mb-0.5 mr-2" />
			<span
				v-html="
					withEmojis(
						props.notification.account.display_name,
						props.notification.account.emojis
					)
				"></span>
			favourited
		</RouterLink>
		<RouterLink
			v-if="props.notification.type === 'emoji_reaction'"
			:to="`/user/${notification.account.id}`"
			class="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
			<img
				loading="lazy"
				:src="props.notification.account.avatar"
				alt=""
				class="h-[1em] w-[1em] inline rounded mb-0.5 mr-2" />

			<span
				v-html="
					withEmojis(
						props.notification.account.display_name,
						props.notification.account.emojis
					)
				"></span>
			&nbsp;reacted with&nbsp;
			<span
				v-html="
					props.notification.status?.emoji_reactions &&
					withEmojiReactions(
						props.notification.emoji ?? '',
						props.notification.status?.emoji_reactions
					)
				"></span>
		</RouterLink>
		<RouterLink
			v-if="props.notification.type === 'reblog'"
			:to="`/user/${notification.account.id}`"
			class="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400 hover:underline">
			<svg
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				class="text-blue-500 hover:animate-spin w-[1em] inline pb-0.5 mr-1"
				viewBox="0 0 576 512">
				<path
					fill="currentColor"
					d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 192 32.1 192h32v128c0 53 43 96 96 96H272zm32-320c-17.7 0-32 14.3-32 32s14.3 32 32 32h112c17.7 0 32 14.3 32 32v128h-32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S556.9 320 543.9 320h-32V192c0-53-43-96-96-96H304z"></path>
			</svg>

			<img
				loading="lazy"
				:src="props.notification.account.avatar"
				alt=""
				class="h-[1em] w-[1em] inline rounded mb-0.5 mr-2" />
			<span
				v-html="
					withEmojis(
						props.notification.account.display_name,
						props.notification.account.emojis
					)
				"></span>
			boosted
		</RouterLink>
		<Status
			v-if="props.notification.status"
			:type="
				props.notification.type === 'mention'
					? PostType.Small
					: PostType.Tiny
			"
			:interaction="props.notification.type === 'mention'"
			:status="props.notification.status" />
	</li>
	<li
		v-if="props.notification.type === 'follow'"
		class="flex flex-col gap-y-2 p-2 max-w-full rounded bg-green-500/10">
		<RouterLink
			:to="`/user/${notification.account.id}`"
			class="overflow-hidden gap-x-2 max-w-full text-base text-gray-800 dark:text-gray-100 hover:underline">
			<img
				loading="lazy"
				:src="props.notification.account.avatar"
				alt=""
				class="h-[1em] w-[1em] inline rounded mb-0.5 mr-2" />
			<span
				v-html="
					withEmojis(
						props.notification.account.display_name,
						props.notification.account.emojis
					)
				"></span>
			followed you
		</RouterLink>
	</li>
</template>
