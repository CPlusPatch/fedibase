<script setup lang="ts">
import generator from "megalodon";
import Nav from "./components/Nav.vue";
import { store } from "./utils/store";
import { FastClick } from "fastclick";
import NotificationsFeed from "./components/feed/NotificationsFeed.vue";
import LeftSidebar from "./components/sidebar/LeftSidebar.vue";
import EditorModal from "./components/editor/EditorModal.vue";
import Snackbar from "./components/snackbar/Snackbar.vue";
import MobileNavbar from "./components/layout/MobileNavbar.vue";
import { onUnmounted, ref, watch } from "vue";
import Login from "./components/login/Login.vue";

if (store.auth.type && store.auth.url && store.auth.token) {
	store.client = generator(store.auth.type, store.auth.url, store.auth.token);
} else {
	store.client = null;
}

const width = window.innerWidth;

if (!store.auth.instance)
	store.client?.getInstance().then(res => {
		store.auth.instance = res.data;
	});

store.client?.getInstanceCustomEmojis().then(res => {
	store.emojis = res.data;
})

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

const paths = ref(window.location.pathname.split("/"));

watch(
	() => store.path,
	() => {
		paths.value = store.path.split("/");
	}
);

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

const updatePath = () => {
	paths.value = window.location.pathname.split("/");
}

window.addEventListener("popstate", updatePath);

FastClick.attach(document.body);

onUnmounted(() => {
	window.removeEventListener("popstate", updatePath);
});
</script>

<template>
	<template v-if="store.client && store.auth.token" :key="store.auth.token">
		<EditorModal />
		<div
			class="relative duration-200 font-inter dark:bg-dark-800 flex h-screen w-screen">
			<Nav />

			<div
				class="flex overflow-hidden h-screen duration-200 grow flex-col relative">
				<div
					class="grid grid-cols-6 bg-gradient-light h-full md:grid-cols-11 rounded-t-lg">
					<div
						class="hidden h-full md:col-span-3 md:block overflow-hidden no-scroll">
						<LeftSidebar />
					</div>
					<div
						class="overflow-x-hidden overflow-y-hidden md:col-span-5 col-span-6 max-h-screen md:border-x dark:border-gray-700 md:pt-0">
						<RouterView />
					</div>
					<div
						class="hidden overflow-x-hidden p-4 max-h-screen md:col-span-3 md:flex">
						<NotificationsFeed :title="true" v-if="width > 768" />
					</div>
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
