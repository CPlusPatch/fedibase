import MetaTags from "components/head/MetaTags";
import LeftSidebar from "components/sidebar/LeftSidebar";
import Nav from "components/sidebar/Nav";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import { UserFeed } from "components/feed/UserFeed";
import { getFromLocalStorage } from "utils/functions";
import { useContext, useEffect, useState } from "react";
import Login from "components/login/Login";
import { AuthContext } from "components/context/AuthContext";
import { Response, Entity } from "megalodon";

const User = ({ id }) => {
	const [accessToken, setAccessToken] = useState<string>("");
	const client = useContext(AuthContext);
	const [account, setAccount] = useState<Entity.Account>();

	useEffect(() => {
		client.getAccount(id.replace("@", "")).then((res: Response<Entity.Account>) => {
			setAccount(res.data);
		});

		setAccessToken(getFromLocalStorage("accessToken", ""));
	}, [client, id]);
	
	return (
		<div className="relative bg-gray-50">
			<MetaTags title={`${account ? account.display_name : "Loading..."} · Fedibase`} />

			{accessToken !== "" ? (
				<>
					<Nav current="/" />

					<div className="flex flex-col w-full min-h-screen bg-gray-50 duration-200">
						<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
							<main className="grow">
								<div className="grid relative grid-cols-4 mx-auto max-w-full h-full md:grid-cols-10">
									<div className="hidden overflow-y-scroll p-4 max-h-screen md:col-span-2 md:block">
										<LeftSidebar />
									</div>
									<div className="overflow-y-scroll col-span-5 p-4 max-h-screen border-x">
										<UserFeed account={account} />
									</div>
									<div className="hidden overflow-x-hidden p-4 min-w-0 max-h-screen md:col-span-3 md:flex">
										<NotificationsFeed />
									</div>
								</div>
							</main>
						</div>
					</div>
				</>
			) : (
				<>
					<Login />
				</>
			)}
		</div>
	);
};

export function getServerSideProps({ params, req, res }) {
	return {
		props: {
			id: params.id,
		},
	};
}

export default User;
