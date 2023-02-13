import MetaTags from "components/head/MetaTags";
import LoginForm from "components/login/LoginForm";
import Image from "next/image";
import wallpaper from "public/static/login-wallpaper.webp";

const LoginPage = ({ code }) => {
	return (
		<div className="relative bg-gray-100">
			<MetaTags title={`Login · Fedibase`} />

			{/* <div className="overflow-hidden absolute inset-0 w-full h-full -z-20">
				<Image src={wallpaper} className="object-cover w-screen h-screen" />
			</div>
			<div className="absolute inset-0 backdrop-filter backdrop-blur-lg -z-10"></div> */}

			<LoginForm code={code} />
		</div>
	);
};

export function getServerSideProps({ req, res, query }) {
	console.log(query);

	return {
		props: {
			code: query.code ?? ""
		},
	};
}

export default LoginPage;
