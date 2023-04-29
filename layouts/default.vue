<script setup lang="ts">
import { FastClick } from "fastclick";
import generator from "megalodon";
import NotificationsFeed from "~/components/feed/NotificationsFeed.vue";
import useWindowDimensions from "~/components/hooks/useWindowDimensions";
import MobileNavbar from "~/components/layout/MobileNavbar.vue";
import LeftSidebar from "~/components/sidebar/LeftSidebar.vue";
import { useStore } from "~/utils/store";

const store = useStore();

const updateOffset = (event: any) => {
	window.pageYOffset = (event.target as HTMLDivElement).scrollTop;
};

if (store.auth.type && store.auth.url && store.auth.token) {
	store.client = generator(store.auth.type, store.auth.url, store.auth.token);
} else {
	store.client = null;
}

if (!store.auth.instance)
	store.client?.getInstance().then(res => {
		store.auth.instance = res.data;
	});

store.client?.getInstanceCustomEmojis().then(res => {
	store.emojis = res.data;
});

store.client
	?.verifyAccountCredentials()
	.then(res => {
		store.auth.data = res.data;
	})
	.catch(_ => {
		store.client = null;
	});

if (store.theme === "dark") {
	document.getElementsByTagName("html")[0].classList.add("dark");
}

watch(
	() => store.auth.token,
	() => {
		store.client = generator(
			store.auth.type as any,
			store.auth.url,
			store.auth.token
		);
	}
);

FastClick.attach(document.body);

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
				class="grid grid-cols-6 justify-between overflow-hidden gap-x-4 md:px-4 grid-flow-row md:grid-cols-8 xl:grid-cols-12 w-full max-w-[90rem] mx-auto">
				<div
					class="hidden md:col-span-3 md:block no-scroll overflow-y-scroll">
					<LeftSidebar />
				</div>
				<div
					class="flex overflow-x-hidden flex-col md:py-4 h-full w-full no-scroll overflow-x-hidden md:col-span-5 col-span-6 md:border-x border-gray-300 dark:border-dark-700 dark:bg-dark-800">
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
	</template>
	<template v-else>
		<Login />
	</template>
</template>
