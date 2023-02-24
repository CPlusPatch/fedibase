import MobileNavbar from "components/nav/MobileNavbar";
import LeftSidebar from "components/sidebar/LeftSidebar";
import NotificationsFeed from "components/feed/NotificationsFeed";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
	return (
		<div className="flex overflow-hidden flex-col w-full min-h-screen duration-200 bg-gradient-light">
			<Toaster />
			<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
				<main className="grow">
					<MobileNavbar />
					<div className="grid relative grid-cols-6 mx-auto max-w-full h-full md:grid-cols-11">
						<div className="hidden overflow-y-scroll max-h-screen md:col-span-3 md:block no-scroll">
							<LeftSidebar />
						</div>
						<div className="overflow-x-hidden overflow-y-hidden md:col-span-5 col-span-6 pt-20 max-h-screen md:border-x dark:border-gray-700 md:pt-0">
							{children}
						</div>
						<div className="hidden overflow-x-hidden p-4 min-w-0 max-h-screen md:col-span-3 md:flex">
							<NotificationsFeed />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}