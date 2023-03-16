<script setup lang="ts">
import generator, { detector } from 'megalodon';
import { store } from '../../utils/store';
import Button from '../button/Button.vue';
import { ref } from 'vue';

const loading = ref<boolean>(false);

const token = new URLSearchParams(document.location.search).get("code") ??
	new URLSearchParams(document.location.search).get("token") ?? false;

if (token) {
	if (store.auth.type && store.auth.url) {
		const client = generator(store.auth.type, store.auth.url);
		client.fetchAccessToken(store.auth.clientId, store.auth.clientSecret, token, `http://${window.location.host}`)
			.then(async (tokenData) => {
				store.auth.token = tokenData.accessToken
				const client = generator(store.auth.type as any, store.auth.url, store.auth.token);

				setTimeout(() => {
					window.location.href = "/";
				}, 400);
			});
	}
}

const submit = async (e: Event) => {
	e.preventDefault();
	loading.value = true;
	
	const handle = ((e.target as HTMLFormElement)["handle"] as HTMLInputElement).value;

	let domain = "";

	if ((handle.match(/@/g) ?? []).length <= 2 && (handle.match(/@/g) ?? []).length >= 0)
		domain = handle.split("@")[(handle.match(/@/g) ?? []).length];
	else {
		console.error("Invalid handle");
		// TODO: Add error
	}

	store.auth.url = `https://${domain}`;
	store.auth.type = await detector(store.auth.url);

	const client = generator(store.auth.type, store.auth.url);

	let scope = ["read", "write", "follow"];
	if (store.auth.type === "misskey")
		scope = [
			"read:account",
			"write:account",
			"read:blocks",
			"write:blocks",
			"read:drive",
			"write:drive",
			"read:favorites",
			"write:favorites",
			"read:following",
			"write:following",
			"read:messaging",
			"write:messaging",
			"read:mutes",
			"write:mutes",
			"write:notes",
			"read:notifications",
			"write:notifications",
			"read:reactions",
			"write:reactions",
			"write:votes",
			"read:pages",
			"write:pages",
			"write:page-likes",
			"read:page-likes",
			"read:user-groups",
			"write:user-groups",
			"read:channels",
			"write:channels",
			"read:gallery",
			"write:gallery",
			"read:gallery-likes",
			"write:gallery-likes",
		];
	
	const { clientId, clientSecret, url } = await client.registerApp("Fedibase Web", {
		scopes: scope,
		redirect_uris: `http://${window.location.host}`
	});

	store.auth.clientId = clientId;
	store.auth.clientSecret = clientSecret;


	// Wait for localStorage to update
	setTimeout(() => {
		url && window.location.replace(url);
	}, 400)
}
</script>

<template>
	<div class="flex justify-center min-h-screen">
		<div class="py-12 w-[30rem] flex flex-col justify-center sm:px-6 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<div class="flex justify-center w-auto">

				</div>
				<h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-gray-50 font-poppins">
					Login
				</h2>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="px-4 py-8 sm:px-10 font-inter">
					<h4 v-if="token" class="dark:text-gray-100">
						Validating...
					</h4>

					<form v-else class="space-y-6" action="#" method="POST" @submit="submit">
						<label htmlFor="handle">Fedi handle</label>
						<input id="handle" name="handle" type="handle" autoComplete="url" required
							placeholder="@cpluspatch@fedi.cpluspatch.com" isLoading={isLoading}
							class="block px-3 py-2 w-full outline-none placeholder-gray-400 rounded-md border-2 border-gray-300 shadow-sm duration-200 appearance-none dark:placeholder-gray-500 dark:border-gray-600 disabled:bg-gray-100 disabled:dark:bg-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"/>

						<div>
							<Button type="submit" ringColor="orange-500" theme="orange" class="w-full" :loading="loading">
								Sign in
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>