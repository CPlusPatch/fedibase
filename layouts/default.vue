<script setup lang="ts">
import NotificationsFeed from "~/components/feed/NotificationsFeed.vue";
import useWindowDimensions from "~/components/hooks/useWindowDimensions";
import MobileNavbar from "~/components/layout/MobileNavbar.vue";
import LeftSidebar from "~/components/sidebar/LeftSidebar.vue";
import { useStore } from "~/utils/store";

const store = useStore();

const updateOffset = (event: any) => {
	window.pageYOffset = (event.target as HTMLDivElement).scrollTop;
};

onMounted(() => {
	setTimeout(() => {
		document
			.getElementById("feed")
			?.addEventListener("scroll", updateOffset, {
				passive: true,
			});
	}, 1000);
});

const { width } = useWindowDimensions();

onUnmounted(() => {
	document
		.getElementById("feed")
		?.removeEventListener("scroll", updateOffset);
});
</script>

<template>
	<template v-if="store.client && store.auth.token">
		<EditorModal />
		<div
			class="relative duration-200 dark:bg-dark-800 flex h-screen w-screen font-sans">
			<Nav />

			<div
				class="grid grid-cols-6 justify-between gap-x-4 md:px-4 grid-flow-row md:grid-cols-8 xl:grid-cols-12 w-full max-w-[90rem] mx-auto">
				<div
					class="hidden md:col-span-3 md:block no-scroll overflow-y-scroll">
					<LeftSidebar />
				</div>
				<div
					class="flex overflow-hidden h-full w-full no-scroll md:col-span-5 col-span-6 md:border-x border-gray-300 dark:border-dark-700 dark:bg-dark-800">
					<slot />
				</div>
				<div
					v-if="width >= 1280"
					class="hidden overflow-x-hidden py-4 max-h-screen xl:col-span-4 xl:flex dark:bg-dark-800 rounded-md dark:border-dark-700">
					<NotificationsFeed :title="true" />
				</div>
			</div>
		</div>
		<MobileNavbar />
		<Snackbar />

		<TransitionsScaleFadeSlide>
			<div
				v-if="store.viewingImage"
				class="fixed inset-0 flex items-center justify-center z-999 p-10 bg-black/70 backdrop-blur-lg"
				@click="store.viewingImage = null">
				<img
					:src="store.viewingImage.url"
					class="object-contain max-h-full rounded"
					@click="$event.stopPropagation()" />
			</div>
		</TransitionsScaleFadeSlide>
	</template>
	<template v-else>
		<Login />
	</template>
</template>
