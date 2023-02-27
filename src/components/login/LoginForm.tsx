import SmallLogo from "components/logo/SmallLogo";
import { useEffect, useState } from "preact/hooks";
import Button from "components/buttons/Button";
import { Input, Label } from "components/forms/Input";
import generator, { OAuth } from "megalodon";
import Select from "components/forms/Select";
import { IconLetterC, IconLetterM, IconLetterP } from "@tabler/icons-preact";

const instanceTypes = [
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

	const [mode, setMode] = useState<"login" | "code">(code ? "code" : "login");
	const [selectedInstanceType, setSelectedInstanceType] = useState(instanceTypes[0]);

	const loginForm = async (event: any) => {
		event.preventDefault();
		setIsLoading(true);

		const handle = event.target["handle"].value;

		let domain: string = ""

		if (handle.match(/@/g).length <= 2 && handle.match(/@/g).length >= 0)
			domain = handle.split("@")[handle.match(/@/g).length]
		else {
			// TODO: put an error here.
			domain = "kitsunes.gay"
		}

		const instanceUrl = `https://${domain}`;
		const instanceType = selectedInstanceType.value;

		const client = generator(instanceType as any, instanceUrl);

		let scope = []
		if (instanceType === "misskey") scope = ["read:account","write:account","read:blocks","write:blocks","read:drive","write:drive","read:favorites","write:favorites","read:following","write:following","read:messaging","write:messaging","read:mutes","write:mutes","write:notes","read:notifications","write:notifications","read:reactions","write:reactions","write:votes","read:pages","write:pages","write:page-likes","read:page-likes","read:user-groups","write:user-groups","read:channels","write:channels","read:gallery","write:gallery","read:gallery-likes","write:gallery-likes"]
		else scope = ["read", "write", "follow"]

		const appData = await client.registerApp("Fedibase Web", {
			scopes: scope,
			redirect_uris: `http://${window.location.host}/login`,
		});

		const { clientId, clientSecret, url } = appData;

		localStorage.setItem("clientId", clientId);
		localStorage.setItem("clientSecret", clientSecret);
		localStorage.setItem("instanceUrl", instanceUrl);
		localStorage.setItem("handle", handle);
		localStorage.setItem("instanceType", instanceType);

		url && window.location.replace(url);
	};

	useEffect(() => {
		if (code !== "") {
			const instanceType = localStorage.getItem("instanceType");
			const instanceUrl = localStorage.getItem("instanceUrl");
			const clientId = localStorage.getItem("clientId");
			const clientSecret = localStorage.getItem("clientSecret");

			if (!instanceType || !instanceUrl || !clientId || !clientSecret) return;

			const client = generator(instanceType as any, instanceUrl);

			client
				.fetchAccessToken(
					clientId,
					clientSecret,
					code,
					`http://${window.location.host}/login`,
					)
				.then(async (tokenData: OAuth.TokenData) => {
					localStorage.setItem("accessToken", tokenData.accessToken);

					// Needed in case instance restricts searching to authenticated users
					const client = generator(
						instanceType as any,
						instanceUrl,
						tokenData.accessToken,
					);

					// Find ID of logged in account
					client.verifyAccountCredentials().then(data => {
						localStorage.setItem("accountId", data.data.id);
						window.location.pathname = "/";
					});
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

								<Select
									selected={selectedInstanceType}
									setSelected={setSelectedInstanceType}
									items={instanceTypes}
								/>

								<div>
									<Button
										type="submit"
										ringColor="orange-500"
										style="orange"
										className="w-full"
										isLoading={isLoading}>
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
