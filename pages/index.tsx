import MetaTags from "components/head/MetaTags";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { useCallback, useContext, useEffect } from "react";
import { StateContext } from "components/context/StateContext";
import { Conversation } from "components/feed/Conversation";
import { LocalFeed } from "components/feed/LocalFeed";

const Home = () => {
	const [state, setState]: any = useContext(StateContext);

	const handlePopState = useCallback(e => {
		e.preventDefault();
		setState(s => ({
			...s,
			params: {}
		}));
		history.pushState(null, null, "/");
	}, [setState]);

	useEffect(() => {
		if (window) {
			window.addEventListener("popstate", handlePopState)
	
			return () => window.removeEventListener("popstate", handlePopState);
		}
	}, [handlePopState])

	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`Home · Fedibase`} />

			<Nav />

			<MainLayout>{state?.params?.id ? <Conversation id={state.params.id} /> : 
				state?.params?.type == "local" ? <LocalFeed /> : <HomeFeed />}</MainLayout>
		</div>
	);
};

export default Home;
