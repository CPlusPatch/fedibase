<script setup lang="ts">
import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { withEmojis, findMentions } from "../../utils/functions";
import { useStore } from "../../utils/store";
import Button from "../button/Button.vue";
import Status, { PostType } from "../status/Status.vue";
import SmallSelect, {
	SelectOrientation,
	SelectDirection,
} from "../select/SmallSelect.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";
import Input from "../input/Input.vue";
import ScaleFadeSlide from "../transitions/ScaleFadeSlide.vue";
import Files from "./Files.vue";

const store = useStore();

const props = withDefaults(
	defineProps<{
		closeButton?: boolean;
		reRender?: () => void;
	}>(),
	{
		closeButton: true,
		reRender: () => {},
	}
);

interface PostMode {
	text: string;
	value: string;
	description: string;
	icon: any;
}

interface PostVisibility {
	text: string;
	value: string;
	description: string;
	icon: any;
}

const modes: PostMode[] = [
	{
		text: "Plaintext",
		value: "text",
		description: "Just plain text",
		icon: "ic:outline-format-align-left",
	},
	{
		text: "Markdown",
		value: "markdown",
		description: "Use Markdown syntax",
		icon: "ic:outline-format-color-text",
	},
];

const visibilities: PostVisibility[] = [
	{
		text: "Public",
		value: "public",
		description: "Post to public timelines",
		icon: "ic:outline-public",
	},
	{
		text: "Unlisted",
		value: "unlisted",
		description: "Don't post to public timelines",
		icon: "ic:outline-lock-open",
	},
	{
		text: "Private",
		value: "private",
		description: "Followers-only",
		icon: "ic:outline-lock",
	},
	{
		text: "Direct",
		value: "direct",
		description: "Send as Direct Message",
		icon: "ic:outline-email",
	},
];

const closeModal = (e: Event): void => {
	e.preventDefault();
	store.state.composer = false;
	store.quotingTo = null;
	store.replyingTo = null;
	props.reRender();
};

const otherPost = ref(store.replyingTo ?? store.quotingTo ?? null);
const characters = ref<string>("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const loading = ref<boolean>(false);
const contentWarning = ref<boolean>(
	(otherPost.value?.sensitive ?? false) ||
		(otherPost.value?.spoiler_text?.length ?? 0) > 0
);
const files = ref<
	{
		uuid: string;
		metadata: Entity.Attachment;
		file: File;
	}[]
>([]);

watch(
	() => store.replyingTo ?? store.quotingTo ?? null,
	() => {
		otherPost.value = store.replyingTo ?? store.quotingTo ?? null;
		characters.value = otherPost.value
			? findMentions(otherPost.value, store.auth.data?.id ?? "").join(
					" "
			  ) + " "
			: "";

		textareaRef.value?.setSelectionRange(
			textareaRef.value?.value.length,
			textareaRef.value?.value.length
		);

		textareaRef.value?.focus();
	}
);

const clickOnFileInput = (): void => {
	document.getElementById("fileUpload")?.click();
};

onMounted(() => {
	characters.value = otherPost.value
		? findMentions(otherPost.value, store.auth.data?.id ?? "").join(" ") +
		  " "
		: "";
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
				file,
			};
		})
	);

	addNotification(
		"Files uploaded!",
		NotificationType.Normal,
		"twotone-upload-file"
	);
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
		cw = (e.target as any).cw.value;
	} catch {
		//
	}
	// Waiting for megalodon to implement this
	// const mode = (e.target as any)["mode[value]"].value;

	store.client
		?.postStatus(characters.value, {
			visibility,
			in_reply_to_id: store.replyingTo?.id ?? undefined,
			quote_id: store.quotingTo?.id ?? undefined,
			spoiler_text: cw.length > 0 ? cw : undefined,
			sensitive: cw.length > 0,
			media_ids:
				files.value.length > 0
					? files.value.map(f => f.metadata.id)
					: undefined,
		})
		.then(_ => {
			addNotification(
				"Post sent!",
				NotificationType.Normal,
				"ic:twotone-send"
			);
			closeModal(e);
		})
		.catch(err => {
			console.error(err);
			addNotification(
				"Error sending post",
				NotificationType.Normal,
				"ic:twotone-error"
			);
		})
		.finally(() => {
			loading.value = false;
		});
};
</script>

<template>
	<form
		action="#"
		class="relative text-sm w-full flex h-full"
		@keyup="e => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			(e.currentTarget as any).requestSubmit();
		}
	}"
		@submit="submit">
		<div
			:class="[
				'px-1 border py-1 w-full duration-200 flex flex-col rounded-lg dark:text-gray-100 border-gray-300 dark:border-dark-700 focus-within:ring-2 ring-orange-500 shadow-sm',
				loading
					? 'bg-gray-100 dark:bg-dark-800/75'
					: 'bg-white dark:bg-dark-800',
			]">
			<div class="flex justify-between p-3 w-full gap-x-2">
				<div class="flex flex-row items-center gap-x-3">
					<button v-if="closeButton" @click="closeModal">
						<Icon name="ic:twotone-close" class="w-5 h-5" />
					</button>

					<h1
						v-if="store.replyingTo"
						class="text-lg font-bold dark:text-gray-50 overflow-hidden whitespace-nowrap text-ellipsis">
						<Icon
							name="ic:twotone-chat-bubble"
							class="inline mr-2 mb-0.5" />
						<span
							v-html="
								withEmojis(
									store.replyingTo.account.display_name,
									store.replyingTo.account.emojis
								)
							"></span>
					</h1>
					<h1
						v-if="store.quotingTo"
						class="text-lg font-bold dark:text-gray-50 overflow-hidden whitespace-nowrap text-ellipsis">
						<Icon
							name="ic:twotone-format-quote"
							class="inline mr-2 mb-0.5" />
						<span
							v-html="
								withEmojis(
									store.quotingTo.account.display_name,
									store.quotingTo.account.emojis
								)
							"></span>
					</h1>
					<h1
						v-if="!store.replyingTo && !store.quotingTo"
						class="text-lg font-bold dark:text-gray-50">
						Compose
					</h1>
				</div>
			</div>

			<div
				v-if="store.replyingTo"
				class="px-4 opacity-60 max-h-40 no-scroll overflow-scroll">
				<Status
					:type="PostType.Tiny"
					:status="store.replyingTo"
					:interaction="false" />
			</div>

			<div
				v-if="store.quotingTo"
				class="px-4 opacity-60 max-h-40 no-scroll overflow-scroll">
				<Status
					:type="PostType.Tiny"
					:status="store.quotingTo"
					:interaction="false" />
			</div>

			<div class="relative">
				<textarea
					ref="textareaRef"
					v-model="characters"
					name="comment"
					rows="7"
					class="flex p-3 text-base outline-none no-scroll w-full bg-transparent border-0 resize-none disabled:text-gray-400 focus:ring-0 dark:placeholder:text-gray-400"
					placeholder="What's happening?"
					@paste="onPasteFile" />

				<div
					class="absolute flex-row bottom-0 right-0 pr-2 items-center flex">
					<span
						:class="[
							'text-gray-600 dark:text-gray-300',
							(characters.length ?? 0) >
								(store.auth.instance?.configuration.statuses
									.max_characters ?? 500) && '!text-red-600',
						]">
						{{
							(store.auth.instance?.configuration.statuses
								.max_characters ?? 500) -
							(characters.length ?? 0)
						}}
					</span>
				</div>
			</div>

			<Files
				v-if="files.length > 0"
				:files="files"
				:on-remove="
					uuid => {
						files = files.filter(f => f.uuid !== uuid);
					}
				" />

			<ScaleFadeSlide>
				<Input
					v-if="contentWarning"
					name="cw"
					:loading="loading"
					placeholder="Add content warning"
					class="!bg-orange-500/10 border-none tetx-sm !px-3"
					:value="otherPost?.spoiler_text" />
			</ScaleFadeSlide>

			<div
				class="flex inset-x-0 bottom-0 py-2 px-2 flex-row justify-between items-center">
				<div class="flex flex-row">
					<button
						type="button"
						title="Attach a file"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="clickOnFileInput">
						<Icon
							name="ic:outline-attach-file"
							class="w-6 h-6"
							aria-hidden="true" />
					</button>

					<input
						id="fileUpload"
						type="file"
						aria-hidden="true"
						class="hidden"
						multiple
						@change="clickOnFiles" />

					<SmallSelect
						:items="modes"
						:default-value="0"
						:direction="SelectDirection.Center"
						:orientation="SelectOrientation.Up"
						name="mode" />

					<SmallSelect
						:items="visibilities"
						:default-value="
							store.replyingTo || store.quotingTo
								? visibilities.findIndex(
										v =>
											(
												store.replyingTo ??
												store.quotingTo
											)?.visibility == v.value
								  )
								: 0
						"
						:orientation="SelectOrientation.Up"
						name="visibility" />

					<button
						type="button"
						title="Create poll"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
						<Icon
							name="ic:outline-insert-chart"
							class="w-6 h-6"
							aria-hidden="true" />
					</button>

					<button
						type="button"
						title="Add content warning"
						class="flex relative flex-row gap-x-1 items-center p-2 text-gray-600 rounded duration-200 cursor-default dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="toggleCW">
						<Icon
							name="ic:round-warning"
							class="w-6 h-6"
							aria-hidden="true" />
					</button>
				</div>

				<Button :loading="loading" theme="gradientOrange" type="submit">
					Post
				</Button>
			</div>
		</div>
	</form>
</template>
