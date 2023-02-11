import Head from "next/head";
import SmallLogo from "components/logo/SmallLogo";
import { useState } from "react";
import Spinner from "components/spinners/Spinner";
import Link from "next/link";
import Button from "components/buttons/Button";
import MetaTags from "components/head/MetaTags";
import { setToLocalStorage } from "utils/functions";
import { setCookie } from "cookies-next";
import { Input, Label } from "components/forms/Input";
import generator, { detector } from "megalodon";

export default function Login() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const loginForm = async (event: any) => {
		event.preventDefault();
		setIsLoading(true);

		setCookie("instanceUrl", event.target["url"].value);
		setCookie("handle", event.target["handle"].value);
		setCookie("accessToken", event.target["token"].value);

		const instanceType = event.target["type"].value;
		setCookie("instanceType", instanceType);

		const client = generator(instanceType, event.target["url"].value, event.target["token"].value);

		// Find ID of logged in account :( im sowwy
		const accountIds = await client.searchAccount(event.target["handle"].value);
		
		accountIds.data.map(account => {
			// bad hack but IT WORKS!!
			if (account.acct == event.target["handle"].value.split("@")[1]) {
				setCookie("accountId", account.id);

				setIsLoading(false);
				window.location.reload();
			}
		});
	}
	
	return (
		<div className="min-h-screen bg-gray-50">
			<MetaTags title="Please sign in" />

			<div className="flex flex-col justify-center py-12 min-h-screen sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex justify-center w-auto">
						<SmallLogo size="w-12" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 font-poppins">
						Enter credentials:
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10 font-inter">
						<form className="space-y-6" action="#" method="POST" onSubmit={loginForm}>
							<Input
								id="url"
								name="url"
								type="url"
								autoComplete="url"
								required
								placeholder="https://fedi.cpluspatch.com"
								isLoading={isLoading}
								className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
								<Label>Instance URL</Label>
							</Input>

							<Input
								id="handle"
								name="handle"
								type="text"
								required
								placeholder="@cpluspatch@fedi.cpluspatch.com"
								isLoading={isLoading}
								className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
								<Label>Fedi handle</Label>
							</Input>

							<Input
								id="token"
								name="token"
								type="password"
								required
								isLoading={isLoading}
								className="block px-3 py-2 w-full placeholder-gray-400 rounded-md border border-gray-300 shadow-sm duration-200 appearance-none disabled:bg-gray-100 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
								<Label>Token</Label>
							</Input>

							<select id="type" name="type">
								<option value="pleroma">pleroma</option>
								<option value="mastodon">mastodon</option>
								<option value="misskey">misskey</option>
							</select>

							<div>
								<Button
									type="submit"
									ringColor="orange-500"
									style="orange"
									className="w-full">
									{isLoading ? (
										<Spinner className="w-[1.1rem] h-[1.1rem] text-orange-500 fill-white" />
									) : (
										<>Sign in</>
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}