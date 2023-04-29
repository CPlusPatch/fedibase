<script setup lang="ts">
import { Entity } from "megalodon";
import { ref } from "vue";
import Button from "../button/Button.vue";
import { fromNow } from "../../utils/functions";
import { useStore } from "../../utils/store";

const store = useStore();

const props = defineProps<{
	status: Entity.Status;
}>();

const _poll = ref<Entity.Poll | null>(props.status.poll);

const onSubmit = (e: Event) => {
	e.preventDefault();
	const value = [];

	if (!_poll.value) return false;

	for (let i = 0; i < (e.target as any).poll.length; i++) {
		if ((e.target as any).poll[i].checked)
			value.push((e.target as any).poll[i].value);
	}
	store.client
		?.votePoll(_poll.value?.id, value, props.status.id)
		.then(res => {
			_poll.value = res.data;
		});
};
</script>

<template>
	<form
		v-if="_poll"
		class="list-inside flex-col gap-y-2 flex"
		action="#"
		@submit="onSubmit">
		<li
			v-for="(option, index) of _poll.options"
			:key="index"
			class="flex flex-row gap-x-1 items-center relative dark:text-gray-100">
			<div
				:style="{
					width: `${Math.round(
						((option.votes_count ?? 0) /
							(_poll?.votes_count ?? 0)) *
							100
					)}%`,
				}"
				class="absolute max-w-full bg-gradient-to-l from-pink-300 via-purple-300 to-indigo-400 rounded-sm h-full z-0"></div>

			<span
				class="w-10 z-10 font-mono flex items-center justify-center leading-tight">
				{{
					Number.isNaN(
						Math.round(
							((option.votes_count ?? 0) /
								(_poll?.votes_count ?? 0)) *
								100
						)
					)
						? 0
						: Math.round(
								((option.votes_count ?? 0) /
									(_poll?.votes_count ?? 0)) *
									100
						  )
				}}%
			</span>

			<input
				v-if="!_poll?.voted"
				:type="_poll?.multiple ? 'checkbox' : 'radio'"
				name="poll"
				class="z-10 focus:outline-none focus:ring-0 rounded outline-none m-0 p-0 mr-2"
				:value="index" />

			<span class="z-10">{{ option.title }}</span>
		</li>

		<div class="text-sm text-gray-500 dark:text-gray-400">
			<Button
				v-if="!_poll?.voted"
				theme="gray"
				type="submit"
				class="!px-2 !py-1 mr-2">
				Vote
			</Button>

			{{ _poll?.votes_count }} people voted &middot;
			{{ _poll?.expired ? "Poll ended" : "Poll ends" }}
			{{ fromNow(new Date(_poll?.expires_at ?? "")) }}
		</div>
	</form>
</template>
