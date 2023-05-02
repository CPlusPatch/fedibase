<script setup lang="ts">
import "./styles/index.css";
import "@unocss/reset/tailwind.css";
import generator from "megalodon";
import { FastClick } from "fastclick";
import { useStore } from "./utils/store";

const store = useStore();

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
</script>

<template>
	<div class="dark">
		<NuxtLayout>
			<NuxtLoadingIndicator />
			<NuxtPage />
		</NuxtLayout>
	</div>
	<VitePwaManifest />
</template>
