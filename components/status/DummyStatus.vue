<script setup lang="ts">
import { useStore } from "~/utils/store";

const store = useStore();
</script>

<template>
	<div class="flex flex-col max-w-full cursor-pointer" aria-hidden="true">
		<div class="flex flex-col min-w-0 grow gap-y-2">
			<div
				class="flex flex-row overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap w-full">
				<div
					:class="[
						'md:w-12 md:h-12 w-10 h-10 mr-2 border border-gray-300 dark:border-gray-700 bg-gray-300 dark:bg-gray-500/40 animate-pulse',
						store.settings.roundAvatars
							? 'rounded-full'
							: 'rounded',
					]" />
				<div class="flex flex-col grow justify-around">
					<h4
						class="bg-gray-300 rounded h-4 dark:bg-gray-500/40 animate-pulse"
						:style="{
							width: `${Math.random() * 100 + 100}px`,
						}"></h4>
					<h5
						:style="{
							width: `${Math.random() * 150 + 100}px`,
						}"
						class="bg-gray-300 rounded h-4 dark:bg-gray-500/40 animate-pulse ml-0"></h5>
				</div>
				<div
					class="bg-gray-300 rounded w-12 h-4 dark:bg-gray-500/40 animate-pulse"></div>
			</div>
			<div class="flex flex-col gap-y-2">
				<p
					v-for="chance of Math.ceil(Math.random() * 4)"
					:key="chance"
					:style="{
						animationDelay: Math.random() * 2 + 's',
					}"
					class="w-full bg-gray-300 rounded h-5 dark:bg-gray-500/40 animate-pulse"></p>
				<p
					:style="{
						width: `${Math.random() * 100}%`,
					}"
					class="bg-gray-300 rounded h-5 dark:bg-gray-500/40 animate-pulse"></p>
			</div>
		</div>
	</div>
</template>
