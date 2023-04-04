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
import { onMounted, onUnmounted, ref, watch } from "vue";
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

const updateOffset = (event: any) => {
	window.pageYOffset = (event.target as HTMLDivElement).scrollTop;
}

onMounted(() => {
	setTimeout(() => {
		document.getElementById("feed")?.addEventListener("scroll", updateOffset, {
			passive: true,
		})
	}, 1000);
})

onUnmounted(() => {
	document.getElementById("feed")?.removeEventListener("scroll", updateOffset);
});
</script>

<template>
	<template v-if="store.client && store.auth.token" :key="store.auth.token">
		<EditorModal />
		<div class="relative duration-200 font-inter dark:bg-dark-800 flex h-screen w-screen bg-gradient-light">
			<Nav />

			<div class="grid grid-cols-6 justify-between grid-flow-row md:grid-cols-12 w-full max-w-[90rem] mx-auto">
				<div
					:class="['hidden md:col-span-3 md:block m-3 no-scroll overflow-y-hidden', store.viewingConversation && 'dark:bg-dark-800 bg-gray-50 rounded-md border dark:border-gray-700 px-2']">
					<LeftSidebar />
				</div>
				<div
					class="overflow-x-hidden md:col-span-5 col-span-6 pt-3">
					<router-view v-slot="{ Component }: any">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</router-view>
				</div>
				<div
					class="hidden overflow-x-hidden p-4 m-3 max-h-screen md:col-span-4 md:flex dark:bg-dark-800 bg-gray-50 rounded-md border dark:border-gray-700">
					<NotificationsFeed :title="true" v-if="width > 768" />
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
