<script setup lang="ts">
import { FastClick } from "fastclick";
import generator from "megalodon";
import NotificationsFeed from "~/components/feed/NotificationsFeed.vue";
import MobileNavbar from "~/components/layout/MobileNavbar.vue";
import LeftSidebar from "~/components/sidebar/LeftSidebar.vue";
import { store } from "~/utils/store";

const updateOffset = (event: any) => {
	window.pageYOffset = (event.target as HTMLDivElement).scrollTop;
};

if (store.auth.type && store.auth.url && store.auth.token) {
	console.log("yay");
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
	.catch(err => {
		store.client = null;
	});

if (store.theme === "dark") {
	document.getElementsByTagName("html")[0].classList.add("dark");
}

store.notifications = [];
store.savedFeed = [];
store.feedScroll = 0;

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

onUnmounted(() => {
	document
		.getElementById("feed")
		?.removeEventListener("scroll", updateOffset);
});
</script>

<template>
	<template v-if="store.client && store.auth.token" :key="store.auth.token">
		<EditorModal />
		<div
			class="relative duration-200 dark:bg-dark-800 flex h-screen w-screen">
			<Nav />

			<div
				class="grid grid-cols-6 justify-between overflow-hidden pt-4 gap-x-4 px-4 grid-flow-row md:grid-cols-8 xl:grid-cols-12 w-full max-w-[90rem] mx-auto">
				<div
					:class="[
						'hidden md:col-span-3 md:block no-scroll overflow-y-scroll',
						store.viewingConversation &&
							'dark:bg-dark-800 bg-gray-50 rounded-md border dark:border-dark-700',
					]">
					<LeftSidebar />
				</div>
				<div
					class="overflow-x-hidden md:col-span-5 col-span-6 border dark:border-dark-700 rounded-md dark:bg-dark-800">
					<slot />
				</div>
				<div
					class="hidden overflow-x-hidden p-4 md:col-span-0 max-h-screen xl:col-span-4 xl:flex dark:bg-dark-800 rounded-md border dark:border-dark-700">
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
