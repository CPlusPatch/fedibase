import MetaTags from "components/head/MetaTags";
import LeftSidebar from "components/sidebar/LeftSidebar";
import Nav from "components/sidebar/Nav";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import { UserFeed } from "components/feed/UserFeed";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/context/AuthContext";
import { Response, Entity } from "megalodon";
import { getCookies } from "cookies-next";
import MainLayout from "components/layout/MainLayout";

const User = ({ id }) => {
	const client = useContext(AuthContext);
	const [account, setAccount] = useState<Entity.Account>();

	useEffect(() => {
		client.getAccount(id.replace("@", "")).then((res: Response<Entity.Account>) => {
			setAccount(res.data);
		});
	}, [client, id]);

	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`${account ? account.display_name : "Loading..."} · Fedibase`} />

			<Nav current="/" />

			<MainLayout>
				<UserFeed account={account} />
			</MainLayout>
		</div>
	);
};

export function getServerSideProps({ params, req, res }) {
	let { accessToken, instanceUrl, accountId, instanceType, handle } = getCookies({
		req,
		res,
	});

	if (accessToken && instanceUrl && instanceType && accountId && handle) {
		return {
			props: {
				id: params.id,
			},
		};
	} else {
		// If one of the cookies don't exist
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
}

export default User;
