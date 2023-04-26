<script setup lang="ts">
import "./styles/index.css";
import Client, { ApiType } from "./app/api/Client";

const client = new Client(
	new URL(store.auth.url),
	store.auth.token ?? "",
	ApiType.Pleroma
);

client.getHomeTimeline().then(res => {
	console.log(res);
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<VitePwaManifest />
</template>
