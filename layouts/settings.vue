<script setup lang="ts">
import Nav from "~/components/Nav.vue";

interface Setting {
	name: string;
	icon: string;
	href: string;
}

const settings: Setting[] = [
	{
		name: "Account",
		icon: "ic:round-account-box",
		href: "/settings/account/",
	},
	/* {
		name: "Appearance",
		icon: "ic:round-color-lens",
		href: "/settings/appearance/",
	}, */
];

const currentSetting = ref<Setting>(settings[0]);
</script>

<template>
	<div
		class="relative duration-200 dark:bg-dark-800 flex h-screen w-screen font-sans">
		<Nav />

		<div class="flex w-full max-w-5xl mx-auto gap-x-4">
			<div class="md:flex hidden w-50 flex-col gap-y-3 py-10">
				<button
					v-for="setting of settings"
					:key="setting.name"
					class="text-gray-100 flex gap-x-4 items-center p-2 hover:ring-2 ring-orange-600 bg-dark-700 duration-200 w-full rounded"
					@click="currentSetting = setting">
					<Icon :name="setting.icon" class="h-6 w-6" /><span>{{
						setting.name
					}}</span>
				</button>
			</div>
			<div
				class="grow bg-dark-700 py-10 md:px-10 px-4 overflow-y-scroll no-scroll">
				<slot />
			</div>
		</div>

		<LayoutMobileNavbar :disable-composer="true" />
	</div>
	<Snackbar />
</template>
