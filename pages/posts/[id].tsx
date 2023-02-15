import MetaTags from "components/head/MetaTags";
import Nav from "components/sidebar/Nav";
import MainLayout from "components/layout/MainLayout";
import { Conversation } from "components/feed/Conversation";

const User = ({ id }) => {
	return (
		<div className="relative bg-gray-50 font-inter">
			<MetaTags title={`Post · Fedibase`} />

			<Nav current="/" />

			<MainLayout>
				<Conversation id={id} />
			</MainLayout>
		</div>
	);
};

export function getServerSideProps({ params, req, res }) {
	return {
		props: {
			id: params.id,
		},
	};
}

export default User;
