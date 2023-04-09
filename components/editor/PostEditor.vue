<script setup lang="ts">
import {
	IconAlignLeft,
	IconClock,
	IconLock,
	IconLockOpen,
	IconMail,
	IconMarkdown,
	IconWorld,
	IconX,
} from "@tabler/icons-vue";
import { withEmojis, findMentions } from "../../utils/functions";
import { store } from "../../utils/store";
import Button from "../button/Button.vue";
import Status, { PostType } from "../status/Status.vue";
import { onMounted, ref } from "vue";
import SmallSelect, { SelectOrientation } from "../select/SmallSelect.vue";
import { IconPaperclip } from "@tabler/icons-vue";
import { IconChartBar } from "@tabler/icons-vue";
import { IconAlertTriangle } from "@tabler/icons-vue";
import { v4 as uuidv4 } from "uuid";
import Files from "./Files.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import { IconSend } from "@tabler/icons-vue";
import { IconForbid2 } from "@tabler/icons-vue";
import { IconFileUpload } from "@tabler/icons-vue";
import Input from "../input/Input.vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import { SelectDirection } from "../select/SmallSelect.vue";

const props = withDefaults(defineProps<{
	closeButton?: boolean,
	reRender?: () => void
}>(), {
	closeButton: true,
	reRender: () => { }
})

const pollDurations = [
	{
		icon: IconClock,
		text: "5 minutes",
		value: "300",
	},
	{
		icon: IconClock,
		text: "30 minutes",
		value: "1800",
	},
	{
		icon: IconClock,
		text: "1 hour",
		value: "3600",
	},
	{
		icon: IconClock,
		text: "6 hours",
		value: "21600",
	},
	{
		icon: IconClock,
		text: "12 hours",
		value: "43200",
	},
	{
		icon: IconClock,
		text: "1 day",
		value: "86400",
	},
	{
		icon: IconClock,
		text: "3 days",
		value: "259200",
	},
	{
		icon: IconClock,
		text: "7 days",
		value: "604800",
	},
];

const modes = [
	{
		text: "Plaintext",
		value: "text",
		description: "Just plain text",
		icon: IconAlignLeft,
	},
	{
		text: "Markdown",
		value: "markdown",
		description: "Use Markdown syntax",
		icon: IconMarkdown,
	},
];

const visibilities = [
	{
		text: "Public",
		value: "public",
		description: "Post to public timelines",
		icon: IconWorld,
	},
	{
		text: "Unlisted",
		value: "unlisted",
		description: "Don't post to public timelines",
		icon: IconLockOpen,
	},
	{
		text: "Private",
		value: "private",
		description: "Followers-only",
		icon: IconLock,
	},
	{
		text: "Direct",
		value: "direct",
		description: "Send as Direct Message",
		icon: IconMail,
	},
];

const closeModal = (e: Event) => {
	e.preventDefault();
	store.state.composer = false;
	store.quotingTo = null;
	store.replyingTo = null;
	props.reRender();
};

const otherPost = store.replyingTo ?? store.quotingTo ?? null;
const characters = ref<string>("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const loading = ref<boolean>(false);
const contentWarning = ref<boolean>(
	(otherPost?.sensitive ?? false) ||
	((otherPost?.spoiler_text.length ?? 0) > 0 ?? false)
);
const files = ref<
	{
		uuid: string;
		metadata: Entity.Attachment;
		file: File;
	}[]
>([]);

const clickOnFileInput = () => {
	document.getElementById("fileUpload")?.click();
};

onMounted(() => {
	const otherPost = store.replyingTo ?? store.quotingTo ?? null;

	if (otherPost) {
		const id = store.auth.data?.id ?? "";
		const mentions = findMentions(otherPost, id).join(" ");

		if (mentions) {
			characters.value = `${mentions} `;
		}
	}

	textareaRef.value?.setSelectionRange(
		textareaRef.value?.value.length,
		textareaRef.value?.value.length
	);

	textareaRef.value?.focus();
});

const toggleCW = () => {
	contentWarning.value = !contentWarning.value;
};

const onPasteFile = async (event: ClipboardEvent) => {
	if (!event.clipboardData || event.clipboardData.files.length < 1) return;
	event.preventDefault();

	try {
		await uploadFiles(event.clipboardData.files);
	} catch (error) {
		addNotification("Error uploading images");
		console.error(error);
		// Handle error
	}
};

const uploadFiles = async (toUpload: FileList) => {
	loading.value = true;
	console.info(`Uploading ${toUpload.length} files`);

	const newFiles = await Promise.all(
		[...(toUpload as unknown as File[])].map(async file => {
			const upload = (await store.client?.uploadMedia(file)) as any;

			return {
				uuid: uuidv4(),
				metadata: upload.data,
				file: file,
			};
		})
	);

	addNotification("Files uploaded!", NotificationType.Normal, IconFileUpload);
	loading.value = false;
	files.value = [...files.value, ...newFiles];
};

const clickOnFiles = async (e: any) => {
	try {
		await uploadFiles((e.target as any).files);
	} catch (error) {
		console.error(error);
		// Handle error
	}
};

const submit = (e: Event) => {
	e.preventDefault();

	loading.value = true;
	const visibility = (e.target as any)["visibility[value]"].value;
	let cw = "";
	try {
		cw = (e.target as any)["cw"].value;
	} catch {
		//
	}
	// Waiting for megalodon to implement this
	const mode = (e.target as any)["mode[value]"].value;

	store.client
		?.postStatus(characters.value, {
			visibility: visibility,
			in_reply_to_id: store.replyingTo?.id ?? undefined,
			quote_id: store.quotingTo?.id ?? undefined,
			spoiler_text: cw.length > 0 ? cw : undefined,
			sensitive: cw.length > 0,
			media_ids:
				files.value.length > 0
					? files.value.map(f => f.metadata.id)
					: undefined,
		})
		.then(res => {
			addNotification("Post sent!", NotificationType.Normal, IconSend);
			closeModal(e);
		})
		.catch(err => {
			console.error(err);
			addNotification(
				"Error sending post",
				NotificationType.Normal,
				IconForbid2
			);
		});
};
</script>

<template>
	<form action="#" class="relative text-sm font-inter w-full flex h-full" @keyup="e => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			(e.currentTarget as any).requestSubmit();
		}
	}" @submit="submit">
		<div :class="[
			'px-1 border py-1 w-full duration-200 flex flex-col rounded-lg dark:text-gray-100 border-gray-300 dark:border-gray-700 focus-within:ring-2 ring-orange-500 shadow-sm',
			loading
				? 'bg-gray-100 dark:bg-dark-800/75'
				: 'bg-white dark:bg-dark-800',
		]">
			<div class="flex justify-between p-3 w-full gap-x-2">
				<div class="flex flex-row items-center gap-x-3">
					<button v-if="closeButton" @click="closeModal">
						<IconX class="w-5 h-5" />
					</button>

					<h1 v-if="store.replyingTo" class="text-lg font-bold dark:text-gray-50">
						Replying to
						<span v-html="
							withEmojis(
								store.replyingTo.account.display_name,
								store.replyingTo.account.emojis
							)
						"></span>
					</h1>
					<h1 v-if="store.quotingTo" class="text-lg font-bold dark:text-gray-50">
						Quoting
						<span v-html="
							withEmojis(
								store.quotingTo.account.display_name,
								store.quotingTo.account.emojis
							)
						"></span>
					</h1>
					<h1 v-if="!store.replyingTo && !store.quotingTo" class="text-lg font-bold dark:text-gray-50">
						Compose
					</h1>
				</div>
			</div>

			<div class="px-4 opacity-60 max-h-40 no-scroll overflow-scroll" v-if="store.replyingTo">
				<Status :type="PostType.Normal" :status="store.replyingTo" :interaction="false" />
			</div>

			<div class="relative">
				<textarea @paste="onPasteFile" name="comment" v-model="characters" rows="7" ref="textareaRef"
					class="flex p-3 text-base outline-none no-scroll w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
					placeholder="What's happening?" />

				<div class="absolute flex-row bottom-0 right-0 pr-2 items-center flex">
					<span :class="[
						'text-gray-600 dark:text-gray-300',
						(characters.length ?? 0) >
						(store.auth.instance?.configuration.statuses
							.max_characters ?? 500) &&
						'!text-red-600',
					]">
						<!-- {{
							(
								(store.auth.instance?.configuration.statuses
									.max_characters ?? 500) -
								(characters.length ?? 0)
							).toLocaleString("en", {
								notation: "compact",
							})
						}} -->
						{{ (store.auth.instance?.configuration.statuses
							.max_characters ?? 500) -
							(characters.length ?? 0) }}
					</span>
					<!-- <svg width="27" height="27" class="scale-75" view-box="0 0 27 27" aria-hidden="true">
						<circle cx="13.5" cy="13.5" r="10" fill="none" stroke-width="3"
							class="stroke-gray-500 dark:stroke-white/80"></circle>
						<circle cx="13.5" cy="13.5" r="10" fill="none" stroke-dasharray="62.832" :stroke-dashoffset="
							(1 -
								(characters.length ?? 0) /
								(store.auth.instance?.configuration
									.statuses.max_characters ??
									500)) *
							62.832
						" stroke-width="3.5" class="stroke-orange-500"></circle>
					</svg> -->
				</div>
			</div>

			<Files v-if="files.length > 0" :files="files" :on-remove="
				uuid => {
					files = files.filter(f => f.uuid !== uuid);
				}
			" />

			<ScaleFadeSlide :open="contentWarning" v-if="contentWarning">
				<Input name="cw" :loading="loading" placeholder="Add content warning"
					class="!bg-orange-500/10 border-none tetx-sm !px-3" :value="otherPost?.spoiler_text" />
			</ScaleFadeSlide>

			<div class="flex inset-x-0 bottom-0 py-2 px-2 flex-row space-x-1 items-center">
					<button @click="clickOnFileInput" type="button" title="Attach a file"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
						<IconPaperclip class="w-6 h-6" aria-hidden="true" />
					</button>

					<input @change="clickOnFiles" type="file" id="fileUpload" aria-hidden="true" class="hidden" multiple />

					<SmallSelect :items="modes" :defaultValue="0" :direction="SelectDirection.Center" :orientation="SelectOrientation.Up" name="mode" />

					<SmallSelect :items="visibilities" :defaultValue="
						store.replyingTo || store.quotingTo
							? visibilities.findIndex(
								v =>
									(
										store.replyingTo ??
										store.quotingTo
									)?.visibility == v.value
							)
							: 0
					" :orientation="SelectOrientation.Up" name="visibility" />

					<button type="button" title="Create poll"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
						<IconChartBar class="w-6 h-6" aria-hidden="true" />
					</button>

					<button type="button" title="Add content warning" @click="toggleCW"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
						<IconAlertTriangle class="w-6 h-6" aria-hidden="true" />
					</button>

					<Button :loading="loading" theme="orangeLight" type="submit"
							class="!px-4 !py-2 !text-base !ml-auto text-white dark:text-white !border-none !bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] !from-pink-500 !via-red-500 !to-yellow-500">
							Post
						</Button>
			</div>
		</div>
	</form>
</template>