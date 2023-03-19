<script setup lang="ts">
import { Entity } from "megalodon";
import { onMounted, ref } from "vue";
import { classNames, withEmojis, fromNow } from "../../utils/functions";
import InteractionBar from "./InteractionBar.vue";
import Button from "../button/Button.vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import StatusAttachments from "./StatusAttachments.vue";
import Link from "../transitions/Link.vue";
import ReplyTo from "./ReplyTo.vue";
import Poll from "./Poll.vue";
import Reactions from "./Reactions.vue";

const props = defineProps<{
	status: Entity.Status;
	interaction: boolean;
	type: PostType;
}>();

const expand = ref<boolean>(false);
const clamps = ref<boolean>(true);
const show = ref<boolean>(false);
const textRef = ref<HTMLParagraphElement>();

onMounted(() => {
	if (textRef.value) {
		const lineHeight = parseInt(getComputedStyle(textRef.value).lineHeight);
		const overflowHeight = lineHeight * 6;
		const elementHeight = textRef.value.clientHeight;

		clamps.value = elementHeight > overflowHeight;
	}
});

const toggleExpand = () => {
	expand.value = !expand.value;
};

const toggleShow = () => {
	show.value = !show.value;
};
</script>

<script lang="ts">
export enum PostType {
	Normal,
	Small,
}
</script>

<template>
	<ScaleFadeSlide>
		<div class="flex flex-col max-w-full font-inter cursor-pointer">
			<div class="flex flex-col min-w-0 grow gap-y-1">
				<div
					class="flex flex-row overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap w-full">
					<Link
						:href="`/user/${status.account.id}`"
						class="flex-shrink-0 mr-2"
						:title="`${status.account.display_name}'s profile'`">
						<img
							loading="lazy"
							alt=""
							:src="status.account.avatar"
							:class="[
								'bg-white overflow-hidden dark:bg-dark-800-800 rounded border border-gray-300 dark:border-dark-700',
								type === PostType.Normal
									? 'w-12 h-12'
									: 'w-10 h-10',
							]" />
					</Link>
					<div
						:class="[
							'flex flex-col grow',
							type === PostType.Small && 'text-sm',
						]">
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
							@{{ status.account.acct }}
						</h5>
					</div>
					<Link
						:href="`/posts/${status.id}`"
						:sidebar="status.id"
						class="text-sm text-gray-700 dark:text-gray-300 hover:underline"
						v-html="fromNow(new Date(status.created_at))">
					</Link>
				</div>
				<div class="flex flex-col gap-y-1">
					<ReplyTo v-if="status.in_reply_to_id" :status="status" />

					<div
						v-if="status.sensitive"
						class="flex gap-x-2 items-center font-bold dark:text-gray-100">
						{{
							status.spoiler_text === ""
								? "Marked as sensitive"
								: withEmojis(status.spoiler_text, status.emojis)
						}}

						<Button
							class="!py-1 !px-2"
							@click="toggleShow"
							theme="gray">
							{{ show ? "Hide" : "Show" }}
						</Button>
					</div>

					<p
						ref="textRef"
						v-html="withEmojis(status.content, status.emojis)"
						:class="
							classNames(
								'mt-1 status-text rounded text-sm duration-200 status-text dark:text-gray-50 break-words max-w-full',
								status.sensitive && !show && 'filter blur-lg',
								clamps && !expand && 'line-clamp-6'
							)
						"></p>

					<button
						v-if="clamps"
						@click="toggleExpand"
						class="mx-auto w-full text-sm text-blue-800 dark:text-blue-100 hover:underline">
						<template v-if="expand">Less</template>
						<template v-else="expand">More</template>
					</button>

					<Poll v-if="status.poll" :status="status" />

					<Reactions
						:status="status"
						v-if="status.emoji_reactions.length > 0" />

					<StatusAttachments
						:status="status"
						v-if="status.media_attachments.length > 0" />
				</div>
			</div>

			<InteractionBar v-if="props.interaction" :status="status" />
		</div>
	</ScaleFadeSlide>
</template>
