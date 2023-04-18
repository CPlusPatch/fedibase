<script setup lang="ts">
import generator, { detector } from "megalodon";
import { store } from "../../utils/store";
import Button from "../button/Button.vue";
import { ref } from "vue";
import Input from "../input/Input.vue";
import { IconUser } from "@tabler/icons-vue";

const loading = ref<boolean>(false);

const token =
	new URLSearchParams(document.location.search).get("code") ??
	new URLSearchParams(document.location.search).get("token") ??
	false;

if (token) {
	if (store.auth.type && store.auth.url) {
		const client = generator(store.auth.type, store.auth.url);
		client
			.fetchAccessToken(
				store.auth.clientId,
				store.auth.clientSecret,
				token,
				`http://${window.location.host}`
			)
			.then(async tokenData => {
				store.auth.token = tokenData.accessToken;
				const client = generator(
					store.auth.type as any,
					store.auth.url,
					store.auth.token
				);

				setTimeout(() => {
					window.location.href = "/";
				}, 400);
			});
	}
}

const submit = async (e: Event) => {
	e.preventDefault();
	loading.value = true;

	const handle = ((e.target as HTMLFormElement)["handle"] as HTMLInputElement)
		.value;

	let domain = "";

	if (
		(handle.match(/@/g) ?? []).length <= 2 &&
		(handle.match(/@/g) ?? []).length >= 0
	)
		domain = handle.split("@")[(handle.match(/@/g) ?? []).length];
	else {
		console.error("Invalid handle");
		// TODO: Add error
	}

	store.auth.url = `https://${domain}`;
	store.auth.type = (
		(e.target as HTMLFormElement)["type"] as HTMLInputElement
	).value as any;

	const client = generator(store.auth.type as any, store.auth.url);

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

	const { clientId, clientSecret, url } = await client.registerApp(
		"Fedibase Web",
		{
			scopes: scope,
			redirect_uris: `http://${window.location.host}`,
		}
	);

	store.auth.clientId = clientId;
	store.auth.clientSecret = clientSecret;

	// Wait for localStorage to update
	setTimeout(() => {
		url && window.location.replace(url);
	}, 400);
};
</script>

<template>
	<div
		class="flex justify-center min-h-screen items-center bg-cover bg-center"
		:style="{
			backgroundImage: 'url(/static/wallpaper.webp)',
		}">
		<div
			class="py-6 w-[23rem] flex flex-col lg:px-0 bg-gray-100 dark:bg-dark-800 border-2 dark:border-dark-700 shadow-lg backdrop-blur-lg rounded-md">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<div class="flex justify-center w-auto"></div>
				<h2
					class="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-gray-50 font-poppins">
					Login
				</h2>
			</div>

			<div class="mt-12 sm:mx-auto sm:w-full">
				<div class="py-4 px-6">
					<h4 v-if="token" class="dark:text-gray-100">
						Validating...
					</h4>

					<form
						v-else
						class="space-y-6"
						action="#"
						method="POST"
						@submit="submit">
						<div class="flex flex-col gap-y-2">
							<Input
								:icon="IconUser"
								id="handle"
								name="handle"
								type="handle"
								autoComplete="url"
								required
								placeholder="@username@instance.com"
								isLoading="{isLoading}"
								class="block focus:outline-none sm:text-sm"
								:loading="loading" />
						</div>

						<select
							name="type"
							class="w-full px-3 py-2 placeholder-gray-500 dark:border-dark-700 bg-white rounded-md border border-gray-300 shadow-sm duration-200 appearance-none outline-none dark:text-gray-100 dark:bg-dark-800 disabled:bg-gray-100 focus:outline-none sm:text-sm">
							<option value="mastodon">Mastodon</option>
							<option value="pleroma">Pleroma / Akkoma</option>
							<option value="misskey">Misskey / *key</option>
						</select>

						<div>
							<Button
								type="submit"
								ringColor="orange-500"
								theme="gray"
								class="w-full text-white !bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] !from-pink-500 !via-red-500 !to-yellow-500"
								:loading="loading">
								Sign in
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
