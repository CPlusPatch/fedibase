<script setup lang="ts">
import { useStore } from "~/utils/store";
import Button from "~/components/button/Button.vue";
import {
	NotificationType,
	addNotification,
} from "~/components/snackbar/Snackbar.vue";
definePageMeta({
	layout: "settings",
});

const store = useStore();

const account = store.auth.data;
const note = ref("");
const displayName = ref("");
const loading = ref(false);

if (!account)
	throw createError({
		statusCode: 401,
		statusMessage: "You are not logged in",
	});

onMounted(() => {
	note.value = account.source?.note ?? "";
	displayName.value = account.display_name;
});

const save = () => {
	loading.value = true;
	store.client
		?.updateCredentials({
			display_name: displayName.value,
			note: note.value,
		})
		.then(res => {
			addNotification(
				"Changed account!",
				NotificationType.Normal,
				"ic:round-check"
			);
			store.auth.data = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
};
</script>

<template>
	<div
		class="flex flex-col gap-y-4 w-full pb-5 rounded-b bg-gray-50 dark:bg-dark-800"
		@keyup="
			e => {
				if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
					e.preventDefault();
					save();
				}
			}
		"
		@keydown="
			e => {
				if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
					e.preventDefault();
				}
			}
		">
		<div class="w-full relative">
			<div
				class="flex overflow-hidden justify-center items-center w-full h-56 bg-gray-200 dark:bg-dark-800 rounded-t">
				<div
					:style="{
						backgroundImage: `url(${account.header})`,
					}"
					class="w-full h-full bg-center bg-cover"
					alt=""
					loading="lazy" />
			</div>
			<img
				loading="lazy"
				class="absolute -bottom-5 left-5 w-20 h-20 rounded border dark:border-dark-700"
				:src="account.avatar"
				:alt="account.acct" />
		</div>
		<div class="flex flex-row gap-x-2 justify-between mt-4 w-full">
			<div class="flex flex-col gap-y-2 text-ellipsis ml-4">
				<input
					v-model="displayName"
					:disabled="loading"
					class="flex-shrink disabled:opacity-70 dark:text-white bg-dark-700 px-2 py-1 rounded ring-orange-600 outline-none duration-200 focus:ring-2" />
				<h6
					:title="account.acct"
					class="text-sm text-gray-500 dark:text-gray-400">
					@{{ account.acct }}
				</h6>
			</div>
			<div class="flex items-center gap-x-1"></div>
		</div>
		<textarea
			v-model="note"
			:disabled="loading"
			class="p-3 bio disabled:opacity-70 mx-4 text-sm rounded-md dark:text-gray-50 break-all no-scroll ring-orange-600 outline-none duration-200 focus:ring-2 min-h-70 bg-dark-700"></textarea>

		<div
			v-if="account.fields.length > 0"
			class="gap-y-2 flex flex-col bio mx-4 dark:divide-gray-700 text-sm dark:text-gray-50">
			<div
				v-for="field of account.source?.fields"
				:key="field.name"
				class="flex md:flex-row gap-x-3 gap-y-2 flex-col">
				<input
					disabled
					class="md:w-1/3 disabled:opacity-70 font-bold text-xs md:text-sm bg-dark-700 p-2 rounded ring-orange-600 outline-none duration-200 focus:ring-2"
					:value="field.name" />
				<input
					disabled
					class="md:w-2/3 disabled:opacity-70 break-all bg-dark-700 p-2 rounded ring-orange-600 outline-none duration-200 focus:ring-2"
					:value="field.value" />
			</div>
		</div>
	</div>

	<Button
		:loading="loading"
		theme="gradientOrange"
		class="w-full mb-10 mt-5"
		@click="save"
		>Save</Button
	>
</template>
