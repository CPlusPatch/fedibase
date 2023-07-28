<script setup lang="ts">
import { useStore } from "~/utils/store";

const store = useStore();

enum SettingType {
	Boolean = "boolean",
}

interface Setting {
	name: string;
	title: string;
	value: any;
	type: SettingType;
}

const getSetting = (name: string, defaultValue: any) =>
	store.settings[name] ?? defaultValue;

const settings = ref<Setting[]>([
	{
		name: "expandImages",
		title: "Show full-height images instead of landscape preview",
		value: getSetting("expandImages", false),
		type: SettingType.Boolean,
	},
	{
		name: "showReactions",
		title: "Show emoji reactions in timeline",
		value: getSetting("showReactions", true),
		type: SettingType.Boolean,
	},
]);

const updateValue = (name: Setting["name"], value: any) => {
	settings.value = settings.value.map(s =>
		s.name === name
			? {
					...s,
					value,
			  }
			: s
	);

	store.settings = settings.value
		.map(s => ({
			[s.name]: s.value,
		}))
		.reduce((previous, current) => ({
			...previous,
			...current,
		}));
};
</script>

<template>
	<div
		class="flex flex-col gap-y-4 w-full py-5 rounded-b bg-gray-50 dark:bg-dark-800">
		<div v-for="setting in settings" :key="setting.name">
			<div
				v-if="setting.type === SettingType.Boolean"
				class="flex flex-row justify-between">
				<span class="text-sm text-white">{{ setting.title }}</span>

				<button
					class="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none"
					@click="updateValue(setting.name, !setting.value)">
					<span
						aria-hidden="true"
						:class="[
							setting.value ? 'bg-orange-600' : 'bg-dark-200',
							'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
						]" />
					<span
						aria-hidden="true"
						:class="[
							setting.value ? 'translate-x-5' : 'translate-x-0',
							'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-dark-200 rounded-full bg-dark shadow transform ring-0 transition-transform ease-in-out duration-200',
						]" />
				</button>
			</div>
		</div>
	</div>
</template>
