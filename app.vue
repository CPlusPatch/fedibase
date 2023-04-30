<script setup lang="ts">
import "./styles/index.css";
import "@unocss/reset/tailwind.css";
</script>

<template>
	<div class="dark">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
	<VitePwaManifest />
</template>
