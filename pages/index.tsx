import MetaTags from "components/head/MetaTags";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import { getCookies } from "cookies-next";
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

export function getServerSideProps({ req, res }) {
	let { accessToken, instanceUrl, accountId, instanceType, handle } = getCookies({
		req,
		res,
	});

	if (accessToken && instanceUrl && instanceType && accountId && handle) {
		return {
			props: {},
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

export default Home;
