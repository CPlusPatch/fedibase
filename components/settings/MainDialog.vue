<script setup lang="ts">
import { useStore } from "~/utils/store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = useStore();

const settings = [
	{
		name: "Account",
		icon: "ic:round-account-box",
	},
	/* {
		name: "Appearance",
		icon: "ic:round-color-lens",
		href: "/settings/appearance/",
	}, */
];

const fullscreen = ref(false);
</script>

<template>
	<HeadlessTransitionRoot :show="true" as="template">
		<HeadlessDialog as="div" class="block relative z-40">
			<ModalsModalOverlay />
			<div
				class="flex justify-center fixed inset-0 no-scroll py-5 items-start p-2 md:items-center">
				<HeadlessTransitionChild
					as="template"
					enter="ease-in-out duration-300"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="ease-in duration-300"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95">
					<HeadlessDialogPanel
						:class="[
							'relative w-full divide-x-1 duration-200 divide-dark-900 ring-1 ring-dark-600 text-left transition-all transform  flex px-4 gap-x-4 rounded-xl bg-dark-800',
							fullscreen
								? 'h-full w-full'
								: 'sm:max-w-6xl max-h-70vh',
						]">
						<div
							class="md:flex hidden w-50 flex-col gap-y-3 overflow-y-scroll no-scroll py-4">
							<div
								class="flex flex-row gap-2 group children:h-3 children:w-3 children:rounded-full children:flex children:items-center children:justify-center">
								<div class="bg-red hover:cursor-pointer"></div>
								<div
									class="bg-yellow hover:cursor-pointer"></div>
								<div
									class="bg-green hover:cursor-pointer"
									@click="fullscreen = !fullscreen"></div>
							</div>
							<div
								v-for="setting of settings"
								:key="setting.name"
								class="text-gray-100 flex gap-x-4 items-center p-2 ring-1 ring-dark-600 mx-0.5 bg-dark-700 duration-200 hover:cursor-pointer rounded">
								<Icon
									:name="setting.icon"
									class="h-6 w-6" /><span>{{
									setting.name
								}}</span>
							</div>
						</div>
						<div
							class="grow md:px-5 px-4 overflow-y-scroll no-scroll py-4">
							<SettingsAccount />
						</div>
					</HeadlessDialogPanel>
				</HeadlessTransitionChild>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>
