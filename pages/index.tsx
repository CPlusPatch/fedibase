import MetaTags from "components/head/MetaTags";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { useContext, useEffect } from "react";
import { StateContext } from "components/context/StateContext";
import { Conversation } from "components/feed/Conversation";

const Home = () => {
	const [state, setState]: any = useContext(StateContext);

	const handlePopState = e => {
		e.preventDefault();
		setState(s => ({
			...s,
			params: {}
		}));
		history.pushState(null, null, "/");
	};

	useEffect(() => {
		window.addEventListener("popstate", handlePopState)

		return () => window.removeEventListener("popstate", handlePopState);
	}, [])

	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`Home · Fedibase`} />

			<Nav current="/" />

			<MainLayout>{state?.params?.id ? <Conversation id={state.params.id} /> : <HomeFeed />}</MainLayout>
		</div>
	);
};

export default Home;
