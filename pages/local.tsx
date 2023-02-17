import MetaTags from "components/head/MetaTags";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { Conversation } from "components/feed/Conversation";
import { LocalFeed } from "components/feed/LocalFeed";

const Local = () => {
	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`Post · Fedibase`} />

			<Nav />

			<MainLayout>
				<LocalFeed />
			</MainLayout>
		</div>
	);
};

export default Local;
