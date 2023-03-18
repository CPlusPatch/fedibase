<script setup lang="ts">
import { Entity } from 'megalodon';
import Button from '../button/Button.vue';
import { fromNow } from '../../utils/functions';

const props = defineProps<{
	status: Entity.Status,
}>();
</script>

<template>
	<form class="list-inside flex-col gap-y-2 flex" action="#">
		<li v-for="option, index of status.poll.options" v-if="status.poll"
			class="flex flex-row gap-x-1 items-center relative dark:text-gray-100" :key="index">
			<div :style="{
				width: `${Math.round(
					((option.votes_count ?? 0) /
						(status.poll?.votes_count ?? 0)) *
					100
				)}%`
			}" class="absolute max-w-full bg-gradient-to-l from-pink-300 via-purple-300 to-indigo-400 rounded-sm h-full z-0">
			</div>

			<span class="w-10 z-10 font-mono flex items-center justify-center leading-tight">
				{{ Number.isNaN(
					Math.round(
						((option.votes_count ?? 0) /
							(status.poll?.votes_count ?? 0)) *
						100
					)
				)
					? 0
					: Math.round(
						((option.votes_count ?? 0) /
							(status.poll?.votes_count ?? 0)) *
						100
					) }}%
			</span>

			<input v-if="!status.poll?.voted" :type="status.poll?.multiple ? 'checkbox' : 'radio'" name="poll"
				class="z-10 focus:outline-none focus:ring-0 rounded outline-none m-0 p-0 mr-2" :value="index" />

			{{ option.title }}
		</li>

		<div class="text-sm text-gray-500 dark:text-gray-400">
			<Button theme="gray" type="submit" class="!px-2 !py-1 mr-2" v-if="!status.poll?.voted">
				Vote
			</Button>

			{{ status.poll?.votes_count }} people voted &middot; {{ status.poll?.expired ? "Poll ended" : "Poll ends" }} {{ fromNow(new Date(status.poll?.expires_at ?? "")) }}
		</div>
	</form>
</template>