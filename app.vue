<script setup lang="ts">
import "./styles/index.css";
import "@unocss/reset/tailwind.css";
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
