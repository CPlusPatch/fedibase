import MetaTags from "components/head/MetaTags";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import NotificationsFeed from "components/sidebar/NotificationsFeed";
import { getCookies } from "cookies-next";

const Home = () => {
	return (
		<div className="relative bg-gray-50">
			<MetaTags title={`Home · Fedibase`} />

			<Nav current="/" />

			<div className="flex flex-col w-full min-h-screen bg-gray-50 duration-200">
				<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
					<main className="grow">
						<div className="grid relative grid-cols-4 mx-auto max-w-full h-full md:grid-cols-11">
							<div className="hidden overflow-y-scroll p-4 max-h-screen md:col-span-2 md:block">
								<LeftSidebar />
							</div>
							<div className="overflow-y-scroll col-span-6 p-4 max-h-screen border-x">
								<HomeFeed />
							</div>
							<div className="hidden overflow-x-hidden p-4 min-w-0 max-h-screen md:col-span-3 md:flex">
								<NotificationsFeed />
							</div>
						</div>
					</main>
				</div>
			</div>
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
