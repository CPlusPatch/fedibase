<script setup lang="ts">
import { Entity } from "megalodon";
import { useStore } from "../../utils/store";
import UserProfile from "../profiles/UserProfile.vue";
import StatusVue, { PostType } from "../status/Status.vue";
import Feed, { FeedType } from "./Feed.vue";

const store = useStore();

const route = useRoute();

const account = ref<Entity.Account | null>(null);
const pinned = ref<Entity.Status[]>([]);
const id = ref<string>(route.params.id as string);

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

useHead({
	title: () =>
		`${
			account.value ? "@" + account.value?.username : "Loading..."
		} · Fedibase`,
});
</script>

<template>
	<div
		v-if="account"
		id="feed"
		class="flex overflow-y-scroll w-full h-full flex-col gap-y-2 no-scroll">
		<UserProfile :account="account" />
		<div class="pb-2 flex flex-col no-scroll gap-y-4 px-6">
			<div
				v-for="pin of pinned"
				:key="pin.id"
				class="flex flex-col gap-y-2 duration-200 ease-in-out">
				<div
					class="overflow-hidden gap-x-1 max-w-full font-semibold text-gray-500 overflow-ellipsis dark:text-gray-400">
					<Icon
						name="ic:twotone-push-pin"
						class="w-[1em] inline pb-0.5 mr-1" />
					Pinned
				</div>
				<StatusVue
					:type="PostType.Normal"
					:status="pin"
					:interaction="true" />
			</div>
			<Feed
				:type="FeedType.User"
				:retrieve-results="
					async (limit, since_id, max_id) => {
						return (
							(
								await store.client?.getAccountStatuses(
									account?.id ?? '',
									{
										limit,
										since_id,
										max_id,
									}
								)
							)?.data ?? []
						);
					}
				" />
		</div>
	</div>
</template>
