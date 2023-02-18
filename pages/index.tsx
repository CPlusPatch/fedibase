import MetaTags from "components/head/MetaTags";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "components/context/StateContext";
import { Conversation } from "components/feed/Conversation";
import { LocalFeed } from "components/feed/LocalFeed";

const Home = () => {
	const [state, setState]: any = useContext(StateContext);
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

			if (paths[1] === "posts") {
				setComponent(<Conversation id={paths[2]} />);
			} else if (paths[1] === "local") {
				setComponent(<LocalFeed />);
			} else if (paths[1] === "") {
				setComponent(<HomeFeed />);
			}

			window.addEventListener("popstate", handlePopState);

			return () => window.removeEventListener("popstate", handlePopState);
		}
	}, [handlePopState, state]);

	return (
		<div className="relative font-inter bg-dark">
			<MetaTags title={`Home · Fedibase`} />

			<Nav />

			<MainLayout>{component}</MainLayout>
		</div>
	);
};

export default Home;
