import MetaTags from "components/head/MetaTags";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";

const Home = () => {
	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`Home · Fedibase`} />

			<Nav current="/" />

			<MainLayout>
				<HomeFeed />
			</MainLayout>
		</div>
	);
};

export default Home;
