import SmallLogo from "components/logo/SmallLogo";
import { useEffect, useState } from "preact/hooks";
import { Input, Label } from "components/forms/Input";
import generator, { OAuth } from "megalodon";
import { IconLetterC, IconLetterM, IconLetterP } from "@tabler/icons-preact";
import Select2, { SelectItem } from "components/forms/Select2";
import { toast } from "react-hot-toast";
import { Button } from "components/buttons/Button";
import { useBackupStore } from "utils/useBackupStore";
import { modifyStore } from "utils/functions";

const instanceTypes: SelectItem[] = [
	{
		icon: IconLetterP,
		text: "Pleroma · Akkoma",
		value: "pleroma",
	},
	{
		icon: IconLetterM,
		text: "Mastodon",
		value: "mastodon",
	},
	{
		icon: IconLetterC,
		text: "Misskey · Calckey",
		value: "misskey",
	},
];

export default function LoginForm({ code }: {
	code: string;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [mode,] = useState<"login" | "code">(code ? "code" : "login");
	const [selectedInstanceType, setSelectedInstanceType] = useState(instanceTypes[0]);
	const { store, setStore } = useBackupStore();

	const loginForm = async (event: any) => {
		event.preventDefault();
		setIsLoading(true);

		const handle = event.target["handle"].value;

		let domain = "";

		if (handle.match(/@/g).length <= 2 && handle.match(/@/g).length >= 0)
			domain = handle.split("@")[handle.match(/@/g).length];
		else {
			console.error("Invalid handle");
			// TODO: put an error here.
			domain = "kitsunes.gay";
		}

		const instanceUrl = `https://${domain}`;
		const instanceType = selectedInstanceType.value;

		const client = generator(instanceType as any, instanceUrl);

		let scope = [];
		if (instanceType === "misskey") scope = ["read:account","write:account","read:blocks","write:blocks","read:drive","write:drive","read:favorites","write:favorites","read:following","write:following","read:messaging","write:messaging","read:mutes","write:mutes","write:notes","read:notifications","write:notifications","read:reactions","write:reactions","write:votes","read:pages","write:pages","write:page-likes","read:page-likes","read:user-groups","write:user-groups","read:channels","write:channels","read:gallery","write:gallery","read:gallery-likes","write:gallery-likes"];
		else scope = ["read", "write", "follow"];

		const appData = await client.registerApp("Fedibase Web", {
			scopes: scope,
			redirect_uris: `http://${window.location.host}/login`,
		});

		const { clientId, clientSecret, url } = appData;

		setStore(prev => ({
			...prev,
			auth: {
				...prev.auth,
				clientSecret: clientSecret,
				clientId: clientId,
				handle: handle,
				type: instanceType as any,
				id: "",
				url: instanceUrl
			}
		}));

		url && window.location.replace(url);
	};

	useEffect(() => {
		if (code !== "") {
			console.log("logging in!");

			if (!store.auth.type || !store.auth.url || !store.auth.clientSecret) return console.error("Items missing in localStorage");

			const client = generator(store.auth.type as any, store.auth.url);

			client
				.fetchAccessToken(
					store.auth.clientId,
					store.auth.clientSecret,
					code,
					`http://${window.location.host}/login`,
				)
				.then(async (tokenData: OAuth.TokenData) => {
					const client = generator(store.auth.type as any, store.auth.url, tokenData.accessToken);
					// Find ID of logged in account
					client.verifyAccountCredentials().then(data => {
						console.log(tokenData.accessToken);


						setStore(prev => ({
							...prev,
							auth: {
								...prev.auth,
								token: tokenData.accessToken,
								id: data.data.id
							}
						}));

						// Wait for localStorage to update
						setTimeout(() => {
							window.location.href = "/";
						}, 1000);
					});
				}).catch(err => {
					console.error(err);
					toast.error("Couldn't fetch access token :(");
				});
		}
	}, [code]);

	return (
		<div className="flex justify-center min-h-screen">
			<div className="py-12 w-[30rem] flex flex-col justify-center sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex justify-center w-auto">
						<SmallLogo size="w-12" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-gray-50 font-poppins">
						Login
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="px-4 py-8 sm:px-10 font-inter">
						{mode == "login" ? (
							<form
								className="space-y-6"
								action="#"
								method="POST"
								onSubmit={loginForm}>
								<Input
									id="handle"
									name="handle"
									type="handle"
									autoComplete="url"
									required
									placeholder="@cpluspatch@fedi.cpluspatch.com"
									isLoading={isLoading}
									className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none dark:placeholder-gray-500 dark:border-gray-600 disabled:bg-gray-100 disabled:dark:bg-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
									<Label htmlFor="handle">Fedi handle</Label>
								</Input>

								<Select2
									defaultValue={0}
									onChange={item => {
										setSelectedInstanceType(item);
									}}
									items={instanceTypes}
								/>

								<div>
									<Button
										type="submit"
										ringColor="orange-500"
										theme="orange"
										className="w-full"
										loading={isLoading}>
										Sign in
									</Button>
								</div>
							</form>
						) : (
							<h4 className="dark:text-gray-100">Validating...</h4>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
