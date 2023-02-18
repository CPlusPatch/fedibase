import MetaTags from "components/head/MetaTags";
import Nav from "components/sidebar/Nav";
import { UserFeed } from "components/feed/UserFeed";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/context/AuthContext";
import { Response, Entity } from "megalodon";
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
		<div className="relative bg-gray-50 dark:bg-gray-900 font-inter">
			<MetaTags title={`${account ? account.display_name : "Loading..."} · Fedibase`} />

			<Nav />

			<MainLayout>
				<UserFeed account={account} />
			</MainLayout>
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
