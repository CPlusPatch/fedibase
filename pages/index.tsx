import MetaTags from "components/head/MetaTags";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "components/context/StateContext";
import { Conversation } from "components/feed/Conversation";
import { LocalFeed } from "components/feed/LocalFeed";
import { UserFeed } from "components/feed/UserFeed";
import { AuthContext } from "components/context/AuthContext";

const Home = () => {
	const [state, setState]: any = useContext(StateContext);
	const client = useContext(AuthContext);
	
	const [component, setComponent] = useState(<></>)

	const handlePopState = useCallback(
		(e: PopStateEvent) => {
			e.preventDefault();
			setState(s => ({
				...s,
				params: {},
			}));
			history.pushState(null, null, "/");
		},
		[setState],
	);

	useEffect(() => {
		if (window) {
			const paths = window.location.pathname.split("/");

			switch (paths[1]) {
				case "posts":
					setComponent(<Conversation id={paths[2]} />);
					break;
				case "local":
					setComponent(<LocalFeed />);
					break;
				case "":
					setComponent(<HomeFeed />);
					break;
				case "users":
					client.getAccount(paths[2].replace("@", "")).then(res => {
						setComponent(<UserFeed account={res.data} />);
					});
					break;
			}

			window.addEventListener("popstate", handlePopState);

			return () => window.removeEventListener("popstate", handlePopState);
		}
	}, [client, handlePopState]);

	return (
		<div className="relative duration-200 bg-dark font-inter">
			<MetaTags title={`Home · Fedibase`} />

			<Nav />

			<MainLayout>{component}</MainLayout>
		</div>
	);
};

export default Home;
