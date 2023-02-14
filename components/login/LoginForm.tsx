import Head from "next/head";
import SmallLogo from "components/logo/SmallLogo";
import { useEffect, useState } from "react";
import Spinner from "components/spinners/Spinner";
import Link from "next/link";
import Button from "components/buttons/Button";
import MetaTags from "components/head/MetaTags";
import { setToLocalStorage } from "utils/functions";
import { getCookie, setCookie } from "cookies-next";
import { Input, Label } from "components/forms/Input";
import generator, { detector, OAuth } from "megalodon";
import Select from "components/forms/Select";
import { IconLetterC, IconLetterM, IconLetterP } from "@tabler/icons-react";

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

export default function LoginForm({ code }) {
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
			//TODO: put an error here.
			domain = "kitsunes.gay"
		}

		const instanceUrl = `https://${domain}`;

		setCookie("instanceUrl", instanceUrl);
		setCookie("handle", handle);

		const instanceType = selectedInstanceType.value;
		setCookie("instanceType", instanceType);

		const client = generator(instanceType as any, instanceUrl);

		const appData = await client.registerApp("Fedibase Web", {
			scopes: (instanceType === "misskey") ?? ["read:account","write:account","read:blocks","write:blocks","read:drive","write:drive","read:favorites","write:favorites","read:following","write:following","read:messaging","write:messaging","read:mutes","write:mutes","write:notes","read:notifications","write:notifications","read:reactions","write:reactions","write:votes","read:pages","write:pages","write:page-likes","read:page-likes","read:user-groups","write:user-groups","read:channels","write:channels","read:gallery","write:gallery","read:gallery-likes","write:gallery-likes"] : ["read", "write", "follow"],
			redirect_uris: `http://${window.location.host}/login`,
		});

		const { clientId, clientSecret, url } = appData;

		setCookie("clientId", clientId);
		setCookie("clientSecret", clientSecret);

		window.location.replace(url);
	};

	useEffect(() => {
		if (code !== "") {
			const instanceType = getCookie("instanceType").toString();
			const instanceUrl = getCookie("instanceUrl").toString();
			const clientId = getCookie("clientId").toString();
			const clientSecret = getCookie("clientSecret").toString();
			const handle = getCookie("handle").toString();

			const client = generator(instanceType as any, instanceUrl);

			client
				.fetchAccessToken(
					clientId,
					clientSecret,
					code,
					`http://${window.location.host}/login`,
					)
				.then(async (tokenData: OAuth.TokenData) => {
					setCookie("accessToken", tokenData.accessToken);

					// Needed in case instance restricts searching to authenticated users
					const client = generator(
						instanceType as any,
						instanceUrl,
						tokenData.accessToken,
					);

					// Find ID of logged in account
					client.verifyAccountCredentials().then(data => {
						setCookie("accountId", data.data.id);
						window.location.pathname = "/";
					});

					// should work now? lemme test
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
					<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 font-poppins">
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
									placeholder="@cpluspatch@kitsunes.gay"
									isLoading={isLoading}
									className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
									<Label>Fedi handle</Label>
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
							<h4>Validating...</h4>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
