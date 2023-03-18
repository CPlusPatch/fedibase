<script setup lang="ts">
import { Entity } from 'megalodon';
import ScaleFadeSlide from '../transitions/ScaleFadeSlide.vue';
import { withEmojis } from '../../utils/functions';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { store } from '../../utils/store';
import { IconCake } from '@tabler/icons-vue';
import { IconUserPlus } from '@tabler/icons-vue';
import { IconUsers } from '@tabler/icons-vue';
import { IconArticle } from '@tabler/icons-vue';
import { TransitionRoot } from '@headlessui/vue';

const props = defineProps<{
	account: Entity.Account;
}>();

const relationship = ref<Entity.Relationship | null>(null);

store.client?.getRelationship(props.account.id).then(res => {
	relationship.value = res.data;
});

const showHeader = ref<boolean>(false);

const onScroll = (e: Event) => {
	if ((e.target as HTMLDivElement).scrollTop > 350) showHeader.value = true;
	else showHeader.value = false;
}

onMounted(() => {
	document.getElementById("userview")?.addEventListener("scroll", onScroll);
})

onUnmounted(() => {
	document.getElementById("userview")?.removeEventListener("scroll", onScroll)
})
</script>

<template>
		<TransitionRoot as="template" :appear="true"
			:show="showHeader"
			enter="transform ease-out duration-300 transition"
			enter-from="-translate-y-2 opacity-0"
			enter-to="translate-y-0 opacity-100" leave="transition ease-in duration-100"
			leave-from="opacity-100 translate-y-0" leave-to="opacity-0 -translate-y-2">
		<div class="fixed md:hidden top-0 inset-x-0 bg-gray-50/75 dark:bg-dark-800/75 backdrop-blur-lg items-center z-10 flex p-4 gap-x-4">
			<img :src="account.avatar" class="w-10 h-10 rounded-lg border dark:border-gray-700" />
			<div class="grow flex flex-col">
				<h4 class="flex-shrink font-bold font-poppins dark:text-white"
					v-html="withEmojis(account.display_name, account.emojis)">
				</h4>
				<h6 :title="account.acct" class="text-sm text-gray-500 dark:text-gray-400 font-inter">
					@{{ account.acct }}
				</h6>
			</div>
		</div>
	</TransitionRoot>
	<ScaleFadeSlide :appear="true">
		<div class="flex flex-col gap-y-4 w-full bg-gray-50 pb-5 dark:bg-dark-800 rounded-b">
			<div class="w-full relative">
				<div
					class="flex overflow-hidden justify-center items-center w-full h-56 bg-gray-200 border dark:bg-dark-800 dark:border-gray-700">
					<div :style="{
						backgroundImage: `url(${account.header})`
					}" class="w-full h-full bg-center bg-cover" alt="" loading="lazy" />
				</div>
				<img loading="lazy" class="absolute -bottom-5 left-5 w-20 h-20 rounded-lg border dark:border-gray-700"
					:src="account.avatar" :alt="account.acct" />
			</div>
			<div class="flex flex-row gap-x-2 justify-between mt-4 w-full">
				<div class="flex flex-col gap-x-2 overflow-hidden text-ellipsis ml-4">
					<h4 class="flex-shrink text-xl font-bold font-poppins dark:text-white"
						v-html="withEmojis(account.display_name, account.emojis)">
					</h4>
					<h6 :title="account.acct" class="text-sm text-gray-500 dark:text-gray-400 font-inter">
						@{{ account.acct }}
					</h6>
				</div>
				<div class="flex items-center gap-x-1">

				</div>
			</div>
			<div v-html="withEmojis(account.note, account.emojis)" class="p-3 bio mx-4 text-sm rounded-md dark:text-gray-50 font-inter break-all">
			</div>

			<div class="md:flex grow md:flex-row mx-6 text-gray-600 dark:text-gray-300 font-inter items-center justify-between grid grid-cols-2 gap-y-3">
				<div class="flex items-center gap-x-1 justify-center">
					<IconCake class="inline w-5 h-5 mb-0.5" /> {{ new Intl.DateTimeFormat('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric'
					}).format(new Date(account.created_at)) }}
				</div>
				<div class="flex items-center gap-x-1 justify-center">
					<IconArticle class="inline w-5 h-5 mb-0.5" /> {{ account.statuses_count }} statuses
					</div>
				<div class="flex items-center gap-x-1 justify-center">
					<IconUserPlus class="inline w-5 h-5 mb-0.5" /> {{ account.followers_count }} followers
				</div>
				<div class="flex items-center gap-x-1 justify-center">
					<IconUsers class="inline w-5 h-5 mb-0.5" /> {{ account.following_count }} following
				</div>
			</div>

			<div
				class="gap-y-2 md:gap-y-0 flex flex-col bio md:divide-y mx-4 dark:divide-gray-700 text-sm rounded-md border dark:border-gray-700 dark:text-gray-50 font-inter">
				<div v-for="field of account.fields" :key="field.name" class="flex px-3 md:flex-row gap-x-3 flex-col py-2">
					<div class="w-1/3 font-bold text-xs md:text-sm" v-html="withEmojis(field.name, account.emojis)">
					</div>
					<div class="w-2/3" v-html="withEmojis(field.value, account.emojis)"></div>
				</div>
			</div>
		</div>
	</ScaleFadeSlide>
</template>