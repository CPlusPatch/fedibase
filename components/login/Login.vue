<script setup lang="ts">
import generator from "megalodon";
import { ref } from "vue";
import { useStore } from "../../utils/store";
import Button from "../button/Button.vue";
import Input from "../input/Input.vue";
import Select from "../select/Select.vue";
import { NotificationType, addNotification } from "../snackbar/Snackbar.vue";

const store = useStore();

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
			.then(tokenData => {
				store.auth.token = tokenData.accessToken;

				setTimeout(() => {
					window.location.href = "/";
				}, 400);
			});
	}
}

const submit = async (e: Event) => {
	e.preventDefault();
	loading.value = true;

	// let username = ((e.target as HTMLFormElement).username as HTMLInputElement)
	// .value;
	const instance = (
		(e.target as HTMLFormElement).instance as HTMLInputElement
	).value;

	// Placeholder, won't be used
	let domain = new URL("https://linux.pizza");
	try {
		domain = new URL(instance);
	} catch {
		try {
			domain = new URL("https://" + instance);
		} catch {
			loading.value = false;
			return addNotification(
				"Instance URL is invalid!",
				NotificationType.Error,
				"ic:round-error-outline"
			);
		}
	}

	store.auth.url = `https://${domain.host}`;
	store.auth.type = ((e.target as HTMLFormElement).type as HTMLInputElement)
		.value as any;

	const client = generator(store.auth.type as any, store.auth.url);

	const scope = ["read", "write", "follow"];

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
		class="flex justify-start min-h-screen bg-cover bg-center"
		:style="{
			backgroundImage: 'url(/static/loginbg.svg)',
		}">
		<div
			class="flex justify-center py-6 w-110 flex flex-col px-5 bg-gray-100 dark:bg-dark-800/75 backdrop-blur-xl shadow-lg">
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
						<div class="flex flex-col gap-2">
							<!-- <Input
								id="username"
								icon="ic:round-supervised-user-circle"
								name="username"
								required
								placeholder="mycleverusername"
								:loading="loading"
								class="focus:outline-none" /> -->
							<Input
								id="url"
								icon="ic:round-computer"
								name="instance"
								required
								placeholder="Instance URL (instance.com)"
								class="focus:outline-none"
								:loading="loading" />
						</div>

						<Select
							name="type"
							:items="[
								{
									text: 'Mastodon',
									value: 'mastodon',
									icon: 'logos:mastodon-icon',
								},
								{
									text: 'Pleroma',
									value: 'pleroma',
									icon: 'PleromaIcon',
								},
							]"
							:default-value="0">
						</Select>

						<div>
							<Button
								type="submit"
								ring-color="orange-500"
								theme="gradientOrange"
								class="w-full"
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
