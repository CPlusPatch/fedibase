<script lang="ts">
import { Entity } from "megalodon";
import { withEmojis, fromNow } from "../../utils/functions";
import Button from "../button/Button.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import InteractionBar from "./InteractionBar.vue";
import StatusAttachments from "./StatusAttachments.vue";
import ReplyTo from "./ReplyTo.vue";
import Poll from "./Poll.vue";
import Reactions from "./Reactions.vue";

export enum PostType {
	Normal,
	Small,
	Tiny,
}
</script>

<script setup lang="ts">
const props = defineProps<{
	status: Entity.Status;
	interaction: boolean;
	hasLeftLine?: boolean;
	type: PostType;
}>();

const expand = ref<boolean>(false);
const clamps = ref<boolean>(false);
const show = ref<boolean>(props.status.spoiler_text === "");
const textRef = ref<HTMLParagraphElement>();

/* onMounted(() => {
	if (textRef.value) {
		const lineHeight = parseInt(getComputedStyle(textRef.value).lineHeight);
		const overflowHeight = lineHeight * 6;
		const elementHeight = textRef.value.clientHeight;

		clamps.value = elementHeight > overflowHeight;
	}
}); */

const toggleExpand = () => {
	expand.value = !expand.value;
};

const toggleShow = () => {
	show.value = !show.value;
};

const copyToClipboard = (str: string) => {
	navigator.clipboard.writeText(str);
	addNotification(
		"Copied!",
		NotificationType.Normal,
		"ic:round-content-copy"
	);
};
</script>

<template>
	<TransitionsScaleFadeSlide>
		<div class="flex flex-col max-w-full gap-y-1 cursor-pointer rounded">
			<div
				v-if="type !== PostType.Tiny"
				class="flex flex-row overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap w-full z-1">
				<NuxtLink
					:to="`/user/${status.account.id}`"
					class="flex-shrink-0 mr-2">
					<img
						loading="lazy"
						alt=""
						:src="status.account.avatar"
						:class="[
							'bg-white overflow-hidden w-10 h-10 dark:bg-dark-800-800 hover:rounded-xl duration-200 rounded border border-gray-300 dark:border-dark-700',
							type === PostType.Normal
								? 'md:w-12 md:h-12'
								: 'md:w-10 md:h-10',
						]" />
				</NuxtLink>
				<div
					:class="[
						'flex flex-col grow text-sm justify-around overflow-hidden text-ellipsis',
					]">
					<div class="flex flex-row justify-between">
						<h4
							class="font-bold dark:text-gray-200"
							:title="status.account.display_name"
							v-html="
								withEmojis(
									status.account.display_name,
									status.account.emojis
								)
							"></h4>
						<NuxtLink
							:to="`/posts/${status.id}`"
							class="text-sm text-gray-700 dark:text-gray-300 hover:underline"
							v-html="fromNow(new Date(status.created_at))">
						</NuxtLink>
					</div>
					<h5
						ref="acctField"
						:title="status.account.acct"
						class="overflow-hidden group ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400"
						@click="copyToClipboard('@' + status.account.acct)">
						<span class="group-hover:hidden">
							@{{ status.account.acct }}
						</span>
						<span
							class="group-hover:flex hidden items-center gap-x-1">
							<Icon name="ic:round-content-copy" /> Click to copy
						</span>
					</h5>
				</div>
			</div>
			<div
				v-else
				class="flex flex-row items-center gap-x-1 whitespace-nowrap overflow-hidden text-ellipsis z-1">
				<img
					loading="lazy"
					alt=""
					:src="status.account.avatar"
					:class="[
						'bg-white overflow-hidden w-4 h-4 dark:bg-dark-800-800 rounded border border-gray-300 dark:border-dark-700',
					]" />
				<h4
					class="font-bold dark:text-gray-200"
					:title="status.account.display_name"
					v-html="
						withEmojis(
							status.account.display_name,
							status.account.emojis
						)
					"></h4>
				<h5
					:title="status.account.acct"
					class="overflow-hidden ml-0 text-gray-500 overflow-ellipsis dark:text-gray-400">
					@{{ status.account.acct.split("@")[0] }}
				</h5>
			</div>
			<div class="flex">
				<div v-if="hasLeftLine" class="h-full pr-14 relative">
					<div
						class="border-l-2 dark:border-gray-400 absolute inset-x-0 -top-3 left-5 -bottom-10"></div>
				</div>
				<div class="flex flex-col gap-y-1 text-sm grow">
					<ReplyTo
						v-if="status.in_reply_to_id"
						v-once
						:status="status" />

					<div
						v-if="status.spoiler_text !== ''"
						class="flex gap-x-2 items-center font-bold dark:text-gray-100">
						<span
							v-html="
								status.spoiler_text === ''
									? 'Marked as sensitive'
									: withEmojis(
											status.spoiler_text,
											status.emojis
									  )
							"></span>

						<Button
							class="!py-1 !px-2"
							theme="gray"
							@click="toggleShow">
							{{ show ? "Hide" : "Show" }}
						</Button>
					</div>

					<p
						ref="textRef"
						:class="[
							'mt-1 status-text rounded text-sm duration-200 status-text dark:text-gray-50 break-words max-w-full',
							!show && 'filter blur-lg',
							clamps && !expand && 'line-clamp-6',
						]"
						v-html="withEmojis(status.content, status.emojis)"></p>

					<button
						v-if="clamps"
						class="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline"
						@click="toggleExpand">
						<template v-if="expand">Less</template>
						<template v-else>More</template>
					</button>

					<Poll v-if="status.poll" v-once :status="status" />

					<Reactions
						v-if="status.emoji_reactions.length > 0"
						v-once
						:status="status" />

					<StatusAttachments
						v-if="status.media_attachments.length > 0"
						v-once
						:type="type"
						:status="status" />

					<a
						v-if="status.card"
						target="_blank"
						:href="status.card.url"
						class="mt-4 flex ring-1 group divide-x divide-gray-600 h-30 rounded ring-gray-600 duration-200 hover:scale-101 no-bad-scale">
						<div
							v-if="status.card.image"
							class="w-30 h-30 flex-shrink-0 h-full overflow-hidden rounded-l">
							<img
								:src="status.card.image"
								class="w-full h-full object-cover group-hover:scale-120 duration-200 ease-in-out" />
						</div>
						<div class="grow flex flex-col p-3 justify-around gap-y-1">
							<h3 class="text-white font-bold line-clamp-1">
								{{ status.card.title }}
							</h3>
							<span
								class="text-gray-400 line-clamp-2 break-all"
								>{{ status.card.description }}</span
							>
							<span class="text-gray-300 line-clamp-1"
								><Icon name="ic:round-insert-link" />
								{{ status.card.provider_url }}</span
							>
						</div>
					</a>

					<InteractionBar
						v-if="props.interaction"
						v-once
						:status="status" />
				</div>
			</div>
		</div>
	</TransitionsScaleFadeSlide>
</template>
