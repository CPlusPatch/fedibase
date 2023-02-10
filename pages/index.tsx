import type { NextPage } from "next";
import MetaTags from "components/head/MetaTags";
import LeftSidebar from "components/sidebar/LeftSidebar";
import { HomeFeed } from "components/feed/HomeFeed";
import Nav from "components/sidebar/Nav";
import NotificationsFeed from "components/sidebar/NotificationsFeed";

const Home: NextPage = () => {
	return (
		<div className="relative bg-gray-50">
			<MetaTags title={`${process.env.NEXT_PUBLIC_AUTHOR_NAME} · Web Development`} />

			<Nav current="/" />

			<div className="flex flex-col w-full min-h-screen bg-gray-50 duration-200">
				<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.7rem]">
					<main className="grow">
						<div className="grid relative grid-cols-4 mx-auto max-w-full h-full md:grid-cols-10">
							<div className="hidden overflow-y-scroll p-4 max-h-screen md:col-span-2 md:block">
								<LeftSidebar />
							</div>
							<div className="overflow-y-scroll col-span-5 p-4 max-h-screen border-x">
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

export default Home;