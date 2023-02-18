import { IconMenu2 } from "@tabler/icons-react";
import Button from "components/buttons/Button";
import MobileNavbar from "components/nav/MobileNavbar";
import LeftSidebar from "components/sidebar/LeftSidebar";
import NotificationsFeed from "components/sidebar/NotificationsFeed";

export default function MainLayout({ children }) {
	return (
		<div className="flex flex-col w-full min-h-screen duration-200 bg-gradient-light">
			<div className="flex relative mx-auto w-full max-w-full h-full grow md:pl-[4.3rem]">
				<main className="grow">
					<MobileNavbar />
					<div className="grid relative grid-cols-6 mx-auto max-w-full h-full md:grid-cols-11">
						<div className="hidden overflow-y-scroll p-4 max-h-screen md:col-span-2 md:block no-scroll">
							<LeftSidebar />
						</div>
						<div className="overflow-x-hidden col-span-6 pt-20 max-h-screen md:border-x dark:border-gray-700 md:pt-0">
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