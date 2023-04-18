<script setup lang="ts">
import { Entity } from "megalodon";
import { ref, watch } from "vue";
import { store } from "../../utils/store";
import Feed, { FeedType } from "./Feed.vue";
import UserProfile from "../profiles/UserProfile.vue";
import StatusVue, { PostType } from "../status/Status.vue";
import { IconPinFilled } from "@tabler/icons-vue";

const route = useRoute();

const account = ref<Entity.Account | null>(null);
const pinned = ref<Entity.Status[]>([]);
const id = ref<string>(route.params.id as string);

watch(
	() => route.params.id,
	newId => {
		id.value = newId as string;

		store.client?.getAccount(id.value).then(res => {
			account.value = res.data;
		});

		store.client
			?.getAccountStatuses(id.value, {
				pinned: true,
			})
			.then(res => {
				pinned.value = res.data;
			});
	}
);

store.client?.getAccount(id.value).then(res => {
	account.value = res.data;
});

store.client
	?.getAccountStatuses(id.value, {
		pinned: true,
	})
	.then(res => {
		pinned.value = res.data;
	});
</script>

<template>
	<div
		v-if="account"
		id="feed"
		class="flex overflow-y-scroll w-full h-full flex-col gap-y-4 no-scroll">
		<UserProfile :account="account" />
		<div class="pb-2 flex flex-col no-scroll">
			<div
				class="flex flex-col gap-y-2 duration-200 ease-in-out"
				v-if="pinned"
				v-for="pin of pinned">
				<div
					class="px-4 overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400">
					<IconPinFilled class="w-[1em] inline pb-0.5 mr-1" />
					Pinned
				</div>
				<StatusVue
					:type="PostType.Normal"
					:status="pin"
					:interaction="true" />
			</div>
			<Feed :type="FeedType.User" :id="account.id" />
		</div>
	</div>
</template>
