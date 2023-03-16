<script setup lang="ts">
import { Entity } from 'megalodon';
import ScaleFadeSlide from '../transitions/ScaleFadeSlide.vue';
import { withEmojis } from '../../utils/functions';
import { ref } from 'vue';
import { store } from '../../utils/store';

const props = defineProps<{
	account: Entity.Account;
}>();

const relationship = ref<Entity.Relationship | null>(null);

store.client?.getRelationship(props.account.id).then(res => {
	relationship.value = res.data;
})
</script>

<template>
	<ScaleFadeSlide :appear="true">
		<div class="flex flex-col gap-y-4 w-full">
			<div class="w-full relative">
				<div
					class="flex overflow-hidden justify-center items-center w-full h-44 bg-gray-200 rounded border dark:bg-dark-800 dark:border-gray-700">
					<img :src="account.header" class="w-full" alt="" loading="lazy" />
				</div>
				<img loading="lazy" class="absolute -bottom-5 left-5 w-20 h-20 rounded border dark:border-gray-700"
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
			<div v-html="withEmojis(account.note, account.emojis)" class="p-3 w-full text-sm rounded-md border dark:border-gray-700 dark:text-gray-50 font-inter break-all">
			</div>
			<div
				class="w-full gap-y-2 md:gap-y-0 flex flex-col md:divide-y dark:divide-gray-700 text-sm rounded-md border dark:border-gray-700 dark:text-gray-50 font-inter">
				<div v-for="field of account.fields" :key="field.name" class="flex px-3 md:flex-row gap-x-3 flex-col py-2">
					<div class="w-1/3 font-bold text-xs md:text-sm" v-html="withEmojis(field.name, account.emojis)">
					</div>
					<div class="w-2/3" v-html="withEmojis(field.value, account.emojis)"></div>
				</div>
			</div>
		</div>
	</ScaleFadeSlide>
</template>